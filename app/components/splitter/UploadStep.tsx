import React from "react";
import { UploadCloud, Camera } from "lucide-react";

interface UploadStepProps {
  ocrError: string | null;
  ocrEngine: "gemini" | "tesseract";
  setOcrEngine: (engine: "gemini" | "tesseract") => void;
  onFileSelect: (file: File) => void;
  onManualEntry: () => void;
}

export default function UploadStep({
  ocrError,
  ocrEngine,
  setOcrEngine,
  onFileSelect,
  onManualEntry,
}: UploadStepProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
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
        <UploadCloud className="w-8 h-8 text-stone-400" />
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
          className="w-full border border-stone-400 bg-white text-stone-700 py-3 px-4 font-bold uppercase tracking-wider text-xs hover:bg-stone-50 transition flex items-center justify-center gap-2"
        >
          <Camera className="w-4 h-4 text-stone-500" />
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
          onClick={onManualEntry}
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
  );
}
