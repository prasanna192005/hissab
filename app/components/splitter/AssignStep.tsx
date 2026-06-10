import React, { useState, useEffect } from "react";
import { Users, Scissors, Check, X, RotateCcw, Mic } from "lucide-react";
import { Item } from "../../types/splitter";

interface AssignStepProps {
  items: Item[];
  people: string[];
  assignments: Record<string, string[]>;
  nlpText: string;
  setNlpText: (val: string) => void;
  nlpLoading: boolean;
  onNlpSubmit: (e: React.FormEvent) => void;
  toggleAssignment: (itemId: string, person: string) => void;
  assignAllToItem: (itemId: string) => void;
  clearItemAssignments: (itemId: string) => void;
  onSplitItem: (itemId: string, splits: { person: string; qty: number }[]) => void;
  onUnsplitItem: (itemId: string) => void;
  onBack: () => void;
  onProceed: () => void;
}

export default function AssignStep({
  items,
  people,
  assignments,
  nlpText,
  setNlpText,
  nlpLoading,
  onNlpSubmit,
  toggleAssignment,
  assignAllToItem,
  clearItemAssignments,
  onSplitItem,
  onUnsplitItem,
  onBack,
  onProceed,
}: AssignStepProps) {
  const [splitPanelItemId, setSplitPanelItemId] = useState<string | null>(null);
  const [splitQtys, setSplitQtys] = useState<Record<string, Record<string, string>>>({});

  // Speech Recognition states
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-IN";

        rec.onstart = () => {
          setIsListening(true);
          setSpeechError(null);
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setNlpText((prev) => (prev ? `${prev.trim()} ${transcript}` : transcript));
          }
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          if (event.error === "not-allowed") {
            setSpeechError("Microphone permission denied.");
          } else if (event.error === "no-speech") {
            // No speech detected, silently close
          } else {
            setSpeechError(`Speech error: ${event.error}`);
          }
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        setRecognition(rec);

        return () => {
          try {
            rec.abort();
          } catch (e) {}
        };
      }
    }
  }, [setNlpText]);

  const toggleListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Safari, or Edge.");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Only count non-split rows as "needing assignment"
  const unassignedCount = items.filter(
    (item) => !item.isSplitRow && (!assignments[item.id] || assignments[item.id].length === 0)
  ).length;

  const distributeEvenly = (
    currentMap: Record<string, string>,
    remaining: number,
    targets: string[]
  ): Record<string, string> => {
    const next = { ...currentMap };
    if (targets.length === 0 || remaining <= 0) {
      targets.forEach((p) => { next[p] = "0"; });
      return next;
    }
    const base = Math.floor(remaining / targets.length);
    const extra = remaining % targets.length;
    targets.forEach((p, i) => { next[p] = String(base + (i === 0 ? extra : 0)); });
    return next;
  };

  const openSplitPanel = (item: Item) => {
    const base = Math.floor(item.qty / people.length);
    const extra = item.qty % people.length;
    const initial = Object.fromEntries(
      people.map((p, i) => [p, String(base + (i === 0 ? extra : 0))])
    );
    setSplitPanelItemId(item.id);
    setSplitQtys((prev) => ({ ...prev, [item.id]: initial }));
  };

  const closeSplitPanel = () => setSplitPanelItemId(null);

  const handleSplitQtyChange = (itemId: string, person: string, rawVal: string, itemQty: number) => {
    const newVal = Math.max(0, Math.min(itemQty, parseInt(rawVal) || 0));
    const others = people.filter((p) => p !== person);
    const remaining = itemQty - newVal;
    setSplitQtys((prev) => {
      const updated = { ...prev[itemId], [person]: String(newVal) };
      return { ...prev, [itemId]: distributeEvenly(updated, remaining, others) };
    });
  };

  const applySplit = (item: Item) => {
    const personQtys = splitQtys[item.id] || {};
    const splits = people
      .map((p) => ({ person: p, qty: parseInt(personQtys[p] || "0") || 0 }))
      .filter((s) => s.qty > 0);
    if (splits.length === 0) return;
    onSplitItem(item.id, splits);
    setSplitPanelItemId(null);
  };

  const getSplitTotal = (itemId: string) =>
    people.reduce((sum, p) => sum + (parseInt(splitQtys[itemId]?.[p] || "0") || 0), 0);

  // Group split rows so we only show one "Undo split" button per base name
  const seenBasenames = new Set<string>();

  return (
    <div className="space-y-6 animate-fade-in pt-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">Item Assignment</h3>
          <p className="text-[10px] text-stone-400 uppercase tracking-widest">Select who consumed what</p>
        </div>
        <div className="bg-stone-100 border border-stone-300 px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider text-stone-700 select-none">
          Assigned: {items.filter(i => !i.isSplitRow).length - unassignedCount} / {items.filter(i => !i.isSplitRow).length}
        </div>
      </div>

      {/* Natural Language Input */}
      <div className="p-4 border border-dashed border-stone-300 bg-stone-50 space-y-3">
        <span className="block text-[9px] font-bold tracking-widest text-stone-400 uppercase">
          AI Natural Assignment Command
        </span>
        <form onSubmit={onNlpSubmit} className="flex gap-2 items-center">
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={nlpText}
              onChange={(e) => setNlpText(e.target.value)}
              placeholder={isListening ? "Listening... Speak now!" : "e.g. Rahul and I shared pizza. Everyone drank coke."}
              className="w-full bg-white border border-stone-300 text-xs pl-3 pr-10 py-2.5 outline-none focus:border-stone-950 focus:ring-0"
              disabled={nlpLoading}
            />
            {recognition && (
              <button
                type="button"
                onClick={toggleListening}
                className={`absolute right-2 p-1.5 transition-all outline-none focus:outline-none ${
                  isListening
                    ? "text-red-600 animate-pulse scale-110"
                    : "text-stone-400 hover:text-stone-950"
                }`}
                title={isListening ? "Stop listening" : "Start voice command"}
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={nlpLoading || !nlpText.trim() || isListening}
            className="bg-stone-950 text-white text-xs uppercase font-bold tracking-wider px-4 py-2.5 hover:bg-stone-900 disabled:opacity-50 transition"
          >
            {nlpLoading ? "Mapping..." : "Apply"}
          </button>
        </form>
        {speechError && (
          <span className="text-[8px] text-red-600 font-bold uppercase tracking-wider block mt-1">
            ⚠️ {speechError}
          </span>
        )}
        <span className="text-[8px] text-stone-500 block leading-normal">
          * Note: &ldquo;I&rdquo; maps to first diner: <span className="font-bold">{people[0]}</span>.
          &nbsp;Supports quantity splits: &ldquo;Prasanna 2 papad, Rahul 3 papad&rdquo;.
        </span>
      </div>

      {/* Matrix list */}
      <div className="space-y-3">
        {items.map((item) => {
          // ── SPLIT ROW: compact locked card ──────────────────────────────
          if (item.isSplitRow) {
            const assigned = assignments[item.id] || [];
            const totalCost = item.qty * item.unitPrice;
            const baseName = item.name.replace(/\s*\([^)]+\)\s*$/, "").trim();
            const isFirstSibling = !seenBasenames.has(baseName);
            seenBasenames.add(baseName);

            return (
              <div
                key={item.id}
                className="flex items-center justify-between px-4 py-2.5 border border-dashed border-stone-200 bg-stone-50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Small scissors marker */}
                  <Scissors className="w-3 h-3 text-stone-300 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-700 truncate">
                      {item.name}
                    </p>
                    <p className="text-[9px] text-stone-400 font-mono">
                      {item.qty} × ₹{item.unitPrice.toFixed(2)} = ₹{totalCost.toFixed(2)}
                      {assigned.length > 0 && (
                        <span className="ml-2 text-stone-500">→ {assigned.join(", ")}</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Only show undo on the FIRST sibling row to avoid repeated buttons */}
                {isFirstSibling && (
                  <button
                    type="button"
                    title="Undo split — merge back into one row"
                    onClick={() => onUnsplitItem(item.id)}
                    className="flex-shrink-0 flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-stone-400 hover:text-stone-900 border border-stone-200 hover:border-stone-400 px-2 py-1 transition"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    Undo
                  </button>
                )}
              </div>
            );
          }

          // ── NORMAL ROW: full assignment card ────────────────────────────
          const assigned = assignments[item.id] || [];
          const isUnassigned = assigned.length === 0;
          const isAllAssigned = assigned.length === people.length;
          const totalCost = item.qty * item.unitPrice;
          const isSplitOpen = splitPanelItemId === item.id;
          const splitTotal = getSplitTotal(item.id);
          const splitRemaining = item.qty - splitTotal;
          const splitBalanced = splitTotal === item.qty;

          return (
            <div
              key={item.id}
              className={`border border-dashed transition-all ${
                isUnassigned ? "border-amber-400 bg-amber-50/20" : "border-stone-300 bg-white"
              }`}
            >
              {/* Item header */}
              <div className="flex justify-between items-start p-4">
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${isUnassigned ? "text-amber-800" : "text-stone-900"}`}>
                    {item.name}
                    {isUnassigned && (
                      <span className="ml-2 text-[8px] font-bold uppercase tracking-wider text-amber-600 border border-amber-400 px-1.5 py-0.5">
                        unassigned
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    {item.qty} &times; ₹{item.unitPrice.toFixed(2)} = ₹{totalCost.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {item.qty > 1 && (
                    <button
                      type="button"
                      title="Split quantity between people"
                      onClick={() => isSplitOpen ? closeSplitPanel() : openSplitPanel(item)}
                      className={`p-1.5 border transition focus:outline-none ${
                        isSplitOpen
                          ? "bg-stone-950 border-stone-950 text-white"
                          : "bg-white border-stone-300 text-stone-500 hover:border-stone-950 hover:text-stone-950"
                      }`}
                    >
                      <Scissors className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    title="Split with everyone"
                    onClick={() => assignAllToItem(item.id)}
                    className={`p-1.5 border transition focus:outline-none ${
                      isAllAssigned
                        ? "bg-stone-950 border-stone-950 text-white"
                        : "bg-white border-stone-300 text-stone-500 hover:border-stone-950 hover:text-stone-950"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => clearItemAssignments(item.id)}
                    className="text-[9px] uppercase tracking-wider font-bold text-stone-400 hover:text-stone-950 focus:outline-none"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Inline qty split panel */}
              {isSplitOpen && (
                <div className="border-t border-dashed border-stone-300 bg-stone-50 p-4 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">
                      Split {item.qty} unit{item.qty > 1 ? "s" : ""} between people
                    </span>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${
                      splitBalanced ? "text-green-700" : splitRemaining < 0 ? "text-red-600" : "text-stone-500"
                    }`}>
                      {splitBalanced
                        ? `✓ ${splitTotal} / ${item.qty}`
                        : splitRemaining < 0
                        ? `⚠ Over by ${Math.abs(splitRemaining)}`
                        : `${splitTotal} / ${item.qty} · ${splitRemaining} left`}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {people.map((person) => (
                      <div key={person} className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 flex-1 truncate">
                          {person}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const cur = parseInt(splitQtys[item.id]?.[person] || "0") || 0;
                              if (cur > 0) handleSplitQtyChange(item.id, person, String(cur - 1), item.qty);
                            }}
                            className="w-6 h-6 flex items-center justify-center border border-stone-300 text-stone-600 hover:bg-stone-100 text-xs font-bold focus:outline-none transition"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="0"
                            max={item.qty}
                            value={splitQtys[item.id]?.[person] ?? "0"}
                            onChange={(e) => handleSplitQtyChange(item.id, person, e.target.value, item.qty)}
                            className="w-10 text-center text-xs font-bold border border-stone-300 py-0.5 bg-white focus:outline-none focus:border-stone-950 focus:ring-0"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const cur = parseInt(splitQtys[item.id]?.[person] || "0") || 0;
                              if (cur < item.qty) handleSplitQtyChange(item.id, person, String(cur + 1), item.qty);
                            }}
                            className="w-6 h-6 flex items-center justify-center border border-stone-300 text-stone-600 hover:bg-stone-100 text-xs font-bold focus:outline-none transition"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-[9px] text-stone-400 font-mono w-14 text-right">
                          {(parseInt(splitQtys[item.id]?.[person] || "0") || 0) > 0
                            ? `₹${((parseInt(splitQtys[item.id]?.[person] || "0") || 0) * item.unitPrice).toFixed(0)}`
                            : "—"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => applySplit(item)}
                      disabled={splitTotal === 0 || splitRemaining < 0}
                      className="flex items-center gap-1.5 bg-stone-950 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <Check className="w-3 h-3" />
                      Apply Split
                    </button>
                    <button
                      type="button"
                      onClick={closeSplitPanel}
                      className="flex items-center gap-1.5 border border-stone-300 text-stone-600 text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 hover:bg-stone-50 transition"
                    >
                      <X className="w-3 h-3" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Person toggle buttons — hidden while split panel is open */}
              {!isSplitOpen && (
                <div className="flex flex-wrap gap-1.5 px-4 pb-4">
                  {people.map((person) => {
                    const isAssigned = assigned.includes(person);
                    return (
                      <button
                        key={person}
                        type="button"
                        onClick={() => toggleAssignment(item.id, person)}
                        className={`text-xs px-3 py-1.5 transition font-bold border focus:outline-none ${
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
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={onBack}
          className="text-xs uppercase tracking-wider font-bold text-stone-900 border border-stone-400 px-4 py-2 hover:bg-stone-50 transition"
        >
          &larr; Back
        </button>

        <button
          type="button"
          onClick={onProceed}
          className={`text-xs uppercase tracking-wider font-bold px-6 py-2.5 transition ${
            unassignedCount > 0
              ? "bg-amber-700 hover:bg-amber-800 text-white"
              : "bg-stone-950 hover:bg-stone-900 text-white"
          }`}
        >
          {unassignedCount > 0
            ? `Calculate Split (${unassignedCount} unassigned) →`
            : "Calculate Split →"}
        </button>
      </div>
    </div>
  );
}
