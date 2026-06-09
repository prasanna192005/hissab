import { AlertTriangle } from "lucide-react";

type Step = "UPLOAD" | "PARSING" | "REVIEW" | "PEOPLE" | "ASSIGN" | "SETTLEMENT";

interface StepsBarProps {
  step: Step;
  isTabEnabled: (s: Step) => boolean;
  onTabClick: (s: Step) => void;
  tabWarning: string | null;
  onCloseWarning: () => void;
}

export default function StepsBar({
  step,
  isTabEnabled,
  onTabClick,
  tabWarning,
  onCloseWarning,
}: StepsBarProps) {
  return (
    <>
      {/* Progress breadcrumbs (Steps bar) styled like perforated receipt details */}
      <div className="flex items-center justify-between text-[9px] font-bold tracking-widest text-stone-400 pb-2 border-b border-dashed border-stone-200 select-none">
        <button
          type="button"
          onClick={() => onTabClick("UPLOAD")}
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
          onClick={() => onTabClick("REVIEW")}
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
          onClick={() => onTabClick("PEOPLE")}
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
          onClick={() => onTabClick("ASSIGN")}
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
          onClick={() => onTabClick("SETTLEMENT")}
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
            <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>Warning: {tabWarning}</span>
          </span>
          <button 
            type="button"
            onClick={onCloseWarning}
            className="text-stone-400 hover:text-stone-950 font-bold ml-2 text-xs focus:outline-none"
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
}
