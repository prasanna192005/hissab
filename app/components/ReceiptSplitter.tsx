"use client";

import React, { useState, useEffect, useRef } from "react";

// Inline SVG Icons
const Icons = {
  Upload: () => (
    <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ),
  User: () => (
    <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  Share: () => (
    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
    </svg>
  ),
  Warning: () => (
    <svg className="w-4 h-4 text-amber-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  Camera: () => (
    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
  ),
  Eye: () => (
    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Barcode: () => (
    <svg className="h-9 w-48 mx-auto opacity-75 text-stone-800" viewBox="0 0 100 20" fill="currentColor">
      <rect x="0" width="2.5" height="20" />
      <rect x="3.5" width="1" height="20" />
      <rect x="5.5" width="3" height="20" />
      <rect x="10" width="1" height="20" />
      <rect x="12" width="2" height="20" />
      <rect x="15.5" width="4.5" height="20" />
      <rect x="22" width="1" height="20" />
      <rect x="24.5" width="2.5" height="20" />
      <rect x="29" width="3" height="20" />
      <rect x="34" width="1" height="20" />
      <rect x="36.5" width="2" height="20" />
      <rect x="40" width="4" height="20" />
      <rect x="46" width="1" height="20" />
      <rect x="48.5" width="2" height="20" />
      <rect x="52.5" width="3.5" height="20" />
      <rect x="58" width="1" height="20" />
      <rect x="60" width="2" height="20" />
      <rect x="63.5" width="4.5" height="20" />
      <rect x="70" width="1" height="20" />
      <rect x="72.5" width="2.5" height="20" />
      <rect x="77" width="3" height="20" />
      <rect x="82" width="1" height="20" />
      <rect x="84.5" width="2" height="20" />
      <rect x="88" width="4" height="20" />
      <rect x="94" width="2" height="20" />
      <rect x="98.5" width="1.5" height="20" />
    </svg>
  )
};

type Step = "UPLOAD" | "PARSING" | "REVIEW" | "PEOPLE" | "ASSIGN" | "SETTLEMENT";

interface Item {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  lowConfidence?: boolean;
}

export default function ReceiptSplitter() {
  const [step, setStep] = useState<Step>("UPLOAD");
  const [fileData, setFileData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  
  const [items, setItems] = useState<Item[]>([]);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [people, setPeople] = useState<string[]>([]);
  const [assignments, setAssignments] = useState<Record<string, string[]>>({});
  const [payer, setPayer] = useState<string>("");
  const [gst, setGst] = useState<number>(0);
  const [serviceCharge, setServiceCharge] = useState<number>(0);
  const [tip, setTip] = useState<number>(0);

  // UPI payment configurations
  const [upiId, setUpiId] = useState("");
  const [expandedQrPerson, setExpandedQrPerson] = useState<string | null>(null);

  // Tab warning notification state
  const [tabWarning, setTabWarning] = useState<string | null>(null);

  // OCR choices
  const [ocrEngine, setOcrEngine] = useState<"gemini" | "tesseract">("gemini");
  const [tesseractProgress, setTesseractProgress] = useState("");

  // NLP natural language assignment input
  const [nlpText, setNlpText] = useState("");
  const [nlpLoading, setNlpLoading] = useState(false);

  // Error/validation states
  const [validationWarning, setValidationWarning] = useState<{
    type: "UNASSIGNED" | "SINGLE_PAYER";
    message: string;
    action: () => void;
  } | null>(null);

  // OCR process states
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [parsingTime, setParsingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Suggestions for people list
  const [suggestedPeople, setSuggestedPeople] = useState<string[]>([]);

  // Show/Hide receipt preview panel in review mode
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);

  // Load previous participants and UPI ID on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("receiptsplit_previous_people");
      if (stored) {
        setSuggestedPeople(JSON.parse(stored));
      }
      const storedUpi = localStorage.getItem("receiptsplit_payer_upi_id");
      if (storedUpi) {
        setUpiId(storedUpi);
      }
    } catch (e) {
      console.error("Failed to load historical people or UPI ID", e);
    }
  }, []);

  // Handler to update UPI ID and persist to localStorage
  const handleUpiChange = (val: string) => {
    const trimmed = val.trim();
    setUpiId(trimmed);
    try {
      localStorage.setItem("receiptsplit_payer_upi_id", trimmed);
    } catch (e) {
      console.error("Failed to save UPI ID to localStorage", e);
    }
  };

  // Auto-clear tab warning notifications
  useEffect(() => {
    if (tabWarning) {
      const timer = setTimeout(() => {
        setTabWarning(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [tabWarning]);

  // Sync default payer when people list changes
  useEffect(() => {
    if (people.length > 0 && !people.includes(payer)) {
      setPayer(people[0]);
    }
  }, [people, payer]);

  // Handle OCR parsing timer
  useEffect(() => {
    if (step === "PARSING") {
      setParsingTime(0);
      timerRef.current = setInterval(() => {
        setParsingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  // Helper to compress image client-side using HTML5 Canvas
  const compressImage = (file: File, maxWidth = 800, quality = 0.5): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      // Safety timeout to prevent hanging if image load stalls
      const timeoutId = setTimeout(() => {
        reject(new Error("Image compression timed out"));
      }, 3000);

      if (file.type === "application/pdf") {
        clearTimeout(timeoutId);
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            base64: e.target?.result as string,
            mimeType: file.type
          });
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          clearTimeout(timeoutId);
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas context is null"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          
          try {
            const base64 = canvas.toDataURL("image/jpeg", quality);
            resolve({ base64, mimeType: "image/jpeg" });
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = (err) => {
          clearTimeout(timeoutId);
          reject(err);
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => {
        clearTimeout(timeoutId);
        reject(err);
      };
      reader.readAsDataURL(file);
    });
  };

  // Load Tesseract.js dynamically from CDN
  const loadTesseract = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (typeof window !== "undefined" && (window as any).Tesseract) {
        resolve((window as any).Tesseract);
        return;
      }
      
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
      script.async = true;
      script.onload = () => {
        resolve((window as any).Tesseract);
      };
      script.onerror = () => {
        reject(new Error("Failed to load local Tesseract.js script from CDN"));
      };
      document.head.appendChild(script);
    });
  };

  // Read file contents with client-side compression or local Tesseract OCR
  const processFile = async (file: File) => {
    if (!file) return;
    setFileName(file.name);
    setOcrError(null);
    setStep("PARSING");
    
    if (ocrEngine === "tesseract") {
      setTesseractProgress("Loading local OCR engine...");
      try {
        const TesseractLib = await loadTesseract();
        
        // Read file raw base64 for preview display
        const reader = new FileReader();
        reader.onload = (e) => {
          setFileData(e.target?.result as string);
          setMimeType(file.type);
        };
        reader.readAsDataURL(file);

        setTesseractProgress("Extracting text locally...");
        const result = await TesseractLib.recognize(file, "eng", {
          logger: (m: any) => {
            if (m.status === "recognizing") {
              setTesseractProgress(`Extracting text locally (${Math.round(m.progress * 100)}%)...`);
            }
          }
        });

        const rawText = result.data.text;
        if (!rawText || !rawText.trim()) {
          throw new Error("Tesseract did not find any text in this receipt.");
        }

        setTesseractProgress("Structuring receipt data with AI...");
        await triggerOcrTextParsing(rawText);
      } catch (err: any) {
        console.error("Tesseract parsing failed:", err);
        setOcrError(err.message || "Failed to extract text locally.");
        setStep("UPLOAD");
      }
    } else {
      setTesseractProgress("");
      try {
        const { base64, mimeType: compressedMime } = await compressImage(file);
        setFileData(base64);
        setMimeType(compressedMime);
        
        // Trigger AI parsing request with compressed data
        triggerOcrParsing(base64, compressedMime);
      } catch (err: any) {
        console.error("Image compression failed, trying direct upload...", err);
        // Fallback to direct file read if compression fails
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setFileData(result);
          setMimeType(file.type);
          triggerOcrParsing(result, file.type);
        };
        reader.onerror = () => {
          setOcrError("Failed to read receipt file.");
          setStep("UPLOAD");
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const triggerOcrParsing = async (base64String: string, fileMimeType: string) => {
    setStep("PARSING");
    setOcrError(null);
    try {
      const res = await fetch("/api/parse-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: base64String, mimeType: fileMimeType })
      });

      let data;
      try {
        data = await res.json();
      } catch (e) {}

      if (!res.ok) {
        const errMsg = data?.error || `Server responded with ${res.status}`;
        throw new Error(errMsg);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      // Add a unique ID to each item parsed
      const parsedItems = (data.items || []).map((item: any) => ({
        ...item,
        id: Math.random().toString(36).substring(2, 9)
      }));

      setItems(parsedItems);
      setIsDemoMode(!!data.isDemo);
      setStep("REVIEW");
    } catch (err: any) {
      console.error(err);
      setOcrError(err.message || "Something went wrong while extracting items.");
      setStep("UPLOAD");
    }
  };

  const triggerOcrTextParsing = async (rawText: string) => {
    setOcrError(null);
    try {
      const res = await fetch("/api/parse-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText })
      });

      let data;
      try {
        data = await res.json();
      } catch (e) {}

      if (!res.ok) {
        const errMsg = data?.error || `Server responded with ${res.status}`;
        throw new Error(errMsg);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      // Add a unique ID to each item parsed
      const parsedItems = (data.items || []).map((item: any) => ({
        ...item,
        id: Math.random().toString(36).substring(2, 9)
      }));

      setItems(parsedItems);
      setIsDemoMode(!!data.isDemo);
      setStep("REVIEW");
    } catch (err: any) {
      console.error(err);
      setOcrError(err.message || "Failed to structure receipt text.");
      setStep("UPLOAD");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Manual fallback setup
  const handleManualEntry = () => {
    setItems([
      { id: Math.random().toString(36).substring(2, 9), name: "Margherita Pizza", qty: 1, unitPrice: 299 },
      { id: Math.random().toString(36).substring(2, 9), name: "Coke", qty: 2, unitPrice: 45 }
    ]);
    setIsDemoMode(false);
    setFileData(null);
    setFileName("Manual Entry");
    setStep("REVIEW");
  };

  // Review screen handlers
  const handleAddItem = () => {
    const newItem: Item = {
      id: Math.random().toString(36).substring(2, 9),
      name: "",
      qty: 1,
      unitPrice: 0
    };
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof Item, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          let parsedVal = value;
          if (field === "qty") parsedVal = parseInt(value) || 0;
          if (field === "unitPrice") parsedVal = parseFloat(value) || 0;
          return { ...item, [field]: parsedVal };
        }
        return item;
      })
    );
  };

  // People screen handlers
  const [personInput, setPersonInput] = useState("");
  
  const handleAddPerson = (nameText: string) => {
    const name = nameText.trim();
    if (!name) return;
    if (people.includes(name)) return;
    setPeople([...people, name]);
    setPersonInput("");
  };

  const handleRemovePerson = (name: string) => {
    setPeople(people.filter((p) => p !== name));
    // Remove person from all assignments
    const updatedAssignments = { ...assignments };
    Object.keys(updatedAssignments).forEach((itemId) => {
      updatedAssignments[itemId] = updatedAssignments[itemId].filter((p) => p !== name);
    });
    setAssignments(updatedAssignments);
  };

  const handleAddAllSuggestions = () => {
    const combined = Array.from(new Set([...people, ...suggestedPeople]));
    setPeople(combined);
  };

  // Assignment handlers
  const toggleAssignment = (itemId: string, person: string) => {
    const current = assignments[itemId] || [];
    let updated: string[];
    if (current.includes(person)) {
      updated = current.filter((p) => p !== person);
    } else {
      updated = [...current, person];
    }
    setAssignments({
      ...assignments,
      [itemId]: updated
    });
  };

  const assignAllToItem = (itemId: string) => {
    setAssignments({
      ...assignments,
      [itemId]: [...people]
    });
  };

  const clearItemAssignments = (itemId: string) => {
    setAssignments({
      ...assignments,
      [itemId]: []
    });
  };

  // NLP natural language assignment
  const handleNlpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlpText.trim()) return;
    setNlpLoading(true);
    try {
      const res = await fetch("/api/parse-assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: nlpText,
          people,
          items: items.map((i) => i.name)
        })
      });
      const data = await res.json();
      if (data.assignments) {
        const updated = { ...assignments };
        data.assignments.forEach((asg: any) => {
          // Find matching item by name (fuzzy case insensitive)
          const matchedItem = items.find(
            (item) => item.name.trim().toLowerCase() === asg.itemName.trim().toLowerCase()
          );
          if (matchedItem) {
            // Map list of names returned
            const validNames = asg.assignedPeople.filter((p: string) => people.includes(p));
            updated[matchedItem.id] = validNames;
          }
        });
        setAssignments(updated);
        setNlpText("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setNlpLoading(false);
    }
  };

  // Warning check prior to final calculation
  const handleProceedToSettlement = () => {
    // Check 1: Are there any items with 0 people assigned?
    const unassignedItems = items.filter((item) => !assignments[item.id] || assignments[item.id].length === 0);
    
    if (unassignedItems.length > 0) {
      setValidationWarning({
        type: "UNASSIGNED",
        message: `There are ${unassignedItems.length} item(s) without anyone assigned. They will not be counted in individual splits.`,
        action: () => {
          setValidationWarning(null);
          // Assign everyone to remaining unassigned items as fallback option
          const updatedAssignments = { ...assignments };
          unassignedItems.forEach((item) => {
            updatedAssignments[item.id] = [...people];
          });
          setAssignments(updatedAssignments);
          setStep("SETTLEMENT");
        }
      });
      return;
    }

    // Check 2: Single person assigned to 100% of the bill?
    const { totals } = calculateSplits();
    const activeDebtors = Object.keys(totals).filter(name => totals[name] > 0);
    if (activeDebtors.length === 1) {
      const soleDebtor = activeDebtors[0];
      setValidationWarning({
        type: "SINGLE_PAYER",
        message: `You've assigned the entire bill to just ${soleDebtor}. Did you mean to split items equally among participants?`,
        action: () => {
          setValidationWarning(null);
          // Split everything equally among everyone
          const updated: Record<string, string[]> = {};
          items.forEach((item) => {
            updated[item.id] = [...people];
          });
          setAssignments(updated);
        }
      });
      return;
    }

    // Save current people to historical storage
    try {
      localStorage.setItem("receiptsplit_previous_people", JSON.stringify(people));
    } catch (e) {
      console.error(e);
    }

    setStep("SETTLEMENT");
  };

  // Perform split computations
  const calculateSplits = () => {
    const totals: Record<string, number> = {};
    people.forEach((p) => {
      totals[p] = 0;
    });

    let itemsTotal = 0;
    items.forEach((item) => {
      const assigned = assignments[item.id] || [];
      const itemCost = item.qty * item.unitPrice;
      itemsTotal += itemCost;

      if (assigned.length > 0) {
        const splitCost = itemCost / assigned.length;
        assigned.forEach((person) => {
          totals[person] = (totals[person] || 0) + splitCost;
        });
      }
    });

    // Proportional GST + Service Charge distribution based on consumed item shares
    const totalExtraTaxes = gst + serviceCharge;
    if (totalExtraTaxes > 0 && itemsTotal > 0) {
      people.forEach((p) => {
        const personSubtotal = totals[p] || 0;
        const taxShare = (personSubtotal / itemsTotal) * totalExtraTaxes;
        totals[p] = personSubtotal + taxShare;
      });
    }

    // Flat distribution for Tip/Round-off
    const tipShare = tip > 0 ? tip / people.length : 0;
    if (tipShare > 0) {
      people.forEach((p) => {
        totals[p] = (totals[p] || 0) + tipShare;
      });
    }

    const grandTotal = itemsTotal + gst + serviceCharge + tip;

    return { totals, itemsTotal, grandTotal };
  };

  const { totals, itemsTotal, grandTotal } = calculateSplits();

  // Generate WhatsApp message
  const getWhatsAppShareLink = () => {
    let msg = `*Hissab Bill Settlement Summary*\n`;
    msg += `Total Amount: ₹${grandTotal.toFixed(2)}\n`;
    msg += `(Subtotal: ₹${itemsTotal.toFixed(2)}`;
    if (gst > 0) msg += ` + GST: ₹${gst.toFixed(2)}`;
    if (serviceCharge > 0) msg += ` + Svc Chg: ₹${serviceCharge.toFixed(2)}`;
    if (tip > 0) msg += ` + Tip: ₹${tip.toFixed(2)}`;
    msg += `)\n`;
    msg += `Payer: *${payer}*\n\n`;
    msg += `*Individual Shares:*\n`;
    
    people.forEach((person) => {
      const share = totals[person] || 0;
      if (person === payer) {
        msg += `- ${person}: ₹${share.toFixed(2)} (Paid the bill)\n`;
      } else {
        msg += `- ${person}: ₹${share.toFixed(2)} (owes ${payer} ₹${share.toFixed(2)})\n`;
      }
    });

    msg += `\nSplit easily with Hissab!`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  };

  const copySummaryToClipboard = () => {
    let msg = `Hissab Bill Settlement Summary\n`;
    msg += `Total Amount: ₹${grandTotal.toFixed(2)}\n`;
    msg += `(Subtotal: ₹${itemsTotal.toFixed(2)}`;
    if (gst > 0) msg += ` + GST: ₹${gst.toFixed(2)}`;
    if (serviceCharge > 0) msg += ` + Svc Chg: ₹${serviceCharge.toFixed(2)}`;
    if (tip > 0) msg += ` + Tip: ₹${tip.toFixed(2)}`;
    msg += `)\n`;
    msg += `Payer: ${payer}\n\n`;
    msg += `Individual Shares:\n`;
    
    people.forEach((person) => {
      const share = totals[person] || 0;
      if (person === payer) {
        msg += `- ${person}: ₹${share.toFixed(2)} (Paid the bill)\n`;
      } else {
        msg += `- ${person}: ₹${share.toFixed(2)} (owes ${payer} ₹${share.toFixed(2)})\n`;
      }
    });

    navigator.clipboard.writeText(msg).then(() => {
      alert("Summary copied to clipboard!");
    });
  };

  // Check if a step can be navigated to
  const isTabEnabled = (targetStep: Step) => {
    if (targetStep === "UPLOAD") return true;
    if (targetStep === "REVIEW") return items.length > 0;
    if (targetStep === "PEOPLE") return items.length > 0;
    if (targetStep === "ASSIGN") return items.length > 0 && people.length >= 2;
    if (targetStep === "SETTLEMENT") return items.length > 0 && people.length >= 2;
    return false;
  };

  // Navigate directly to a step if enabled, or show helpful warning notifications
  const handleTabClick = (targetStep: Step) => {
    if (!isTabEnabled(targetStep)) {
      if (targetStep === "REVIEW" || targetStep === "PEOPLE") {
        setTabWarning("Please upload a receipt or enter items manually first.");
      } else if (targetStep === "ASSIGN") {
        if (items.length === 0) {
          setTabWarning("Please upload a receipt first.");
        } else {
          setTabWarning("Please add at least 2 participants on the PEOPLE tab first.");
        }
      } else if (targetStep === "SETTLEMENT") {
        if (items.length === 0) {
          setTabWarning("Please upload a receipt first.");
        } else if (people.length < 2) {
          setTabWarning("Please add at least 2 participants on the PEOPLE tab first.");
        }
      }
      return;
    }

    setTabWarning(null); // Clear active warning
    if (targetStep === "SETTLEMENT") {
      handleProceedToSettlement();
    } else {
      setStep(targetStep);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto receipt-paper p-4 sm:p-6 md:p-10 font-receipt-mono text-stone-900 my-4 sm:my-8">
      {/* App Header formatted like restaurant receipt */}
      <div className="text-center space-y-1 text-stone-700">
        <h2 className="text-3xl font-extrabold uppercase tracking-wide text-stone-950">Hissab</h2>
        <p className="text-[9px] uppercase font-bold tracking-widest text-stone-500 max-w-xs mx-auto leading-normal">
          Free AI Bill Splitter App for Groups <br /> Split Restaurant Bills Instantly
        </p>
        <div className="h-1"></div>
        <p className="text-[10px] uppercase tracking-wider">Terminal #3.1-Lite &middot; Store #1084</p>
        <p className="text-[10px] uppercase tracking-wider">
          Date: {new Date().toLocaleDateString("en-IN")} &middot; Time: {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      <hr className="perforated-divider" />

      {/* Progress breadcrumbs (Steps bar) styled like perforated receipt details */}
      <div className="flex items-center justify-between text-[9px] font-bold tracking-widest text-stone-400 pb-2 border-b border-dashed border-stone-200 select-none">
        <button
          type="button"
          onClick={() => handleTabClick("UPLOAD")}
          className={`uppercase focus:outline-none transition ${
            step === "UPLOAD"
              ? "text-stone-950 underline decoration-2 underline-offset-4 font-extrabold cursor-default"
              : "text-stone-600 hover:text-stone-950 cursor-pointer"
          }`}
        >
          1. UPLOAD
        </button>
        <button
          type="button"
          onClick={() => handleTabClick("REVIEW")}
          className={`uppercase focus:outline-none transition ${
            step === "REVIEW"
              ? "text-stone-950 underline decoration-2 underline-offset-4 font-extrabold cursor-default"
              : isTabEnabled("REVIEW")
              ? "text-stone-600 hover:text-stone-950 cursor-pointer"
              : "text-stone-300/70 hover:text-stone-500 cursor-pointer"
          }`}
        >
          2. REVIEW
        </button>
        <button
          type="button"
          onClick={() => handleTabClick("PEOPLE")}
          className={`uppercase focus:outline-none transition ${
            step === "PEOPLE"
              ? "text-stone-950 underline decoration-2 underline-offset-4 font-extrabold cursor-default"
              : isTabEnabled("PEOPLE")
              ? "text-stone-600 hover:text-stone-950 cursor-pointer"
              : "text-stone-300/70 hover:text-stone-500 cursor-pointer"
          }`}
        >
          3. PEOPLE
        </button>
        <button
          type="button"
          onClick={() => handleTabClick("ASSIGN")}
          className={`uppercase focus:outline-none transition ${
            step === "ASSIGN"
              ? "text-stone-950 underline decoration-2 underline-offset-4 font-extrabold cursor-default"
              : isTabEnabled("ASSIGN")
              ? "text-stone-600 hover:text-stone-950 cursor-pointer"
              : "text-stone-300/70 hover:text-stone-500 cursor-pointer"
          }`}
        >
          4. ASSIGN
        </button>
        <button
          type="button"
          onClick={() => handleTabClick("SETTLEMENT")}
          className={`uppercase focus:outline-none transition ${
            step === "SETTLEMENT"
              ? "text-stone-950 underline decoration-2 underline-offset-4 font-extrabold cursor-default"
              : isTabEnabled("SETTLEMENT")
              ? "text-stone-600 hover:text-stone-950 cursor-pointer"
              : "text-stone-300/70 hover:text-stone-500 cursor-pointer"
          }`}
        >
          5. SETTLE
        </button>
      </div>

      {/* Tab validation warning message banner */}
      {tabWarning && (
        <div className="mt-2.5 p-2 bg-stone-100 border border-dashed border-stone-400 text-stone-900 text-[8px] uppercase tracking-wider font-bold flex items-center justify-between animate-fade-in select-none">
          <span className="flex items-center gap-1.5">
            <Icons.Warning />
            <span>Warning: {tabWarning}</span>
          </span>
          <button 
            type="button"
            onClick={() => setTabWarning(null)}
            className="text-stone-400 hover:text-stone-950 font-bold ml-2 text-xs focus:outline-none"
          >
            &times;
          </button>
        </div>
      )}

      {/* Validation alert banner */}
      {validationWarning && (
        <div className="my-6 p-4 border border-dashed border-stone-400 bg-stone-100/50 text-stone-900 flex gap-3 animate-fade-in text-xs">
          <Icons.Warning />
          <div className="flex-1">
            <span className="font-bold block mb-1">
              {validationWarning.type === "UNASSIGNED" ? "UNASSIGNED ITEMS WARNING" : "SINGLE PAYER CONFIRM"}
            </span>
            <p className="text-[10px] text-stone-600 mb-3">{validationWarning.message}</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={validationWarning.action}
                className="bg-stone-900 text-white text-[10px] uppercase tracking-wider px-3 py-1.5 font-bold hover:bg-stone-800 transition"
              >
                {validationWarning.type === "UNASSIGNED" ? "Split rest with all" : "Split bill equally"}
              </button>
              <button
                onClick={() => {
                  setValidationWarning(null);
                  setStep("SETTLEMENT");
                }}
                className="border border-stone-400 text-stone-700 bg-white text-[10px] uppercase tracking-wider px-3 py-1.5 font-bold hover:bg-stone-50 transition"
              >
                Proceed anyway
              </button>
              <button
                onClick={() => setValidationWarning(null)}
                className="text-[10px] text-stone-500 underline hover:text-stone-950"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. UPLOAD STEP */}
      {step === "UPLOAD" && (
        <div className="space-y-6 animate-fade-in pt-4">
          {ocrError && (
            <div className="p-3 bg-stone-100 border border-dashed border-stone-400 text-stone-900 text-xs">
              <strong>ERROR:</strong> {ocrError}
            </div>
          )}

          {/* OCR Engine Selection Toggle */}
          <div className="flex flex-col gap-2 p-4 bg-stone-50 border border-dashed border-stone-200">
            <span className="text-[9px] font-bold tracking-widest text-stone-400 uppercase">
              OCR ENGINE:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                id="engine-gemini-btn"
                onClick={() => setOcrEngine("gemini")}
                className={`flex-1 text-[10px] py-2 uppercase tracking-wider font-bold border transition ${
                  ocrEngine === "gemini"
                    ? "bg-stone-900 border-stone-900 text-white"
                    : "bg-white border-stone-300 text-stone-600 hover:border-stone-500"
                }`}
              >
                Gemini (Cloud)
              </button>
              <button
                type="button"
                id="engine-tesseract-btn"
                onClick={() => setOcrEngine("tesseract")}
                className={`flex-1 text-[10px] py-2 uppercase tracking-wider font-bold border transition ${
                  ocrEngine === "tesseract"
                    ? "bg-stone-900 border-stone-900 text-white"
                    : "bg-white border-stone-300 text-stone-600 hover:border-stone-500"
                }`}
              >
                Tesseract.js (Local)
              </button>
            </div>
            <p className="text-[8px] text-stone-500 mt-0.5 leading-normal">
              {ocrEngine === "gemini"
                ? "* Gemini cloud parsing: Fast and highly accurate for restaurant snaps."
                : "* Local browser parsing: Extracts text locally without uploading your image."}
            </p>
            <p className="text-[8px] text-stone-500 mt-1.5 leading-normal border-t border-stone-200 border-dashed pt-1.5 font-bold uppercase tracking-wider">
              * Note: Hissab extracts base food/beverage items only. Taxes (GST, Service Charge) and tips can be added on the final screen to split them proportionally.
            </p>
          </div>

          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-stone-300 p-6 sm:p-12 text-center bg-stone-50 hover:bg-white transition-all cursor-pointer flex flex-col items-center justify-center min-h-[220px]"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <Icons.Upload />
            <span className="block mt-4 text-xs font-bold text-stone-800 uppercase tracking-wider">
              Scan Receipt Image / PDF
            </span>
            <span className="block mt-2 text-[10px] text-stone-400 uppercase tracking-widest">
              Drag &amp; drop or click to browse
            </span>
            <input
              id="file-upload"
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Mobile Camera Access */}
            <button
              onClick={() => document.getElementById("camera-upload")?.click()}
              className="w-full border border-stone-400 bg-white text-stone-700 py-3 px-4 font-bold uppercase tracking-wider text-xs hover:bg-stone-50 transition flex items-center justify-center"
            >
              <Icons.Camera />
              Take photo
            </button>
            <input
              id="camera-upload"
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Manual entry fallback */}
            <button
              onClick={handleManualEntry}
              className="w-full border border-stone-950 bg-stone-950 text-white py-3 px-4 font-bold uppercase tracking-wider text-xs hover:bg-stone-900 transition"
            >
              Enter manually
            </button>
          </div>

          {/* Scanning Tips Panel */}
          <div className="p-4 bg-stone-50 border border-dashed border-stone-300 text-[9px] uppercase tracking-wider text-stone-600 space-y-2 leading-relaxed">
            <span className="font-bold text-stone-850 block border-b border-stone-200 border-dashed pb-1 select-none">
              Tips for Best OCR Results:
            </span>
            <ul className="list-disc pl-4 space-y-1 select-none">
              <li>Keep the paper flat and avoid bends or creases.</li>
              <li>Ensure even, bright lighting (avoid shadows of your hand).</li>
              <li>Crop the photo closely to the printed bill area.</li>
              <li>Make sure the text is sharp and not blurry.</li>
            </ul>
          </div>
        </div>
      )}

      {/* 2. PARSING STEP */}
      {step === "PARSING" && (
        <div className="text-center py-12 space-y-6 animate-fade-in">
          <div className="w-8 h-8 border-2 border-stone-950 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-800">
              {ocrEngine === "tesseract" ? "LOCAL TESSERACT SCAN" : "AI BILL PARSING"}
            </h3>
            <p className="text-[10px] text-stone-500 uppercase tracking-widest">
              {tesseractProgress || "Analyzing receipt details..."}
            </p>
            <div className="text-[10px] text-stone-400 mt-2">
              Time elapsed: {parsingTime}s
            </div>
          </div>
        </div>
      )}

      {/* 3. REVIEW STEP */}
      {step === "REVIEW" && (
        <div className="space-y-6 animate-fade-in pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500">Receipt Line Items</h3>
            {fileData && (
              <button
                onClick={() => setShowReceiptPreview(!showReceiptPreview)}
                className="text-xs font-bold uppercase tracking-widest text-stone-900 hover:underline flex items-center"
              >
                <Icons.Eye />
                {showReceiptPreview ? "Hide file" : "Show file"}
              </button>
            )}
          </div>

          {isDemoMode && (
            <div className="p-3 bg-stone-100 border border-dashed border-stone-400 text-stone-800 text-[10px] uppercase tracking-wider font-semibold">
              * DEMO MODE ACTIVE: Gemini API key missing. Mock data shown below.
            </div>
          )}

          {/* Receipt Preview Panel */}
          {showReceiptPreview && fileData && (
            <div className="border border-stone-200 p-2 bg-stone-50 max-h-60 overflow-auto animate-fade-in flex justify-center">
              {mimeType === "application/pdf" ? (
                <div className="text-[10px] p-4 text-stone-500">PDF: {fileName}</div>
              ) : (
                <img src={fileData} alt="Receipt Preview" className="max-w-xs object-contain" />
              )}
            </div>
          )}

          <div className="border-t border-b border-stone-300 divide-y divide-stone-200 divide-dashed">
            {/* Table Header */}
            <div className="grid grid-cols-12 text-[10px] uppercase font-bold tracking-wider text-stone-600 py-2">
              <div className="col-span-6">Item description</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-3 text-right">Price (₹)</div>
              <div className="col-span-1"></div>
            </div>

            {/* Table Body */}
            {items.length === 0 ? (
              <div className="py-6 text-center text-xs text-stone-400 uppercase tracking-widest">
                No items on receipt.
              </div>
            ) : (
              <div className="max-h-[280px] overflow-y-auto divide-y divide-stone-200 divide-dashed">
                {items.map((item) => (
                  <div key={item.id} className={`grid grid-cols-12 items-center py-2 gap-2 ${item.lowConfidence ? "bg-amber-50" : ""}`}>
                    <div className="col-span-6">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateItem(item.id, "name", e.target.value)}
                        placeholder="ITEM NAME"
                        className="w-full text-xs font-semibold border-0 border-b border-transparent focus:border-stone-500 py-0.5 bg-transparent uppercase"
                      />
                      {item.lowConfidence && (
                        <span className="text-[8px] uppercase tracking-wider text-amber-700 font-bold block mt-0.5">
                          * OCR low confidence
                        </span>
                      )}
                    </div>
                    <div className="col-span-2 text-center">
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => handleUpdateItem(item.id, "qty", e.target.value)}
                        className="w-full text-center text-xs border-0 border-b border-transparent focus:border-stone-500 py-0.5 bg-transparent font-bold"
                      />
                    </div>
                    <div className="col-span-3 text-right">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateItem(item.id, "unitPrice", e.target.value)}
                        className="w-full text-right text-xs border-0 border-b border-transparent focus:border-stone-500 py-0.5 bg-transparent font-bold font-mono"
                      />
                      {item.qty > 1 && (
                        <span className="text-[8px] text-stone-400 font-mono block mt-0.5 select-none leading-none">
                          Total: ₹{(item.qty * item.unitPrice).toFixed(0)}
                        </span>
                      )}
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 hover:bg-stone-100 transition rounded"
                      >
                        <Icons.Trash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subtotal preview for verification */}
          <div className="flex justify-between items-baseline border-b border-stone-300 border-dashed pb-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Subtotal (Verify with receipt)</span>
            <span className="text-sm font-bold text-stone-950">₹{items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0).toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={handleAddItem}
              className="text-xs uppercase tracking-wider font-bold text-stone-900 border border-stone-400 px-4 py-2 hover:bg-stone-50 transition flex items-center"
            >
              <Icons.Plus />
              <span className="ml-1.5">Add Line</span>
            </button>

            <button
              onClick={() => setStep("PEOPLE")}
              disabled={items.length === 0 || items.some((i) => !i.name.trim())}
              className="bg-stone-950 text-white text-xs uppercase tracking-wider font-bold px-6 py-2.5 hover:bg-stone-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Add People &rarr;
            </button>
          </div>
        </div>
      )}

      {/* 4. PEOPLE STEP */}
      {step === "PEOPLE" && (
        <div className="space-y-6 animate-fade-in pt-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">Group Participants</h3>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest">Add names of who is dining</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddPerson(personInput);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={personInput}
              onChange={(e) => setPersonInput(e.target.value)}
              placeholder="ENTER PARTICIPANT NAME..."
              className="flex-1 bg-white border border-stone-300 text-xs px-4 py-3 rounded-none outline-none focus:border-stone-950 uppercase"
              autoFocus
            />
            <button
              type="submit"
              className="bg-stone-950 text-white font-bold uppercase tracking-wider text-xs px-6 py-3 hover:bg-stone-900 transition"
            >
              ADD
            </button>
          </form>

          {/* Suggested previous session participants */}
          {suggestedPeople.length > 0 && (
            <div className="p-4 bg-stone-50 border border-stone-200">
              <span className="block text-[8px] font-bold tracking-widest text-stone-400 uppercase mb-2">
                HISTORY SUGGESTIONS:
              </span>
              <div className="flex flex-wrap gap-1.5 items-center">
                {suggestedPeople.map((person) => {
                  const isAdded = people.includes(person);
                  return (
                    <button
                      key={person}
                      disabled={isAdded}
                      onClick={() => handleAddPerson(person)}
                      className={`text-[10px] px-2.5 py-1 font-bold transition uppercase ${
                        isAdded
                          ? "bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-200"
                          : "bg-white border border-stone-300 text-stone-700 hover:border-stone-950"
                      }`}
                    >
                      {person}
                    </button>
                  );
                })}
                <button
                  onClick={handleAddAllSuggestions}
                  className="text-[10px] text-stone-950 font-bold uppercase tracking-wider hover:underline ml-2"
                >
                  + Add All
                </button>
              </div>
            </div>
          )}

          {/* Current list of people */}
          <div className="space-y-2">
            <span className="text-[9px] font-bold tracking-widest text-stone-400 uppercase">
              Dining list ({people.length})
            </span>
            {people.length === 0 ? (
              <div className="p-8 border border-dashed border-stone-300 text-center text-xs text-stone-400 uppercase tracking-widest">
                No names added yet.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {people.map((person) => (
                  <div
                    key={person}
                    className="flex items-center gap-1.5 bg-white border border-stone-300 text-xs font-bold px-3 py-2 text-stone-800 uppercase"
                  >
                    <span>{person}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePerson(person)}
                      className="text-stone-400 hover:text-stone-950 ml-1 font-bold"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setStep("REVIEW")}
              className="text-xs uppercase tracking-wider font-bold text-stone-900 border border-stone-400 px-4 py-2 hover:bg-stone-50 transition"
            >
              &larr; Back
            </button>

            <button
              onClick={() => setStep("ASSIGN")}
              disabled={people.length < 2}
              className="bg-stone-950 text-white text-xs uppercase tracking-wider font-bold px-6 py-2.5 hover:bg-stone-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Assign Items &rarr;
            </button>
          </div>
        </div>
      )}

      {/* 5. ASSIGN STEP */}
      {step === "ASSIGN" && (
        <div className="space-y-6 animate-fade-in pt-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">Item Assignment</h3>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest">Select who consumed what</p>
            </div>
            <div className="bg-stone-100 border border-stone-300 px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider text-stone-700 select-none">
              Assigned: {items.filter((item) => assignments[item.id] && assignments[item.id].length > 0).length} / {items.length}
            </div>
          </div>

          {/* Natural Language Input */}
          <div className="p-4 border border-dashed border-stone-300 bg-stone-50 space-y-3">
            <span className="block text-[9px] font-bold tracking-widest text-stone-400 uppercase">
              AI Natural Assignment Command
            </span>
            <form onSubmit={handleNlpSubmit} className="flex gap-2">
              <input
                type="text"
                value={nlpText}
                onChange={(e) => setNlpText(e.target.value)}
                placeholder="e.g. Rahul and I shared pizza. Everyone drank coke."
                className="flex-1 bg-white border border-stone-300 text-xs px-3 py-2.5 outline-none focus:border-stone-950"
                disabled={nlpLoading}
              />
              <button
                type="submit"
                disabled={nlpLoading || !nlpText.trim()}
                className="bg-stone-950 text-white text-xs uppercase font-bold tracking-wider px-4 py-2.5 hover:bg-stone-900 disabled:opacity-50 transition"
              >
                {nlpLoading ? "Mapping..." : "Apply"}
              </button>
            </form>
            <span className="text-[8px] text-stone-500 block leading-normal">
              * Note: "I" maps to first diner: <span className="font-bold">{people[0]}</span>.
            </span>
          </div>

          {/* Matrix list */}
          <div className="space-y-4">
            {items.map((item) => {
              const assigned = assignments[item.id] || [];
              const isUnassigned = assigned.length === 0;
              const totalCost = item.qty * item.unitPrice;

              return (
                <div
                  key={item.id}
                  className={`p-4 border border-dashed transition-all ${
                    isUnassigned ? "border-amber-400 bg-amber-50/10" : "border-stone-300 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">{item.name}</h4>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        {item.qty} &times; ₹{item.unitPrice.toFixed(2)} = ₹{totalCost.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => assignAllToItem(item.id)}
                        className="text-[9px] uppercase tracking-wider font-bold text-stone-400 hover:text-stone-950"
                      >
                        All
                      </button>
                      <span className="text-[9px] text-stone-300">/</span>
                      <button
                        onClick={() => clearItemAssignments(item.id)}
                        className="text-[9px] uppercase tracking-wider font-bold text-stone-400 hover:text-stone-950"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* People selection initials */}
                  <div className="flex flex-wrap gap-1.5">
                    {people.map((person) => {
                      const isAssigned = assigned.includes(person);
                      return (
                        <button
                          key={person}
                          onClick={() => toggleAssignment(item.id, person)}
                          className={`text-xs px-3 py-1.5 transition font-bold border ${
                            isAssigned
                              ? "bg-stone-950 border-stone-950 text-white"
                              : "bg-white border-stone-300 text-stone-600 hover:border-stone-500"
                          }`}
                        >
                          {person}
                          {isAssigned && (
                            <span className="ml-1 text-[9px] text-stone-300">
                              (₹{(totalCost / assigned.length).toFixed(0)})
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isUnassigned && (
                    <div className="flex items-center gap-1.5 mt-2.5 text-[8px] font-bold text-amber-700 uppercase tracking-wide">
                      <Icons.Warning />
                      * Item is currently unassigned
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setStep("PEOPLE")}
              className="text-xs uppercase tracking-wider font-bold text-stone-900 border border-stone-400 px-4 py-2 hover:bg-stone-50 transition"
            >
              &larr; Back
            </button>

            <button
              onClick={handleProceedToSettlement}
              className="bg-stone-950 text-white text-xs uppercase tracking-wider font-bold px-6 py-2.5 hover:bg-stone-900 transition"
            >
              Calculate Split &rarr;
            </button>
          </div>
        </div>
      )}

      {/* 6. SETTLEMENT STEP */}
      {step === "SETTLEMENT" && (
        <div className="space-y-6 animate-fade-in pt-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">Settlement Summary</h3>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest">Final billing audit & shares</p>
          </div>

          {/* Bill breakdown summary card */}
          <div className="border border-stone-300 p-5 bg-stone-50 space-y-4 border-dashed">
            {/* Total Row */}
            <div className="flex justify-between items-baseline border-b border-stone-300 border-dashed pb-3 text-stone-850">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">GRAND TOTAL</span>
              <span className="text-lg font-bold text-stone-950">₹{grandTotal.toFixed(2)}</span>
            </div>

            {/* Optional Tax Tip Config */}
            <div className="space-y-4 pt-2.5 border-t border-stone-200 border-dashed">
              {/* Proportional GST Config */}
              <div className="grid grid-cols-12 gap-3 items-center text-xs">
                <div className="col-span-8">
                  <div className="text-stone-600 font-bold uppercase tracking-wider text-[10px]">Add GST (proportional split):</div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5 select-none">
                    <button
                      type="button"
                      onClick={() => setGst(parseFloat(((itemsTotal * 5) / 100).toFixed(2)))}
                      className="text-[7.5px] border border-stone-300 bg-white hover:bg-stone-50 px-1.5 py-0.5 font-mono font-bold text-stone-600 active:translate-y-[0.5px] transition focus:outline-none"
                    >
                      5% (₹{((itemsTotal * 5) / 100).toFixed(0)})
                    </button>
                    <button
                      type="button"
                      onClick={() => setGst(parseFloat(((itemsTotal * 12) / 100).toFixed(2)))}
                      className="text-[7.5px] border border-stone-300 bg-white hover:bg-stone-50 px-1.5 py-0.5 font-mono font-bold text-stone-600 active:translate-y-[0.5px] transition focus:outline-none"
                    >
                      12% (₹{((itemsTotal * 12) / 100).toFixed(0)})
                    </button>
                    <button
                      type="button"
                      onClick={() => setGst(parseFloat(((itemsTotal * 18) / 100).toFixed(2)))}
                      className="text-[7.5px] border border-stone-300 bg-white hover:bg-stone-50 px-1.5 py-0.5 font-mono font-bold text-stone-600 active:translate-y-[0.5px] transition focus:outline-none"
                    >
                      18% (₹{((itemsTotal * 18) / 100).toFixed(0)})
                    </button>
                  </div>
                </div>
                <div className="col-span-4 flex items-center border border-stone-300 bg-white">
                  <span className="pl-2 text-stone-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={gst || ""}
                    onChange={(e) => setGst(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full border-0 p-2 text-right outline-none text-xs font-bold font-mono"
                  />
                </div>
              </div>

              {/* Proportional Service Charge Config */}
              <div className="grid grid-cols-12 gap-3 items-center text-xs border-t border-stone-100 pt-3">
                <div className="col-span-8">
                  <div className="text-stone-600 font-bold uppercase tracking-wider text-[10px]">Add Service Charge (prop split):</div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5 select-none">
                    <button
                      type="button"
                      onClick={() => setServiceCharge(parseFloat(((itemsTotal * 5) / 100).toFixed(2)))}
                      className="text-[7.5px] border border-stone-300 bg-white hover:bg-stone-50 px-1.5 py-0.5 font-mono font-bold text-stone-600 active:translate-y-[0.5px] transition focus:outline-none"
                    >
                      5% (₹{((itemsTotal * 5) / 100).toFixed(0)})
                    </button>
                    <button
                      type="button"
                      onClick={() => setServiceCharge(parseFloat(((itemsTotal * 10) / 100).toFixed(2)))}
                      className="text-[7.5px] border border-stone-300 bg-white hover:bg-stone-50 px-1.5 py-0.5 font-mono font-bold text-stone-600 active:translate-y-[0.5px] transition focus:outline-none"
                    >
                      10% (₹{((itemsTotal * 10) / 100).toFixed(0)})
                    </button>
                  </div>
                </div>
                <div className="col-span-4 flex items-center border border-stone-300 bg-white">
                  <span className="pl-2 text-stone-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={serviceCharge || ""}
                    onChange={(e) => setServiceCharge(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full border-0 p-2 text-right outline-none text-xs font-bold font-mono"
                  />
                </div>
              </div>

              {/* Flat Tip Config */}
              <div className="grid grid-cols-12 gap-3 items-center text-xs border-t border-stone-100 pt-3">
                <div className="col-span-8 text-stone-600 font-bold uppercase tracking-wider text-[10px]">Add Tip / Round-off (equal split):</div>
                <div className="col-span-4 flex items-center border border-stone-300 bg-white">
                  <span className="pl-2 text-stone-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={tip || ""}
                    onChange={(e) => setTip(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full border-0 p-2 text-right outline-none text-xs font-bold font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Payer selection */}
            <div className="grid grid-cols-12 gap-3 items-center text-xs border-t border-stone-300 border-dashed pt-3">
              <div className="col-span-6 text-stone-600 font-bold uppercase tracking-wider text-[10px]">Who settled the bill?</div>
              <div className="col-span-6">
                <select
                  value={payer}
                  onChange={(e) => setPayer(e.target.value)}
                  className="w-full bg-white border border-stone-300 p-2 text-xs outline-none focus:border-stone-950 font-bold uppercase"
                >
                  {people.map((person) => (
                    <option key={person} value={person}>
                      {person}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Payer UPI ID Input */}
            <div className="grid grid-cols-12 gap-3 items-center text-xs border-t border-stone-300 border-dashed pt-3">
              <div className="col-span-6 text-stone-600 font-bold uppercase tracking-wider text-[10px]">Payer's UPI ID (optional)</div>
              <div className="col-span-6">
                <input
                  type="text"
                  placeholder="e.g. name@upi"
                  value={upiId}
                  onChange={(e) => handleUpiChange(e.target.value)}
                  className="w-full bg-white border border-stone-300 p-2 text-xs outline-none focus:border-stone-950 uppercase font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Individual Shares List */}
          <div className="space-y-3">
            <span className="text-[9px] font-bold tracking-widest text-stone-400 uppercase">Diner breakdowns</span>
            <div className="border border-stone-300 border-dashed divide-y divide-stone-200 divide-dashed bg-white">
              {people.map((person) => {
                const totalOwed = totals[person] || 0;
                return (
                  <div key={person} className="flex justify-between items-center p-3 text-xs">
                    <span className="font-bold text-stone-850 uppercase">{person}</span>
                    <div className="text-right">
                      <span className="font-bold text-stone-950 block">₹{totalOwed.toFixed(2)}</span>
                      {person === payer ? (
                        <span className="text-[8px] uppercase tracking-wider text-stone-400 font-bold block">PAID ENTIRE TICKET</span>
                      ) : (
                        <span className="text-[8px] uppercase tracking-wider text-stone-500 font-bold block">
                          OWES {payer} ₹{totalOwed.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simplified Debt Graph Visual Representation */}
          <div className="space-y-3">
            <span className="text-[9px] font-bold tracking-widest text-stone-400 uppercase">Simplified settlements</span>
            <div className="border border-stone-300 border-dashed p-4 bg-white space-y-2">
              {people.filter((p) => p !== payer && (totals[p] || 0) > 0).length === 0 ? (
                <div className="text-center py-4 text-xs text-stone-400 uppercase tracking-widest">
                  ALL DINERS SETTLED.
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {people
                    .filter((p) => p !== payer && (totals[p] || 0) > 0)
                    .map((person) => {
                      const share = totals[person] || 0;
                      const isExpanded = expandedQrPerson === person;
                      
                      const upiUri = upiId 
                        ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payer)}&am=${share.toFixed(2)}&cu=INR&tn=${encodeURIComponent("Hissab Split")}`
                        : "";

                      const qrImageUrl = upiId
                        ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUri)}`
                        : "";

                      return (
                        <div key={person} className="py-2 border-b border-stone-100 last:border-0 last:pb-0 first:pt-0">
                          <div className="flex items-center justify-between text-xs py-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-900 uppercase">{person}</span>
                              <span className="text-stone-400 text-[9px]">&rarr;</span>
                              <span className="text-stone-500 font-semibold text-[10px] uppercase">pays {payer}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-stone-950">₹{share.toFixed(2)}</span>
                              {upiId && (
                                <button
                                  onClick={() => setExpandedQrPerson(isExpanded ? null : person)}
                                  className="text-[9px] border border-stone-950 px-2 py-0.5 font-bold uppercase tracking-wider bg-white hover:bg-stone-50 transition"
                                >
                                  {isExpanded ? "Hide" : "Pay QR"}
                                </button>
                              )}
                            </div>
                          </div>

                          {isExpanded && upiId && (
                            <div className="mt-2.5 p-4 bg-stone-50 border border-dashed border-stone-300 flex flex-col items-center gap-3 animate-fade-in">
                              <p className="text-[9px] text-stone-600 font-bold uppercase tracking-wider text-center">
                                Scan to pay {payer} &middot; ₹{share.toFixed(2)}
                              </p>
                              <div className="bg-white p-2 border border-stone-200">
                                <img 
                                  src={qrImageUrl} 
                                  alt={`${person}'s UPI QR Code`} 
                                  className="w-40 h-40 object-contain mx-auto"
                                />
                              </div>
                              <div className="text-center space-y-1">
                                <p className="text-[8px] text-stone-500 font-mono uppercase tracking-wider">
                                  Payer UPI: {upiId}
                                </p>
                                <p className="text-[8px] text-stone-400 uppercase tracking-widest">
                                  Scan using PhonePe, GPay, Paytm, etc.
                                </p>
                              </div>
                              <a
                                href={upiUri}
                                className="w-full text-center border border-stone-950 bg-stone-950 text-white py-2 px-4 font-bold uppercase tracking-wider text-[10px] hover:bg-stone-900 transition"
                              >
                                Pay via UPI App
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  {!upiId && (
                    <div className="text-center pt-2 text-[8px] text-stone-400 uppercase tracking-wider font-semibold">
                      * Enter UPI ID above to unlock individual settlement QRs
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Share/Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={getWhatsAppShareLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-stone-950 text-white py-3 px-4 font-bold uppercase tracking-wider text-xs hover:bg-stone-900 transition flex items-center justify-center border border-stone-950"
            >
              <Icons.Share />
              Share via WhatsApp
            </a>
            <button
              onClick={copySummaryToClipboard}
              className="flex-1 border border-stone-400 bg-white text-stone-850 py-3 px-4 font-bold uppercase tracking-wider text-xs hover:bg-stone-50 transition"
            >
              Copy summary text
            </button>
          </div>

          {/* Restart */}
          <button
            onClick={() => {
              setStep("UPLOAD");
              setFileData(null);
              setFileName(null);
              setMimeType(null);
              setItems([]);
              setAssignments({});
              setGst(0);
              setServiceCharge(0);
              setTip(0);
              setExpandedQrPerson(null);
            }}
            className="w-full text-center text-[10px] uppercase tracking-widest font-bold text-stone-400 hover:text-stone-900 transition py-4 border-t border-dashed border-stone-200"
          >
            &larr; Scan another receipt
          </button>
        </div>
      )}

      {/* Barcode footer mimicking a real store ticket receipt */}
      <div className="text-center mt-12 space-y-3 pt-4 border-t border-dashed border-stone-200">
        <p className="text-[10px] font-bold tracking-widest text-stone-500">*** THANK YOU ***</p>
        <Icons.Barcode />
        <p className="text-[8px] tracking-wider text-stone-400">TICKET &middot; HISSAB &middot; VER. 3.1.2</p>
      </div>
    </div>
  );
}
