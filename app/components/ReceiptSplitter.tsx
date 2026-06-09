"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

import StepsBar from "./splitter/StepsBar";
import UploadStep from "./splitter/UploadStep";
import ParsingStep from "./splitter/ParsingStep";
import ReviewStep from "./splitter/ReviewStep";
import PeopleStep from "./splitter/PeopleStep";
import AssignStep from "./splitter/AssignStep";
import SettlementStep from "./splitter/SettlementStep";

import useReceiptSplitter from "../hooks/useReceiptSplitter";

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

export default function ReceiptSplitter() {
  const {
    step,
    setStep,
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
    handleProceedToSettlement,
    totals,
    itemsTotal,
    grandTotal,
    getWhatsAppShareLink,
    copySummaryToClipboard,
    isTabEnabled,
    handleTabClick,
    onScanAnother,
  } = useReceiptSplitter();

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

      <StepsBar
        step={step}
        isTabEnabled={isTabEnabled}
        onTabClick={handleTabClick}
        tabWarning={tabWarning}
        onCloseWarning={() => setTabWarning(null)}
      />

      {/* Validation alert banner */}
      {validationWarning && (
        <div className="my-6 p-4 border border-dashed border-stone-400 bg-stone-100/50 text-stone-900 flex gap-3 animate-fade-in text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
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
        <UploadStep
          ocrError={ocrError}
          ocrEngine={ocrEngine}
          setOcrEngine={setOcrEngine}
          onFileSelect={processFile}
          onManualEntry={handleManualEntry}
        />
      )}

      {/* 2. PARSING STEP */}
      {step === "PARSING" && (
        <ParsingStep
          ocrEngine={ocrEngine}
          tesseractProgress={tesseractProgress}
          parsingTime={parsingTime}
        />
      )}

      {/* 3. REVIEW STEP */}
      {step === "REVIEW" && (
        <ReviewStep
          items={items}
          fileData={fileData}
          fileName={fileName}
          mimeType={mimeType}
          isDemoMode={isDemoMode}
          showReceiptPreview={showReceiptPreview}
          setShowReceiptPreview={setShowReceiptPreview}
          onAddItem={handleAddItem}
          onDeleteItem={handleDeleteItem}
          onUpdateItem={handleUpdateItem}
          onNextStep={() => setStep("PEOPLE")}
        />
      )}

      {/* 4. PEOPLE STEP */}
      {step === "PEOPLE" && (
        <PeopleStep
          people={people}
          suggestedPeople={suggestedPeople}
          onAddPerson={handleAddPerson}
          onRemovePerson={handleRemovePerson}
          onAddAllSuggestions={handleAddAllSuggestions}
          onBack={() => setStep("REVIEW")}
          onNextStep={() => setStep("ASSIGN")}
        />
      )}

      {/* 5. ASSIGN STEP */}
      {step === "ASSIGN" && (
        <AssignStep
          items={items}
          people={people}
          assignments={assignments}
          nlpText={nlpText}
          setNlpText={setNlpText}
          nlpLoading={nlpLoading}
          onNlpSubmit={handleNlpSubmit}
          toggleAssignment={toggleAssignment}
          assignAllToItem={assignAllToItem}
          clearItemAssignments={clearItemAssignments}
          onBack={() => setStep("PEOPLE")}
          onProceed={handleProceedToSettlement}
        />
      )}

      {/* 6. SETTLEMENT STEP */}
      {step === "SETTLEMENT" && (
        <SettlementStep
          items={items}
          people={people}
          assignments={assignments}
          payer={payer}
          setPayer={setPayer}
          gst={gst}
          setGst={setGst}
          serviceCharge={serviceCharge}
          setServiceCharge={setServiceCharge}
          tip={tip}
          setTip={setTip}
          upiId={upiId}
          handleUpiChange={handleUpiChange}
          expandedQrPerson={expandedQrPerson}
          setExpandedQrPerson={setExpandedQrPerson}
          totals={totals}
          itemsTotal={itemsTotal}
          grandTotal={grandTotal}
          getWhatsAppShareLink={getWhatsAppShareLink}
          copySummaryToClipboard={copySummaryToClipboard}
          onScanAnother={onScanAnother}
        />
      )}

      {/* Barcode footer mimicking a real store ticket receipt */}
      <div className="text-center mt-12 space-y-3 pt-4 border-t border-dashed border-stone-200">
        <p className="text-[10px] font-bold tracking-widest text-stone-500">*** THANK YOU ***</p>
        <BarcodeIcon />
        <p className="text-[8px] tracking-wider text-stone-400">TICKET &middot; HISSAB &middot; VER. 3.1.2</p>
      </div>
    </div>
  );
}
