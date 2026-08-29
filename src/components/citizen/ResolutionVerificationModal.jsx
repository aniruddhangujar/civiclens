import React, { useState } from 'react';
import { useCivicLens } from '../../context/CivicLensContext';
import { SAMPLE_INFRASTRUCTURE_IMAGES } from '../../data/seededData';

export const ResolutionVerificationModal = () => {
  const {
    activeVerificationTicket,
    closeVerificationModal,
    verifyResolution
  } = useCivicLens();

  const [sliderPosition, setSliderPosition] = useState(50);
  const [feedbackRating, setFeedbackRating] = useState('Satisfied');
  const [residentNotes, setResidentNotes] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!activeVerificationTicket) return null;

  const beforeImg = activeVerificationTicket.imageUrl || SAMPLE_INFRASTRUCTURE_IMAGES.pothole_water;
  const afterImg = activeVerificationTicket.repairImageUrl || SAMPLE_INFRASTRUCTURE_IMAGES.pothole_repaired;

  const handleConfirmVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      verifyResolution(activeVerificationTicket.id, residentNotes);
      setIsVerifying(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-modal p-6 text-left space-y-6">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border-subtle">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-label-sm font-bold bg-primary-fixed text-on-primary-fixed px-2.5 py-0.5 rounded-full">
                Ticket #{activeVerificationTicket.id}
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                {activeVerificationTicket.locationName}
              </span>
            </div>
            <h2 className="text-headline-md font-bold text-on-surface mt-1">
              Verify Infrastructure Resolution
            </h2>
            <p className="text-body-md text-xs text-on-surface-variant">
              Compare original reported damage against completed municipal repair evidence.
            </p>
          </div>

          <button
            onClick={() => closeVerificationModal()}
            className="p-1 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-variant"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Interactive Before & After Visual Diff Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
            <span className="flex items-center gap-1 text-critical-red">
              <span className="material-symbols-outlined text-sm">report_problem</span>
              <span>BEFORE: Initial Reported Defect</span>
            </span>
            <span className="flex items-center gap-1 text-success-green">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>AFTER: Public Works Repair Proof</span>
            </span>
          </div>

          {/* Interactive Split Comparison Box */}
          <div className="relative w-full h-72 sm:h-88 rounded-xl overflow-hidden select-none border border-border-subtle shadow-inner bg-black">
            {/* After Image (Full background) */}
            <img
              src={afterImg}
              alt="After Repair"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Before Image (Clipped overlay) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={beforeImg}
                alt="Before Repair"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%', minWidth: '100%' }}
              />
            </div>

            {/* Vertical Slider Handle Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 bg-white text-primary rounded-full shadow-lg flex items-center justify-center border border-border-subtle">
                <span className="material-symbols-outlined text-sm font-bold">
                  swap_horiz
                </span>
              </div>
            </div>

            {/* Hidden native range slider for dragging */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />
          </div>

          <div className="text-center text-[11px] text-on-surface-variant">
            Drag the horizontal slider across the image to inspect repair quality
          </div>
        </div>

        {/* CivicLens AI Automated Quality Assessment */}
        <div className="bg-surface-operator border border-primary-fixed-dim rounded-xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              <span className="font-bold text-label-md text-on-surface">CivicLens Repair Evidence Review</span>
            </div>
            <span className="text-label-sm font-bold bg-success-green text-white px-2.5 py-0.5 rounded-full">
              Demo review criteria
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-border-subtle">
              <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Void Leveling:</span>
              <span className="font-bold text-success-green flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">check</span> Evidence supplied
              </span>
            </div>
            <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-border-subtle">
              <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Hydraulic Seal:</span>
              <span className="font-bold text-success-green flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">check</span> Visual check required
              </span>
            </div>
            <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-border-subtle">
              <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Lane Clearance:</span>
              <span className="font-bold text-success-green flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">check</span> Field confirmation required
              </span>
            </div>
          </div>
        </div>

        {/* Citizen Feedback Form */}
        <div className="space-y-3">
          <label className="block text-label-sm font-bold text-on-surface-variant uppercase">
            Resident Satisfaction &amp; Comments
          </label>
          <div className="flex gap-2">
            {['Excellent Repair', 'Satisfied', 'Minor Flaws Remaining'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setFeedbackRating(opt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  feedbackRating === opt
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface border-border-subtle text-on-surface hover:bg-surface-container'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Optional resident feedback (e.g. 'Road is completely smooth, great job!')..."
            value={residentNotes}
            onChange={(e) => setResidentNotes(e.target.value)}
            className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2.5 text-body-md text-sm text-on-surface focus:outline-primary"
          />
        </div>

        {/* Modal Action Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-border-subtle">
          <div className="text-xs text-on-surface-variant">
            Verifying records your approval on the public municipal ledger and awards <strong className="text-primary">+50 Civic Karma</strong>.
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => closeVerificationModal()}
              className="px-4 py-2 border border-border-subtle rounded-lg text-label-sm font-semibold hover:bg-surface-variant text-on-surface"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmVerification}
              disabled={isVerifying}
              className="px-6 py-2.5 bg-success-green hover:bg-success-green/90 text-white rounded-lg text-label-md font-bold shadow-md flex items-center gap-1.5 active:scale-98 transition-all"
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
              <span>{isVerifying ? "Verifying Resolution..." : "Confirm & Mark VERIFIED"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
