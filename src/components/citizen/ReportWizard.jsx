import React, { useState } from 'react';
import { useCivicLens } from '../../context/CivicLensContext';
import { AI_SCAN_PRESETS } from '../../data/seededData';
import { AiImageScanner } from './AiImageScanner';
import { DuplicateDetectionCard } from './DuplicateDetectionCard';

export const ReportWizard = () => {
  const {
    wizardState,
    setWizardState,
    triggerAiScan,
    submitCitizenReport,
    navigateTab,
    switchRole,
    hotspots
  } = useCivicLens();

  const [dragOver, setDragOver] = useState(false);
  const targetHotspot = hotspots.find(hotspot => hotspot.id === wizardState.selectedPreset.targetHotspotId);

  const handleSelectPreset = (preset) => {
    setWizardState(prev => ({
      ...prev,
      selectedPreset: preset,
      uploadedImage: preset.imageUrl,
      customTitle: preset.title,
      customDescription: preset.description,
      customLocation: preset.locationName
    }));
  };

  const handleCustomFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setWizardState(prev => ({
          ...prev,
          uploadedImage: uploadEvent.target.result,
          customTitle: "Infrastructure Defect: " + file.name.replace(/\.[^/.]+$/, ""),
          customDescription: "Citizen captured photograph of municipal infrastructure failure."
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-margin-desktop py-8 text-left">
      {/* Wizard Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigateTab('home')}
            className="text-label-sm font-semibold text-primary hover:underline flex items-center gap-1 mb-2"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to Home</span>
          </button>
          <h1 className="text-headline-lg font-headline-lg text-on-surface">Report Infrastructure Issue</h1>
          <p className="text-body-md text-on-surface-variant text-sm">
            AI-assisted defect detection, deduplication, and direct routing to municipal repair queues.
          </p>
        </div>

        {/* Progress Stepper Pills */}
        <div className="hidden sm:flex items-center space-x-2">
          {['1. Photo', '2. AI Scan', '3. Duplicates', '4. Details', '5. Submitted'].map((label, i) => (
            <div
              key={i}
              className={`px-3 py-1 rounded-full text-label-sm font-bold transition-colors ${
                wizardState.step === i + 1
                  ? 'bg-primary text-white shadow-sm'
                  : wizardState.step > i + 1
                  ? 'bg-success-green/15 text-success-green'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Photo Selection & Preset Scenarios */}
      {wizardState.step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 shadow-sm">
            <h2 className="text-headline-md font-semibold text-on-surface mb-2">Step 1: Upload Infrastructure Photo</h2>
            <p className="text-body-md text-on-surface-variant text-sm mb-4">
              Select one of our realistic demo infrastructure cases, or upload your own photo to test CivicLens AI.
            </p>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {AI_SCAN_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`border rounded-xl p-3 cursor-pointer transition-all flex flex-col justify-between ${
                    wizardState.selectedPreset.id === preset.id
                      ? 'border-primary bg-primary-fixed/20 shadow-md ring-2 ring-primary/20'
                      : 'border-border-subtle hover:border-outline bg-surface-container-lowest'
                  }`}
                >
                  <div>
                    <img
                      src={preset.imageUrl}
                      alt={preset.name}
                      className="w-full h-28 object-cover rounded-lg mb-2.5"
                    />
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded">
                        {preset.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        preset.severity === 'Critical' ? 'bg-critical-red/15 text-critical-red' : 'bg-high-warning-orange/15 text-high-warning-orange'
                      }`}>
                        {preset.severity}
                      </span>
                    </div>
                    <h4 className="font-semibold text-body-md text-on-surface text-sm line-clamp-1">{preset.name}</h4>
                  </div>
                  <div className="mt-2 text-[11px] text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-primary">pin_drop</span>
                    <span className="truncate">{preset.locationName}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Drag and Drop / Camera File Box */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  const file = e.dataTransfer.files[0];
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    setWizardState(prev => ({
                      ...prev,
                      uploadedImage: ev.target.result,
                      customTitle: "Infrastructure Defect: " + file.name.replace(/\.[^/.]+$/, ""),
                      customDescription: "Citizen captured photograph of municipal infrastructure failure."
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                dragOver ? 'border-primary bg-primary-fixed/20' : 'border-border-subtle bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-3xl text-primary mb-2">add_a_photo</span>
              <p className="text-body-md font-semibold text-on-surface">Or drag and drop your photo here</p>
              <p className="text-xs text-on-surface-variant mt-1">Supports JPG, PNG, WEBP (Simulates live device camera capture)</p>
              <label className="mt-3 inline-block bg-surface-container-lowest border border-border-subtle hover:bg-surface-variant text-on-surface px-4 py-2 rounded-lg text-label-sm font-semibold cursor-pointer shadow-sm">
                Browse Files
                <input type="file" accept="image/*" className="hidden" onChange={handleCustomFileUpload} />
              </label>
            </div>

            {/* Next Step Action */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => triggerAiScan()}
                className="bg-primary-container hover:bg-primary text-white px-6 py-3 rounded-lg text-label-md font-semibold flex items-center space-x-2 shadow-md transition-all active:scale-98"
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
                <span>Analyze with CivicLens AI</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2 & 3: AI Scanner & Duplicate Detection */}
      {(wizardState.step === 2 || wizardState.step === 3) && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <AiImageScanner
            imageUrl={wizardState.uploadedImage}
            isScanning={wizardState.isScanning}
            scanProgress={wizardState.scanProgress}
            scanResult={wizardState.scanResult}
            onRescan={() => triggerAiScan()}
          />

          {wizardState.step === 3 && wizardState.similarReports.length > 0 && (
            <DuplicateDetectionCard
              similarReports={wizardState.similarReports}
              onMergeWithExisting={() => {
                setWizardState(prev => ({ ...prev, step: 4 }));
              }}
              onCreateNewReport={() => {
                setWizardState(prev => ({ ...prev, step: 4 }));
              }}
            />
          )}

          {wizardState.step === 3 && (
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setWizardState(prev => ({ ...prev, step: 1 }))}
                className="px-4 py-2 border border-border-subtle rounded-lg text-label-sm font-semibold hover:bg-surface-variant text-on-surface"
              >
                Change Photo
              </button>

              <button
                onClick={() => setWizardState(prev => ({ ...prev, step: 4 }))}
                className="px-6 py-2.5 bg-primary text-white rounded-lg text-label-md font-semibold hover:bg-primary-container shadow-sm flex items-center gap-1.5"
              >
                <span>Continue to Review &amp; Submit</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Final Review & Location Pin */}
      {wizardState.step === 4 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-headline-md font-semibold text-on-surface">Step 4: Confirm Report Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-label-sm font-bold text-on-surface-variant uppercase mb-1">
                  Issue Title (AI-Generated)
                </label>
                <input
                  type="text"
                  value={wizardState.customTitle || wizardState.selectedPreset.title}
                  onChange={(e) => setWizardState(prev => ({ ...prev, customTitle: e.target.value }))}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-3 text-body-md font-medium text-on-surface focus:outline-primary"
                />
              </div>

              <div>
                <label className="block text-label-sm font-bold text-on-surface-variant uppercase mb-1">
                  Location &amp; Ward
                </label>
                <input
                  type="text"
                  value={wizardState.customLocation || wizardState.selectedPreset.locationName}
                  onChange={(e) => setWizardState(prev => ({ ...prev, customLocation: e.target.value }))}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-3 text-body-md font-medium text-on-surface focus:outline-primary"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-label-sm font-bold text-on-surface-variant uppercase mb-1">
                  Citizen Notes / Context
                </label>
                <textarea
                  rows={3}
                  value={wizardState.customDescription || wizardState.selectedPreset.description}
                  onChange={(e) => setWizardState(prev => ({ ...prev, customDescription: e.target.value }))}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-3 text-body-md text-on-surface focus:outline-primary"
                />
              </div>
            </div>

            {/* Target Hotspot Notification */}
            <div className="bg-surface-operator border border-primary-fixed-dim rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-primary text-2xl">hub</span>
                <div>
                  <div className="text-label-sm font-bold text-on-surface">
                    Target Hotspot: {wizardState.selectedPreset.targetHotspotId}
                  </div>
                  <div className="text-xs text-on-surface-variant">
                    CivicLens will apply deterministic spatial grouping to {targetHotspot?.title || 'a new municipal hotspot'}.
                  </div>
                </div>
              </div>
              <span className="text-label-sm font-bold bg-primary text-white px-3 py-1 rounded-full">
                Auto-Clustering Active
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-border-subtle">
              <button
                onClick={() => setWizardState(prev => ({ ...prev, step: 3 }))}
                className="px-4 py-2 border border-border-subtle rounded-lg text-label-sm font-semibold hover:bg-surface-variant text-on-surface"
              >
                Back
              </button>

              <button
                onClick={() => submitCitizenReport()}
                className="px-8 py-3.5 bg-primary-container hover:bg-primary text-white rounded-lg text-label-md font-semibold shadow-md flex items-center space-x-2 active:scale-98 transition-all"
              >
                <span className="material-symbols-outlined text-lg">send</span>
                <span>Submit Citizen Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Submission Receipt & System Clustering Confirmation */}
      {wizardState.step === 5 && (
        <div className="space-y-6 animate-in zoom-in-95 duration-200">
          <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-8 shadow-modal text-center space-y-6">
            <div className="w-16 h-16 bg-success-green/20 text-success-green rounded-full flex items-center justify-center mx-auto ring-8 ring-success-green/10">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>

            <div>
              <span className="text-label-sm font-bold uppercase tracking-wider text-success-green bg-success-green/15 px-3 py-1 rounded-full">
                Report Stamped &amp; Clustered
              </span>
              <h2 className="text-headline-lg font-bold text-on-surface mt-2">
                Ticket #{wizardState.submittedReportId} Created
              </h2>
              <p className="text-body-md text-on-surface-variant max-w-md mx-auto mt-1">
                Your report has been classified and grouped using CivicLens civic routing rules into <strong>{targetHotspot ? `Hotspot #${targetHotspot.id}` : 'a new municipal hotspot'}</strong>.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-surface-operator border border-border-subtle rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Assigned Department:</span>
                <span className="font-bold text-on-surface">{wizardState.selectedPreset.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Hotspot Severity Index:</span>
                <span className="font-bold text-critical-red">{targetHotspot ? `${targetHotspot.severityScore}/100 (${targetHotspot.severity})` : 'Calculated on submission'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Estimated Municipal SLA:</span>
                <span className="font-bold text-primary">6.0 Hours</span>
              </div>
            </div>

            {/* Next Steps Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
              <button
                onClick={() => navigateTab('dashboard')}
                className="w-full sm:w-auto px-6 py-3 bg-surface-container-lowest border border-border-subtle hover:bg-surface-variant text-on-surface rounded-lg text-label-md font-semibold transition-colors"
              >
                View on Citizen Dashboard
              </button>

              <button
                onClick={() => {
                  switchRole('operator');
                  navigateTab('hotspot-detail', { hotspotId: 'HS-402' });
                }}
                className="w-full sm:w-auto px-6 py-3 bg-primary text-white hover:bg-primary-container rounded-lg text-label-md font-semibold shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Inspect in Operator Command Center</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
