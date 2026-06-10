import React from "react";
import Link from "next/link";
import { ArrowLeft, Cpu, Image, MessageSquare, Plus, QrCode, Receipt, Share2, Users } from "lucide-react";

export const metadata = {
  title: "How Hissab Works - Detailed Technical Breakdown",
  description: "Learn how Hissab uses AI OCR, NLP natural language processing, proportional tax splits, and dynamic UPI QR codes to make group bill splitting instant.",
};

const BarcodeIcon = () => (
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
);

export default function HowItWorks() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl receipt-paper p-6 sm:p-10 font-receipt-mono text-stone-900 my-4 sm:my-8">
          
          {/* Header */}
          <div className="text-center space-y-2 text-stone-700">
            <div className="flex justify-start">
              <Link 
                href="/" 
                className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-950 font-bold uppercase tracking-wider transition focus:outline-none"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Splitter</span>
              </Link>
            </div>
            <h2 className="text-3xl font-extrabold uppercase tracking-wide text-stone-950 mt-4">Hissab Audit</h2>
            <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500 max-w-sm mx-auto leading-normal">
              Technical Documentation & Process Walkthrough <br /> How your bill splits are calculated & structured
            </p>
            <div className="h-1"></div>
            <p className="text-[10px] uppercase tracking-wider">Doc #404-Specs</p>
          </div>

          <hr className="perforated-divider" />

          {/* Core Pipeline Section */}
          <div className="space-y-8 text-stone-850">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-stone-950 border-b border-stone-300 pb-2 mb-4">
                THE 6-STEP PIPELINE
              </h3>
              
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-none border border-stone-950 flex items-center justify-center bg-stone-950 text-white font-bold text-xs font-mono">
                    01
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                      <Image className="w-3.5 h-3.5 text-stone-600" />
                      Receipt Scanning & Compression
                    </h4>
                    <p className="text-[10px] text-stone-500 uppercase tracking-widest leading-relaxed">
                      You snap a photo, upload an image, or drop a PDF. Hissab uses canvas compression to downscale the image size (max 800px width at 50% quality) client-side. This keeps payloads lightweight, speeds up processing time, and reduces network overhead without compromising text legibility.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-none border border-stone-950 flex items-center justify-center bg-stone-950 text-white font-bold text-xs font-mono">
                    02
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-stone-600" />
                      AI OCR vs. Local Browser OCR
                    </h4>
                    <p className="text-[10px] text-stone-500 uppercase tracking-widest leading-relaxed">
                      Hissab supports two extraction modes:
                    </p>
                    <ul className="list-disc pl-4 text-[9.5px] text-stone-500 uppercase tracking-widest space-y-1 leading-relaxed mt-1">
                      <li>
                        <strong className="text-stone-700">Gemini OCR (Cloud):</strong> Uploads compressed images directly to our API. The system prompts Gemini Flash with a structured response schema returning item names, quantity, and unit prices as pure JSON, automatically correcting spelling mistakes or abbreviations.
                      </li>
                      <li>
                        <strong className="text-stone-700">Tesseract.js (Local):</strong> Runs completely client-side in your browser. It loads language models on-the-fly to extract raw text coordinates from your device, then triggers Gemini to structure the unstructured text dump.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-none border border-stone-950 flex items-center justify-center bg-stone-950 text-white font-bold text-xs font-mono">
                    03
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-stone-600" />
                      Verification & Line Editing
                    </h4>
                    <p className="text-[10px] text-stone-500 uppercase tracking-widest leading-relaxed">
                      OCR isn't always 100% perfect. Hissab displays a real-time list of extracted items. Low confidence extractions are automatically flagged with warning badges. You can manually adjust item names, correct prices, modify quantities, delete stray items, or click <strong className="text-stone-700">Add Line</strong> to input any missing items.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-none border border-stone-950 flex items-center justify-center bg-stone-950 text-white font-bold text-xs font-mono">
                    04
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-stone-600" />
                      Group Participant Registry
                    </h4>
                    <p className="text-[10px] text-stone-500 uppercase tracking-widest leading-relaxed">
                      Register who is participating in the bill. Hissab syncs your groups locally. It automatically persists previous diner lists to your browser's local storage (`localStorage`) so you can bulk-load your friends on subsequent visits with a single click.
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-none border border-stone-950 flex items-center justify-center bg-stone-950 text-white font-bold text-xs font-mono">
                    05
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-stone-600" />
                      Visual & Natural Language Assignment
                    </h4>
                    <p className="text-[10px] text-stone-500 uppercase tracking-widest leading-relaxed">
                      Assign items to individuals in two ways:
                    </p>
                    <ul className="list-disc pl-4 text-[9.5px] text-stone-500 uppercase tracking-widest space-y-1 leading-relaxed mt-1">
                      <li>
                        <strong className="text-stone-700">Manual Matrix:</strong> Toggle diner tags underneath each item. The subtotal of the item is divided equally among everyone checked.
                      </li>
                      <li>
                        <strong className="text-stone-700">NLP Natural Assignment:</strong> Type everyday English like: <span className="italic">"Rahul and I shared the Margherita Pizza. Everyone had Coke. Rohan had Garlic Bread."</span> The AI maps people directly to items in the list, saving time when dealing with large receipt tickets.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Step 6 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-none border border-stone-950 flex items-center justify-center bg-stone-950 text-white font-bold text-xs font-mono">
                    06
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-stone-600" />
                      UPI Payment Integration & Sharing
                    </h4>
                    <p className="text-[10px] text-stone-500 uppercase tracking-widest leading-relaxed">
                      The payer enters their UPI ID (e.g., username@upi). Hissab constructs a standard UPI deep-link URL containing the payer's address, merchant category code, and the debtor's exact share. It displays a scan-to-pay QR code and a direct deep-link button that opens UPI apps (PhonePe, GPay, Paytm) on mobile phones.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Split Math Section */}
            <div className="space-y-4 pt-6 border-t border-stone-200 border-dashed">
              <h3 className="text-sm font-bold uppercase tracking-widest text-stone-950">
                PROPORTIONAL SPLIT MATHEMATICS
              </h3>
              
              <div className="space-y-3 text-[10.5px] text-stone-600 uppercase tracking-wider leading-relaxed">
                <p>
                  Hissab uses a strict proportional tax splitting algorithm. Instead of splitting taxes and service charges equally, the algorithm splits them relative to what each person consumed.
                </p>
                <div className="bg-stone-50 border border-stone-300 p-4 font-mono text-[9px] uppercase tracking-wide leading-relaxed space-y-2 text-stone-800">
                  <div className="font-bold border-b border-stone-200 pb-1 text-stone-950">FORMULA MODEL:</div>
                  <div>
                    1. <span className="font-bold">Item cost split:</span> <br />
                    &nbsp;&nbsp; ItemShare = (Qty &times; Price) / Number of Assignees
                  </div>
                  <div>
                    2. <span className="font-bold">Subtotal for person (P):</span> <br />
                    &nbsp;&nbsp; Subtotal(P) = Sum of all ItemShares for Person P
                  </div>
                  <div>
                    3. <span className="font-bold">Proportional Tax Share:</span> <br />
                    &nbsp;&nbsp; TaxShare(P) = (Subtotal(P) / ItemsTotal) &times; TotalTaxes <br />
                    &nbsp;&nbsp; * TotalTaxes = GST + Service Charge
                  </div>
                  <div>
                    4. <span className="font-bold">Equal Tip Share:</span> <br />
                    &nbsp;&nbsp; TipShare(P) = Tip / Total Participants
                  </div>
                  <div className="border-t border-stone-200 pt-1.5 font-bold text-stone-950">
                    5. Grand Total Share(P) = Subtotal(P) + TaxShare(P) + TipShare(P)
                  </div>
                </div>
                <p className="text-[9.5px] text-stone-500 italic mt-2">
                  * Why this matters: If Rahul orders a ₹100 Coke and Rohan orders a ₹900 Steak, Rahul pays 10% of the GST, and Rohan pays 90% of the GST. This is the fairest way to split restaurant bills.
                </p>
              </div>
            </div>

            {/* Privacy Section */}
            <div className="space-y-4 pt-6 border-t border-stone-200 border-dashed">
              <h3 className="text-sm font-bold uppercase tracking-widest text-stone-950">
                PRIVACY & DATA POLICY
              </h3>
              <p className="text-[10px] text-stone-500 uppercase tracking-widest leading-relaxed">
                Hissab does not use database servers. Your scanned receipt images are processed in-memory and are never stored on disk. All diner history data, UPI IDs, and app selections are persisted completely inside your device using browser `localStorage`. No accounts, no emails, no cookies.
              </p>
            </div>
          </div>

          {/* Footer Barcode */}
          <div className="text-center mt-12 space-y-3 pt-4 border-t border-dashed border-stone-200">
            <p className="text-[10px] font-bold tracking-widest text-stone-500">*** END OF DOCUMENT ***</p>
            <BarcodeIcon />
            <p className="text-[8px] tracking-wider text-stone-400">AUDIT TICKET &middot; HISSAB</p>
          </div>

        </div>
      </main>
    </div>
  );
}
