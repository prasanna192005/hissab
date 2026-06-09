import React from "react";
import { AlertTriangle } from "lucide-react";
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
  onBack,
  onProceed,
}: AssignStepProps) {
  return (
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
        <form onSubmit={onNlpSubmit} className="flex gap-2">
          <input
            type="text"
            value={nlpText}
            onChange={(e) => setNlpText(e.target.value)}
            placeholder="e.g. Rahul and I shared pizza. Everyone drank coke."
            className="flex-1 bg-white border border-stone-300 text-xs px-3 py-2.5 outline-none focus:border-stone-950 focus:ring-0"
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
                    type="button"
                    onClick={() => assignAllToItem(item.id)}
                    className="text-[9px] uppercase tracking-wider font-bold text-stone-400 hover:text-stone-950 focus:outline-none"
                  >
                    All
                  </button>
                  <span className="text-[9px] text-stone-300">/</span>
                  <button
                    type="button"
                    onClick={() => clearItemAssignments(item.id)}
                    className="text-[9px] uppercase tracking-wider font-bold text-stone-400 hover:text-stone-950 focus:outline-none"
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

              {isUnassigned && (
                <div className="flex items-center gap-1.5 mt-2.5 text-[8px] font-bold text-amber-700 uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  * Item is currently unassigned
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
          className="bg-stone-950 text-white text-xs uppercase tracking-wider font-bold px-6 py-2.5 hover:bg-stone-900 transition"
        >
          Calculate Split &rarr;
        </button>
      </div>
    </div>
  );
}
