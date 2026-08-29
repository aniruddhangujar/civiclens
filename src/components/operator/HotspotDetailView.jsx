import React from 'react';
import { useCivicLens } from '../../context/CivicLensContext';
import { ActionPlanBuilder } from './ActionPlanBuilder';

export const HotspotDetailView = () => {
  const {
    hotspots,
    selectedHotspotId,
    reports,
    navigateTab,
    advanceHotspotLifecycle
  } = useCivicLens();

  const hotspot = hotspots.find(h => h.id === selectedHotspotId) || hotspots[0];
  const clusteredReports = reports.filter(r => hotspot.reportIds.includes(r.id) || r.hotspotId === hotspot.id);

  if (!hotspot) {
    return (
      <div className="max-w-5xl mx-auto py-12 text-center">
        <h2 className="text-headline-md font-bold text-on-surface">No Hotspot Selected</h2>
        <button onClick={() => navigateTab('hotspots')} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg">
          Return to Hotspot Queue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-margin-desktop py-8 text-left space-y-6">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateTab('hotspots')}
            className="text-label-sm font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Hotspot Queue</span>
          </button>
          <span className="text-on-surface-variant">/</span>
          <span className="text-label-sm font-bold text-on-surface">{hotspot.code}</span>
        </div>

        {/* Status Stepper Badge */}
        <div className="flex items-center space-x-2">
          <span className={`text-label-sm font-bold px-3 py-1 rounded-full ${
            hotspot.status === 'Verified' ? 'bg-success-green/20 text-success-green border border-success-green/30' :
            hotspot.status === 'Resolved' ? 'bg-primary-fixed text-primary border border-primary/30' :
            hotspot.status === 'In Progress' ? 'bg-medium-caution-yellow/20 text-tertiary-container' :
            hotspot.status === 'Assigned' ? 'bg-primary-fixed/50 text-on-primary-fixed' :
            'bg-error-container text-critical-red animate-pulse'
          }`}>
            Current State: {hotspot.status.toUpperCase()}
          </span>

          <span className="text-label-sm font-bold bg-critical-red text-white px-3 py-1 rounded-full">
            Severity Index: {hotspot.severityScore}/100
          </span>
        </div>
      </div>

      {/* Main Title & Sector Bar */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-primary bg-primary-fixed px-2.5 py-0.5 rounded-md">
                {hotspot.department}
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                Radius: ~{hotspot.radiusMeters}m perimeter
              </span>
            </div>
            <h1 className="text-headline-lg font-bold text-on-surface mt-1">
              {hotspot.title}
            </h1>
            <p className="text-body-md text-xs text-on-surface-variant flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-sm text-primary">location_on</span>
              <span>{hotspot.locationName}</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-on-surface-variant">Clustered Reports</div>
              <div className="text-headline-md font-bold text-primary">{clusteredReports.length} Citizen Inputs</div>
            </div>
            <div className="text-right pl-3 border-l border-border-subtle">
              <div className="text-[10px] uppercase font-bold text-on-surface-variant">SLA Countdown</div>
              <div className="text-headline-md font-bold text-critical-red">{hotspot.slaHoursRemaining}h remaining</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Pattern Explanation & Root Cause Card (Special AI Lens Glow) */}
      <div className="bg-surface-operator border border-primary-fixed-dim rounded-2xl p-6 shadow-sm ai-lens-glow space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 bg-primary-container text-white rounded-lg flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                psychology
              </span>
            </div>
            <div>
              <h3 className="text-headline-md font-bold text-primary text-base">
                CivicLens AI Pattern Explanation &amp; Root Cause Analysis
              </h3>
              <p className="text-xs text-on-surface-variant">
                Synthesized across multi-source spatial reports, hydrology elevation models, and transit load telemetry.
              </p>
            </div>
          </div>

          <span className="text-label-sm font-bold bg-primary text-white px-3 py-1 rounded-full shadow-sm">
            98.0% Confidence Score
          </span>
        </div>

        <div className="space-y-3 pt-2 text-sm text-on-surface">
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-border-subtle">
            <h4 className="text-label-sm font-bold uppercase text-primary mb-1">Detected Failure Mechanism</h4>
            <p className="text-body-md text-xs leading-relaxed text-on-surface font-medium">
              {hotspot.aiExplanation.rootCause}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-border-subtle">
              <h4 className="text-label-sm font-bold uppercase text-critical-red mb-1">Risk Projection &amp; Failure Escalation</h4>
              <p className="text-xs text-on-surface-variant">
                {hotspot.aiExplanation.riskProjection}
              </p>
            </div>

            <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-border-subtle">
              <h4 className="text-label-sm font-bold uppercase text-on-surface-variant mb-1">Impacted Municipal Sectors</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {hotspot.aiExplanation.affectedSectors.map((sector, i) => (
                  <span key={i} className="text-[11px] bg-surface-container text-on-surface px-2 py-0.5 rounded font-semibold border border-border-subtle">
                    {sector}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clustered Citizen Reports Photo Gallery */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-headline-md font-bold text-on-surface text-base">
              Clustered Citizen Photo Evidence ({clusteredReports.length} Reports)
            </h3>
            <p className="text-xs text-on-surface-variant">
              Spatial deduplication correlated these individual citizen submissions into this single incident response ticket.
            </p>
          </div>
          <span className="text-xs font-semibold text-primary">Spatial Radius: 140m</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {clusteredReports.map((report) => (
            <div
              key={report.id}
              className="border border-border-subtle rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-surface-operator"
            >
              <div className="relative h-36 bg-surface-container">
                <img
                  src={report.imageUrl}
                  alt={report.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/70 text-white px-2 py-0.5 rounded backdrop-blur-sm">
                  #{report.id}
                </span>
                <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded shadow">
                  {report.category}
                </span>
              </div>
              <div className="p-3 text-xs space-y-1">
                <h5 className="font-bold text-on-surface truncate">{report.title}</h5>
                <p className="text-on-surface-variant line-clamp-2">{report.description}</p>
                <div className="pt-2 text-[10px] text-on-surface-variant flex justify-between items-center">
                  <span>Reported by: {report.citizenName}</span>
                  <span className="font-bold text-primary">{report.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Action Plan Builder & Municipal Dispatch */}
      <ActionPlanBuilder hotspot={hotspot} />

      {/* Activity Log / Municipal Audit Trail */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-6 shadow-sm space-y-3">
        <h3 className="text-headline-md font-bold text-on-surface text-base flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-lg">receipt_long</span>
          <span>Municipal Incident Ledger &amp; Telemetry Stream</span>
        </h3>

        <div className="divide-y divide-border-subtle text-xs">
          {hotspot.activityLog.map((log, index) => (
            <div key={index} className="py-2.5 flex items-start space-x-3">
              <span className="text-[11px] font-mono text-on-surface-variant shrink-0 mt-0.5">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <p className="text-on-surface font-medium">{log.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
