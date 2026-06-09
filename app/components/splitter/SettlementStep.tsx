import React from "react";
import { Share2 } from "lucide-react";
import { Item } from "../../types/splitter";

interface SettlementStepProps {
  items: Item[];
  people: string[];
  assignments: Record<string, string[]>;
  payer: string;
  setPayer: (val: string) => void;
  gst: number;
  setGst: (val: number) => void;
  serviceCharge: number;
  setServiceCharge: (val: number) => void;
  tip: number;
  setTip: (val: number) => void;
  upiId: string;
  handleUpiChange: (val: string) => void;
  expandedQrPerson: string | null;
  setExpandedQrPerson: (person: string | null) => void;
  totals: Record<string, number>;
  itemsTotal: number;
  grandTotal: number;
  getWhatsAppShareLink: () => string;
  copySummaryToClipboard: () => void;
  onScanAnother: () => void;
}

export default function SettlementStep({
  items,
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
  totals,
  itemsTotal,
  grandTotal,
  getWhatsAppShareLink,
  copySummaryToClipboard,
  onScanAnother,
}: SettlementStepProps) {
  return (
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
                className="w-full border-0 p-2 text-right outline-none text-xs font-bold font-mono focus:ring-0"
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
                className="w-full border-0 p-2 text-right outline-none text-xs font-bold font-mono focus:ring-0"
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
                className="w-full border-0 p-2 text-right outline-none text-xs font-bold font-mono focus:ring-0"
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
                              type="button"
                              onClick={() => setExpandedQrPerson(isExpanded ? null : person)}
                              className="text-[9px] border border-stone-950 px-2 py-0.5 font-bold uppercase tracking-wider bg-white hover:bg-stone-50 transition focus:outline-none"
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
          className="flex-1 bg-stone-950 text-white py-3 px-4 font-bold uppercase tracking-wider text-xs hover:bg-stone-900 transition flex items-center justify-center border border-stone-950 gap-2"
        >
          <Share2 className="w-4 h-4 text-white" />
          Share via WhatsApp
        </a>
        <button
          type="button"
          onClick={copySummaryToClipboard}
          className="flex-1 border border-stone-400 bg-white text-stone-850 py-3 px-4 font-bold uppercase tracking-wider text-xs hover:bg-stone-50 transition"
        >
          Copy summary text
        </button>
      </div>

      {/* Restart */}
      <button
        type="button"
        onClick={onScanAnother}
        className="w-full text-center text-[10px] uppercase tracking-widest font-bold text-stone-400 hover:text-stone-900 transition py-4 border-t border-dashed border-stone-200 focus:outline-none"
      >
        &larr; Scan another receipt
      </button>
    </div>
  );
}
