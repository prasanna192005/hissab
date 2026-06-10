import { NextRequest, NextResponse } from "next/server";

// Helper for fetch retries with exponential backoff and model fallback
async function fetchWithRetryAndFallback(
  model: string,
  fallbackModel: string,
  apiKey: string,
  requestBody: any,
  retries = 2,
  delay = 500
): Promise<Response> {
  let currentModel = model;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`;
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });
      
      if (response.ok) {
        return response;
      }
      
      // Retry on 503 (Unavailable/Overloaded) or 429 (Rate Limited)
      if ((response.status === 503 || response.status === 429) && attempt < retries) {
        console.warn(`Attempt ${attempt + 1} for ${currentModel} returned ${response.status}. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // exponential backoff
        continue;
      }
      
      // If the primary model fails after retries, fallback to the lighter model
      if (currentModel !== fallbackModel) {
        console.warn(`Primary model ${currentModel} failed or was overloaded. Swapping to fallback model ${fallbackModel}...`);
        currentModel = fallbackModel;
        attempt = -1; // Reset attempts to start fresh with fallback
        delay = 500;  // Reset delay
        continue;
      }
      
      return response; // Return the final error response if fallback also fails
    } catch (error) {
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }
      if (currentModel !== fallbackModel) {
        currentModel = fallbackModel;
        attempt = -1;
        delay = 500;
        continue;
      }
      throw error;
    }
  }
  
  throw new Error("API call failed after retries and model fallbacks");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, people, items } = body;

    if (!text || !people || !items) {
      return NextResponse.json(
        { error: "Missing required parameters: text, people, and items" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback to rule-based parser if API key is not configured
    if (!apiKey || apiKey.trim() === "") {
      console.warn("GEMINI_API_KEY is not configured. Using rule-based fallback for assignment.");
      
      const assignments: { itemName: string; assignedPeople: string[] }[] = [];
      const lowerText = text.toLowerCase();
      const meName = people[0] || "User";

      // Simple keyword matching for demo/fallback
      for (const item of items) {
        const itemLower = item.toLowerCase();
        const assigned: string[] = [];

        // Check if item name is mentioned in the text (fuzzy matching)
        const isItemMentioned = itemLower.split(" ").some((word: string) => 
          word.length > 3 && lowerText.includes(word)
        ) || lowerText.includes(itemLower);

        if (isItemMentioned) {
          // Check who is mentioned near this item or in the text
          if (lowerText.includes("everyone") || lowerText.includes("all") || lowerText.includes("each")) {
            assigned.push(...people);
          } else {
            // Check individual people
            for (let idx = 0; idx < people.length; idx++) {
              const person = people[idx];
              const personLower = person.toLowerCase();
              if (lowerText.includes(personLower)) {
                assigned.push(person);
              }
            }
            // Check "I" or "me" or "my" or "we"
            const hasI = /\b(i|me|my|we|shared with me)\b/i.test(lowerText);
            if (hasI && !assigned.includes(meName) && people.includes(meName)) {
              assigned.push(meName);
            }
          }
        }

        if (assigned.length > 0) {
          assignments.push({
            itemName: item,
            assignedPeople: Array.from(new Set(assigned))
          });
        }
      }

      return NextResponse.json({ assignments });
    }

    const prompt = `You are an expert receipt bill splitter AI.
Analyze this user request text to map people to the items they consumed, including specific quantities where mentioned.

User Text: "${text}"

Available People:
${JSON.stringify(people)}

Available Items (with their total quantities):
${JSON.stringify(items)}

Guidelines:
1. Map people to the items they ate or shared.
2. If "everyone" or "all" is mentioned, assign ALL people to that item (no quantitySplits needed).
3. If "I", "me", "my" is mentioned, it refers to the first person in the list ("${people[0]}").
4. Handle fuzzy matches (e.g., "pizza" → any item with "Pizza" in the name, "coke" → "Coke").
5. Return assignments ONLY for items mentioned in the text.
6. IMPORTANT — Quantity Splits: If the user specifies how many units each person had (e.g., "Prasanna had 2 papad and Rahul had 3"), return a "quantitySplits" array with each person and their qty. The sum of quantitySplits.qty should not exceed the item's total qty. If no specific quantities per person are mentioned, leave quantitySplits empty and use assignedPeople instead.

Return a JSON object with this schema:
{
  "assignments": [
    {
      "itemName": "The exact item name from Available Items",
      "assignedPeople": ["Names from Available People — used when no quantity split"],
      "quantitySplits": [
        { "person": "Name from Available People", "qty": 2 }
      ]
    }
  ]
}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            assignments: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  itemName: { type: "STRING" },
                  assignedPeople: {
                    type: "ARRAY",
                    items: { type: "STRING" }
                  },
                  quantitySplits: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        person: { type: "STRING" },
                        qty: { type: "INTEGER" }
                      },
                      required: ["person", "qty"]
                    }
                  }
                },
                required: ["itemName", "assignedPeople", "quantitySplits"]
              }
            }
          },
          required: ["assignments"]
        }
      }
    };

    // Execute with primary model: gemini-3.1-flash-lite, and fallback: gemini-3.5-flash
    const response = await fetchWithRetryAndFallback(
      "gemini-3.1-flash-lite",
      "gemini-3.5-flash",
      apiKey,
      requestBody
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error in assignment mapping:", errorText);
      
      let parsedError;
      try {
        parsedError = JSON.parse(errorText);
      } catch (e) {}

      const message = parsedError?.error?.message || "Gemini service is currently overloaded";
      return NextResponse.json(
        { error: message, status: response.status },
        { status: response.status }
      );
    }

    const result = await response.json();
    const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      throw new Error("Empty response from Gemini API");
    }

    const parsedData = JSON.parse(textResponse);
    return NextResponse.json({
      assignments: parsedData.assignments || []
    });
  } catch (error: any) {
    console.error("Error parsing assignment text:", error);
    return NextResponse.json(
      { error: error.message || "Failed to map assignments" },
      { status: 500 }
    );
  }
}
