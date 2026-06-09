import React from "react";
import { Eye, EyeOff, Trash2, Plus } from "lucide-react";
import { Item } from "../../types/splitter";

interface ReviewStepProps {
  items: Item[];
  fileData: string | null;
  fileName: string | null;
  mimeType: string | null;
  isDemoMode: boolean;
  showReceiptPreview: boolean;
  setShowReceiptPreview: (show: boolean) => void;
  onAddItem: () => void;
  onDeleteItem: (id: string) => void;
  onUpdateItem: (id: string, field: keyof Item, value: any) => void;
  onNextStep: () => void;
}

export default function ReviewStep({
  items,
  fileData,
  fileName,
  mimeType,
  isDemoMode,
  showReceiptPreview,
  setShowReceiptPreview,
  onAddItem,
  onDeleteItem,
  onUpdateItem,
  onNextStep,
}: ReviewStepProps) {
  return (
    <div className="space-y-6 animate-fade-in pt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500">Receipt Line Items</h3>
        {fileData && (
          <button
            onClick={() => setShowReceiptPreview(!showReceiptPreview)}
            className="text-xs font-bold uppercase tracking-widest text-stone-900 hover:underline flex items-center gap-1.5"
          >
            {showReceiptPreview ? (
              <>
                <EyeOff className="w-4 h-4 text-stone-500" />
                Hide file
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-stone-500" />
                Show file
              </>
            )}
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
                    onChange={(e) => onUpdateItem(item.id, "name", e.target.value)}
                    placeholder="ITEM NAME"
                    className="w-full text-xs font-semibold border-0 border-b border-transparent focus:border-stone-500 py-0.5 bg-transparent uppercase focus:outline-none focus:ring-0"
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
                    onChange={(e) => onUpdateItem(item.id, "qty", e.target.value)}
                    className="w-full text-center text-xs border-0 border-b border-transparent focus:border-stone-500 py-0.5 bg-transparent font-bold focus:outline-none focus:ring-0"
                  />
                </div>
                <div className="col-span-3 text-right">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => onUpdateItem(item.id, "unitPrice", e.target.value)}
                    className="w-full text-right text-xs border-0 border-b border-transparent focus:border-stone-500 py-0.5 bg-transparent font-bold font-mono focus:outline-none focus:ring-0"
                  />
                  {item.qty > 1 && (
                    <span className="text-[8px] text-stone-400 font-mono block mt-0.5 select-none leading-none">
                      Total: ₹{(item.qty * item.unitPrice).toFixed(0)}
                    </span>
                  )}
                </div>
                <div className="col-span-1 text-center">
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1 hover:bg-stone-100 transition rounded"
                  >
                    <Trash2 className="w-4 h-4 text-stone-500" />
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
          onClick={onAddItem}
          className="text-xs uppercase tracking-wider font-bold text-stone-900 border border-stone-400 px-4 py-2 hover:bg-stone-50 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Line</span>
        </button>

        <button
          onClick={onNextStep}
          disabled={items.length === 0 || items.some((i) => !i.name.trim())}
          className="bg-stone-950 text-white text-xs uppercase tracking-wider font-bold px-6 py-2.5 hover:bg-stone-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Add People &rarr;
        </button>
      </div>
    </div>
  );
}
