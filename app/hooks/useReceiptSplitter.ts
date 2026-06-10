import React, { useState, useEffect, useRef } from "react";
import { Step, Item } from "../types/splitter";

export default function useReceiptSplitter() {
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

  // Register Service Worker for PWA
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const handleRegister = () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("Service Worker registered successfully:", reg.scope);
          })
          .catch((err) => {
            console.error("Service Worker registration failed:", err);
          });
      };

      if (document.readyState === "complete") {
        handleRegister();
      } else {
        window.addEventListener("load", handleRegister);
        return () => window.removeEventListener("load", handleRegister);
      }
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
        
        triggerOcrParsing(base64, compressedMime);
      } catch (err: any) {
        console.error("Image compression failed, trying direct upload...", err);
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

  const handleAddPerson = (nameText: string) => {
    const name = nameText.trim();
    if (!name) return;
    if (people.includes(name)) return;
    setPeople([...people, name]);
  };

  const handleRemovePerson = (name: string) => {
    setPeople(people.filter((p) => p !== name));
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
          // Send full item details so the API can reason about quantities
          items: items.map((i) => ({ name: i.name, qty: i.qty, unitPrice: i.unitPrice }))
        })
      });
      const data = await res.json();
      if (data.assignments) {
        const updatedAssignments = { ...assignments };
        let updatedItems = [...items];

        data.assignments.forEach((asg: any) => {
          const matchedItem = updatedItems.find(
            (item) => item.name.trim().toLowerCase() === asg.itemName.trim().toLowerCase()
          );
          if (!matchedItem) return;

          const validNames = (asg.assignedPeople as string[]).filter((p) => people.includes(p));

          // Check if this is a quantity-split assignment (e.g. "Prasanna 2 papad, Rahul 3 papad")
          const hasQtySplits = asg.quantitySplits && Array.isArray(asg.quantitySplits) && asg.quantitySplits.length > 0;

          if (hasQtySplits) {
            // Remove the original item and replace with per-person split rows
            updatedItems = updatedItems.filter((i) => i.id !== matchedItem.id);
            delete updatedAssignments[matchedItem.id];

            let remainingQty = matchedItem.qty;

            asg.quantitySplits.forEach((split: { person: string; qty: number }) => {
              if (!people.includes(split.person)) return;
              const splitQty = Math.min(split.qty, remainingQty);
              if (splitQty <= 0) return;
              remainingQty -= splitQty;

              const newId = Math.random().toString(36).substring(2, 9);
              const newItem: Item = {
                id: newId,
                name: `${matchedItem.name} (${split.person})`,
                qty: splitQty,
                unitPrice: matchedItem.unitPrice,
                isSplitRow: true,
              };
              updatedItems.push(newItem);
              updatedAssignments[newId] = [split.person];
            });

            // If there's a remainder (unattributed qty), keep it as a shared row
            if (remainingQty > 0) {
              const remainId = Math.random().toString(36).substring(2, 9);
              const remainItem: Item = {
                id: remainId,
                name: `${matchedItem.name} (shared)`,
                qty: remainingQty,
                unitPrice: matchedItem.unitPrice,
                isSplitRow: true,
              };
              updatedItems.push(remainItem);
              // Assign remainder to everyone not already in a split
              const splitPeople = asg.quantitySplits.map((s: any) => s.person).filter((p: string) => people.includes(p));
              const remainPeople = people.filter((p) => !splitPeople.includes(p));
              updatedAssignments[remainId] = remainPeople.length > 0 ? remainPeople : people;
            }
          } else {
            // Simple assignment — no quantity split
            updatedAssignments[matchedItem.id] = validNames;
          }
        });

        setItems(updatedItems);
        setAssignments(updatedAssignments);
        setNlpText("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setNlpLoading(false);
    }
  };


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

    const totalExtraTaxes = gst + serviceCharge;
    if (totalExtraTaxes > 0 && itemsTotal > 0) {
      people.forEach((p) => {
        const personSubtotal = totals[p] || 0;
        const taxShare = (personSubtotal / itemsTotal) * totalExtraTaxes;
        totals[p] = personSubtotal + taxShare;
      });
    }

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

  const handleProceedToSettlement = () => {
    const unassignedItems = items.filter((item) => !assignments[item.id] || assignments[item.id].length === 0);
    
    if (unassignedItems.length > 0) {
      setValidationWarning({
        type: "UNASSIGNED",
        message: `There are ${unassignedItems.length} item(s) without anyone assigned. They will not be counted in individual splits.`,
        action: () => {
          setValidationWarning(null);
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

    const activeDebtors = Object.keys(totals).filter(name => totals[name] > 0);
    if (activeDebtors.length === 1) {
      const soleDebtor = activeDebtors[0];
      setValidationWarning({
        type: "SINGLE_PAYER",
        message: `You've assigned the entire bill to just ${soleDebtor}. Did you mean to split items equally among participants?`,
        action: () => {
          setValidationWarning(null);
          const updated: Record<string, string[]> = {};
          items.forEach((item) => {
            updated[item.id] = [...people];
          });
          setAssignments(updated);
        }
      });
      return;
    }

    try {
      localStorage.setItem("receiptsplit_previous_people", JSON.stringify(people));
    } catch (e) {
      console.error(e);
    }

    setStep("SETTLEMENT");
  };

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

  const isTabEnabled = (targetStep: Step) => {
    if (targetStep === "UPLOAD") return true;
    if (targetStep === "REVIEW") return items.length > 0;
    if (targetStep === "PEOPLE") return items.length > 0;
    if (targetStep === "ASSIGN") return items.length > 0 && people.length >= 2;
    if (targetStep === "SETTLEMENT") return items.length > 0 && people.length >= 2;
    return false;
  };

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

    setTabWarning(null);
    if (targetStep === "SETTLEMENT") {
      handleProceedToSettlement();
    } else {
      setStep(targetStep);
    }
  };

  // Merges all split sub-rows that share the same base name back into one row
  const handleUnsplitItem = (itemId: string) => {
    const targetItem = items.find((i) => i.id === itemId);
    if (!targetItem) return;

    // Derive the base name by stripping the " (Person)" suffix
    const baseName = targetItem.name.replace(/\s*\([^)]+\)\s*$/, "").trim();

    // Collect all split rows with the same base name
    const siblings = items.filter(
      (i) => i.isSplitRow && i.name.replace(/\s*\([^)]+\)\s*$/, "").trim() === baseName
    );

    if (siblings.length === 0) return;

    const totalQty = siblings.reduce((s, i) => s + i.qty, 0);
    const unitPrice = siblings[0].unitPrice;
    const newId = Math.random().toString(36).substring(2, 9);

    const mergedItem: Item = {
      id: newId,
      name: baseName,
      qty: totalQty,
      unitPrice,
    };

    const newItems = [
      ...items.filter((i) => !siblings.map((s) => s.id).includes(i.id)),
      mergedItem,
    ];

    const newAssignments = { ...assignments };
    siblings.forEach((s) => delete newAssignments[s.id]);
    // Don't pre-assign the merged row — let the user assign fresh

    setItems(newItems);
    setAssignments(newAssignments);
  };


  // e.g. Papad qty=5 → "Papad (Prasanna)" qty=2 + "Papad (Rahul)" qty=3
  const handleSplitItemQty = (itemId: string, splits: { person: string; qty: number }[]) => {
    const originalItem = items.find((i) => i.id === itemId);
    if (!originalItem) return;

    const validSplits = splits.filter((s) => s.qty > 0 && people.includes(s.person));
    if (validSplits.length === 0) return;

    const newItems = items.filter((i) => i.id !== itemId);
    const newAssignments = { ...assignments };
    delete newAssignments[itemId];

    let remainingQty = originalItem.qty;

    validSplits.forEach((split) => {
      const splitQty = Math.min(split.qty, remainingQty);
      if (splitQty <= 0) return;
      remainingQty -= splitQty;
      const newId = Math.random().toString(36).substring(2, 9);
      newItems.push({
        id: newId,
        name: `${originalItem.name} (${split.person})`,
        qty: splitQty,
        unitPrice: originalItem.unitPrice,
        isSplitRow: true,
      });
      newAssignments[newId] = [split.person];
    });

    // Keep any unaccounted remainder as a shared row
    if (remainingQty > 0) {
      const remainId = Math.random().toString(36).substring(2, 9);
      newItems.push({
        id: remainId,
        name: `${originalItem.name} (shared)`,
        qty: remainingQty,
        unitPrice: originalItem.unitPrice,
        isSplitRow: true,
      });
      const splitPeople = validSplits.map((s) => s.person);
      newAssignments[remainId] = people.filter((p) => !splitPeople.includes(p));
    }

    setItems(newItems);
    setAssignments(newAssignments);
  };

  const onScanAnother = () => {
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
  };

  return {
    step,
    setStep,
    onScanAnother,
    fileData,
    fileName,
    mimeType,
    items,
    isDemoMode,
    people,
    assignments,
    payer,
    setPayer,
    gst,
    setGst,
    serviceCharge,
    setServiceCharge,
    tip,
    setTip,
    upiId,
    handleUpiChange,
    expandedQrPerson,
    setExpandedQrPerson,
    tabWarning,
    setTabWarning,
    ocrEngine,
    setOcrEngine,
    tesseractProgress,
    nlpText,
    setNlpText,
    nlpLoading,
    validationWarning,
    setValidationWarning,
    ocrError,
    parsingTime,
    suggestedPeople,
    showReceiptPreview,
    setShowReceiptPreview,
    processFile,
    handleManualEntry,
    handleAddItem,
    handleDeleteItem,
    handleUpdateItem,
    handleAddPerson,
    handleRemovePerson,
    handleAddAllSuggestions,
    toggleAssignment,
    assignAllToItem,
    clearItemAssignments,
    handleNlpSubmit,
    handleSplitItemQty,
    handleUnsplitItem,
    handleProceedToSettlement,
    totals,
    itemsTotal,
    grandTotal,
    getWhatsAppShareLink,
    copySummaryToClipboard,
    isTabEnabled,
    handleTabClick,
  };
}
