import React from 'react';

export const AiImageScanner = ({
  imageUrl,
  isScanning,
  scanProgress,
  scanResult,
  onRescan
}) => {
  const assessmentSource = scanResult?.isLiveAi
    ? scanResult.source || 'Live vision model'
    : scanResult?.source === 'demo-preset'
      ? 'Preconfigured demo scenario'
      : 'Deterministic fallback';

  const assessmentLabel = scanResult?.isLiveAi
    ? 'AI risk assessment: '
    : scanResult?.source === 'demo-preset'
      ? 'Demo scenario assessment: '
      : 'Fallback assessment: ';

  return (
    <div className="relative bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden shadow-sm">
      {/* Image Display with Overlay */}
      <div className="relative w-full h-64 sm:h-80 bg-surface-container flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt="Infrastructure Defect"
          className="w-full h-full object-cover"
        />

        {/* Dynamic Scanning Grid & Laser Effect */}
        {isScanning && (
          <>
            <div className="absolute inset-0 bg-primary/10 grid-pattern-dark pointer-events-none" />
            
            {/* Animated Laser Beam */}
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-container to-transparent shadow-[0_0_15px_#0f62fe] animate-scanline pointer-events-none" />
            
            {/* Real-time Scanning HUD Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] text-white p-4">
              <div className="w-14 h-14 border-4 border-t-primary border-r-transparent border-b-primary-fixed border-l-transparent rounded-full animate-spin mb-4" />
              <div className="text-headline-md font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-fixed animate-pulse">memory</span>
                <span>CivicLens Vision Intelligence</span>
              </div>
              <div className="text-body-md text-slate-200 mt-1">
                {scanProgress < 30 ? "Stage 1: Surface Edge & Feature Mapping..." :
                 scanProgress < 70 ? "Stage 2: Multimodal Defect Analysis..." :
                 "Stage 3: Municipal Risk & Department Categorization..."}
              </div>
              <div className="w-64 bg-white/20 rounded-full h-2 mt-4 overflow-hidden">
                <div
                  className="bg-primary-container h-full transition-all duration-300 rounded-full shadow-[0_0_10px_#0f62fe]"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
              <div className="text-label-sm font-mono mt-1 text-slate-300">{scanProgress}% Processing Complete</div>
            </div>
          </>
        )}

        {/* Bounding Boxes Overlay */}
        {!isScanning && scanResult && scanResult.boundingBoxes && (
          <div className="absolute inset-0 pointer-events-none">
            {scanResult.boundingBoxes.map((box, idx) => (
              <div
                key={idx}
                className="absolute border-2 border-dashed transition-all duration-500 animate-in fade-in zoom-in-95"
                style={{
                  top: box.top,
                  left: box.left,
                  width: box.width,
                  height: box.height,
                  borderColor: box.color,
                  backgroundColor: `${box.color}22`
                }}
              >
                <div
                  className="absolute -top-6 left-0 text-[10px] font-bold text-white px-2 py-0.5 rounded shadow whitespace-nowrap"
                  style={{ backgroundColor: box.color }}
                >
                  {box.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Intelligence Assessment Panel */}
      {scanResult && !isScanning && (
        <div className="p-5 bg-surface-operator border-t border-border-subtle space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
              <span className="font-bold text-body-lg text-on-surface">AI Defect Classification</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-semibold bg-surface-container text-on-surface px-2.5 py-1 rounded-full border border-border-subtle flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-primary">
                  {scanResult.isLiveAi ? 'cloud_done' : 'offline_pin'}
                </span>
                <span>{assessmentSource}</span>
              </span>

              <span className={`text-label-sm font-bold text-white px-2.5 py-1 rounded-full shadow-sm ${
                scanResult.severity === 'Critical' ? 'bg-critical-red' :
                scanResult.severity === 'High' ? 'bg-high-warning-orange' : 'bg-medium-caution-yellow text-on-surface'
              }`}>
                Urgency: {scanResult.urgencyScore || 90}/100 ({scanResult.severity})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="bg-surface-container-lowest p-3 rounded-lg border border-border-subtle">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Classified Defect</span>
              <span className="text-label-md font-bold text-on-surface">{scanResult.defectType}</span>
            </div>

            <div className="bg-surface-container-lowest p-3 rounded-lg border border-border-subtle">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Target Department</span>
              <span className="text-label-md font-bold text-primary">{scanResult.department}</span>
            </div>
          </div>

          {/* Explicit Visual Estimate Disclaimer */}
          <div className="bg-surface-container-lowest p-3 rounded-lg border border-border-subtle text-left space-y-1">
            <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-on-surface-variant">
              <span className="material-symbols-outlined text-xs text-high-warning-orange">info</span>
              <span>Visual Approximation (Requires Field Physical Verification):</span>
            </div>
            <p className="text-xs text-on-surface font-medium">
              {scanResult.visualEstimateNote || "Visual approximation from photo only. Physical depth/dimensions require on-site crew calibration."}
            </p>
          </div>

          {/* AI Reasoning / Root Cause */}
          {scanResult.reasoning && (
            <div className="bg-primary-fixed/30 border border-primary-fixed-dim rounded-lg p-3 text-xs text-on-surface text-left flex items-start space-x-2">
              <span className="material-symbols-outlined text-primary text-sm shrink-0 mt-0.5">psychology</span>
              <div>
                <strong className="text-primary font-semibold">{assessmentLabel}</strong>
                {scanResult.reasoning}
              </div>
            </div>
          )}

          {/* AI Classification Tags */}
          {scanResult.aiTags && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {scanResult.aiTags.map((tag, i) => (
                <span key={i} className="text-[11px] bg-primary-fixed text-on-primary-fixed px-2.5 py-0.5 rounded-full font-semibold border border-primary-fixed-dim">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
