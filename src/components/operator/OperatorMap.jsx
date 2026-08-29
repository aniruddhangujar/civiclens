import React, { useState } from 'react';
import { useCivicLens } from '../../context/CivicLensContext';

export const OperatorMap = () => {
  const {
    hotspots,
    reports,
    crews,
    role,
    setSelectedHotspotId,
    navigateTab,
    startReportWizard
  } = useCivicLens();

  const [activeLayer, setActiveLayer] = useState('all'); // all | critical | crews
  const [selectedMapItem, setSelectedMapItem] = useState(hotspots[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop py-6 text-left space-y-4">
      {/* Map Control Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-surface-container-lowest border border-border-subtle rounded-2xl p-4 shadow-sm">
        <div>
          <h1 className="text-headline-md font-bold text-on-surface">
            {role === 'operator' ? 'Municipal Spatial Heatmap & Dispatch Telemetry' : 'City Infrastructure Map'}
          </h1>
          <p className="text-body-md text-xs text-on-surface-variant">
            Live clustering zones, citizen incident pins, and municipal rapid response units.
          </p>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center space-x-2">
          {['all', 'critical', 'crews'].map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-3 py-1.5 rounded-lg text-label-sm font-semibold capitalize transition-all ${
                activeLayer === layer
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface border border-border-subtle text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {layer === 'all' ? 'All Infrastructure' : layer === 'critical' ? 'Critical Clusters Only' : 'Crew Locations'}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Interactive Map Visual */}
        <div className="lg:col-span-2 relative bg-[#1e232d] border border-border-subtle rounded-2xl h-[520px] overflow-hidden shadow-inner flex items-center justify-center">
          {/* Subtle Grid Map Layout */}
          <div className="absolute inset-0 opacity-40 grid-pattern-dark pointer-events-none" />

          {/* SVG Map Streets & Water Body */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="none">
            {/* Waterway (River) */}
            <path d="M-20 400 Q200 450 400 380 T820 420 L820 620 L-20 620 Z" fill="#0d244a" opacity="0.6" />
            <text x="600" y="520" fill="#2d68c4" font-size="14" font-weight="bold" letter-spacing="4">HUDSON SECTOR WATERWAY</text>

            {/* Grid Streets */}
            <g stroke="#3a4150" stroke-width="2" stroke-dasharray="1 1" opacity="0.7">
              <line x1="0" y1="120" x2="800" y2="120" />
              <line x1="0" y1="220" x2="800" y2="220" />
              <line x1="0" y1="320" x2="800" y2="320" />
              <line x1="160" y1="0" x2="160" y2="600" />
              <line x1="340" y1="0" x2="340" y2="600" />
              <line x1="520" y1="0" x2="520" y2="600" />
              <line x1="700" y1="0" x2="700" y2="600" />
            </g>

            {/* Main Arterial Roadway (Elm St & 5th Ave) */}
            <line x1="0" y1="280" x2="800" y2="280" stroke="#4d576a" stroke-width="8" />
            <text x="50" y="272" fill="#8f9bb3" font-size="12" font-weight="bold">ELM STREET (BUS CORRIDOR 14)</text>

            <line x1="380" y1="0" x2="380" y2="600" stroke="#4d576a" stroke-width="8" />
            <text x="390" y="50" fill="#8f9bb3" font-size="12" font-weight="bold">5TH AVENUE</text>

            <line x1="180" y1="0" x2="180" y2="600" stroke="#4d576a" stroke-width="6" />
            <text x="190" y="50" fill="#8f9bb3" font-size="11" font-weight="bold">OAKRIDGE BLVD</text>

            {/* Pulsating Hotspot Radius Rings: Hotspot HS-402 */}
            <g transform="translate(380, 280)">
              <circle r="70" fill="#da1e28" opacity="0.15" className="animate-ping" style={{ animationDuration: '3s' }} />
              <circle r="45" fill="#da1e28" opacity="0.25" />
              <circle r="16" fill="#da1e28" stroke="#ffffff" stroke-width="3" />
              <text x="24" y="-10" fill="#ffffff" font-size="13" font-weight="bold" filter="drop-shadow(0 2px 4px black)">
                HOTSPOT #HS-402 (Critical)
              </text>
              <text x="24" y="8" fill="#ff832b" font-size="10" font-weight="bold">
                Elm &amp; 5th Ave: Hydraulic Erosion Cluster
              </text>
            </g>

            {/* Hotspot HS-319 (Oakridge Signal) */}
            <g transform="translate(180, 150)">
              <circle r="35" fill="#ff832b" opacity="0.2" className="animate-pulse" />
              <circle r="12" fill="#ff832b" stroke="#ffffff" stroke-width="2" />
              <text x="20" y="4" fill="#ffffff" font-size="11" font-weight="bold">
                #HS-319: Signal Outage
              </text>
            </g>

            {/* Crew Marker #3 */}
            <g transform="translate(330, 250)">
              <rect x="-12" y="-12" width="24" height="24" rx="6" fill="#0f62fe" stroke="#ffffff" stroke-width="2" />
              <text x="0" y="4" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">C3</text>
              <text x="-30" y="24" fill="#b4c5ff" font-size="9" font-weight="bold">Crew #3 (En Route)</text>
            </g>
          </svg>

          {/* Interactive Click Overlays for Pins */}
          <button
            onClick={() => setSelectedMapItem(hotspots[0])}
            className="absolute top-[44%] left-[45%] w-12 h-12 rounded-full cursor-pointer hover:scale-110 transition-transform focus:outline-none"
            title="Click to view Hotspot #HS-402"
          />

          <button
            onClick={() => setSelectedMapItem(hotspots[1] || hotspots[0])}
            className="absolute top-[22%] left-[20%] w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform focus:outline-none"
            title="Click to view Hotspot #HS-319"
          />

          {/* Map Overlay Badge */}
          <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md text-white px-3 py-1.5 rounded-lg border border-white/20 text-xs font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success-green animate-pulse" />
            <span>GEO-RADAR ACTIVE (Ward 4 Focus)</span>
          </div>
        </div>

        {/* Selected Item Detail Sidebar */}
        <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          {selectedMapItem ? (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded">
                    Selected Infrastructure Zone
                  </span>
                  <h3 className="text-headline-md font-bold text-on-surface mt-1 text-base">
                    {selectedMapItem.title}
                  </h3>
                </div>
                <span className="text-label-sm font-bold bg-critical-red text-white px-2.5 py-0.5 rounded-full">
                  {selectedMapItem.severityScore}/100 HSI
                </span>
              </div>

              <div className="p-3 bg-surface-operator rounded-xl border border-border-subtle text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant font-medium">Department:</span>
                  <span className="font-bold text-on-surface">{selectedMapItem.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant font-medium">Location:</span>
                  <span className="font-bold text-on-surface">{selectedMapItem.locationName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant font-medium">Clustered Reports:</span>
                  <span className="font-bold text-primary">{selectedMapItem.reportIds?.length || 2} Citizen Inputs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant font-medium">Target SLA:</span>
                  <span className="font-bold text-critical-red">{selectedMapItem.slaHoursRemaining}h remaining</span>
                </div>
              </div>

              {/* AI Root Cause Snippet */}
              <div className="p-3 bg-primary-fixed/20 border border-primary-fixed-dim rounded-xl text-xs space-y-1">
                <div className="font-bold text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">psychology</span>
                  <span>AI Root Cause Insight:</span>
                </div>
                <p className="text-on-surface text-[11px] leading-relaxed">
                  {selectedMapItem.aiExplanation?.rootCause}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-on-surface-variant text-xs">
              Select a cluster pin on the heatmap to view telemetry.
            </div>
          )}

          {/* Action Button */}
          <div className="pt-3 border-t border-border-subtle">
            {role === 'operator' ? (
              <button
                onClick={() => {
                  setSelectedHotspotId(selectedMapItem?.id || 'HS-402');
                  navigateTab('hotspot-detail', { hotspotId: selectedMapItem?.id || 'HS-402' });
                }}
                className="w-full py-2.5 bg-primary hover:bg-primary-container text-white rounded-xl text-label-md font-bold shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Open Full Hotspot Intelligence</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            ) : (
              <button
                onClick={() => startReportWizard()}
                className="w-full py-2.5 bg-primary-container hover:bg-primary text-white rounded-xl text-label-md font-bold shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-sm">add_circle</span>
                <span>Report Issue at this Location</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
