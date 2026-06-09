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
    const { file, mimeType, text } = body;

    if (!file && !text) {
      return NextResponse.json(
        { error: "No file content or text provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback to demo mode if API key is not configured
    if (!apiKey || apiKey.trim() === "") {
      console.warn("GEMINI_API_KEY is not configured. Returning mock demo data.");
      
      // Simulate network delay for realistic experience
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return NextResponse.json({
        items: [
          { name: "Margherita Pizza", qty: 1, unitPrice: 299.0, lowConfidence: false },
          { name: "Farmhouse Pizza", qty: 1, unitPrice: 399.0, lowConfidence: false },
          { name: "Garlic Bread", qty: 2, unitPrice: 99.0, lowConfidence: false },
          { name: "Coke", qty: 4, unitPrice: 45.0, lowConfidence: false },
          { name: "Chocolate Brownie", qty: 2, unitPrice: 120.0, lowConfidence: true }
        ],
        isDemo: true
      });
    }

    const prompt = `Extract all individual items from this receipt. For each item, extract the name, quantity, and unit price. Normalize item names to be short, standard, title-cased English words (e.g. correct abbreviations, spelling errors). Skip tax, tips, service charge, card fees, subtotal, and total amount. If a quantity is not specified, default to 1. If unit price is not clear, divide the line total by quantity. Identify if the item is extracted with low confidence (flag lowConfidence as true).`;

    let requestBody;

    if (text) {
      // Raw Text parsing mode
      requestBody = {
        contents: [
          {
            parts: [
              {
                text: `Below is raw OCR text extracted from a restaurant receipt. Extract the items into JSON.\n\nRaw OCR Text:\n"""\n${text}\n"""\n\nInstructions:\n${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              items: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    name: { type: "STRING" },
                    qty: { type: "INTEGER" },
                    unitPrice: { type: "NUMBER" },
                    lowConfidence: { type: "BOOLEAN" }
                  },
                  required: ["name", "qty", "unitPrice", "lowConfidence"]
                }
              }
            },
            required: ["items"]
          }
        }
      };
    } else {
      // Image Vision parsing mode
      // Strip base64 metadata prefix if present
      let base64Data = file;
      if (base64Data.includes(";base64,")) {
        base64Data = base64Data.split(";base64,")[1];
      }

      requestBody = {
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || "image/jpeg",
                  data: base64Data
                }
              },
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
              items: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    name: { type: "STRING" },
                    qty: { type: "INTEGER" },
                    unitPrice: { type: "NUMBER" },
                    lowConfidence: { type: "BOOLEAN" }
                  },
                  required: ["name", "qty", "unitPrice", "lowConfidence"]
                }
              }
            },
            required: ["items"]
          }
        }
      };
    }

    // Execute with primary model: gemini-3.1-flash-lite, and fallback: gemini-3.5-flash
    const response = await fetchWithRetryAndFallback(
      "gemini-3.1-flash-lite",
      "gemini-3.5-flash",
      apiKey,
      requestBody
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error after fallbacks:", errorText);
      
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
      items: parsedData.items || [],
      isDemo: false
    });
  } catch (error: any) {
    console.error("Error parsing receipt:", error);
    return NextResponse.json(
      { error: error.message || "Failed to parse receipt" },
      { status: 500 }
    );
  }
}
