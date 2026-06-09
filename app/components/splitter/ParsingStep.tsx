import React from "react";

interface ParsingStepProps {
  ocrEngine: "gemini" | "tesseract";
  tesseractProgress: string;
  parsingTime: number;
}

export default function ParsingStep({
  ocrEngine,
  tesseractProgress,
  parsingTime,
}: ParsingStepProps) {
  return (
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
  );
}
