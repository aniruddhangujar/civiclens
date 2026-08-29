import React, { useState } from 'react';
import { useCivicLens } from '../../context/CivicLensContext';

export const ActionPlanBuilder = ({ hotspot }) => {
  const { crews, approveActionPlan, advanceHotspotLifecycle } = useCivicLens();
  const [selectedCrewId, setSelectedCrewId] = useState(hotspot.assignedCrewId || hotspot.actionPlan?.recommendedCrewId || crews[0]?.id);
  const [isApproving, setIsApproving] = useState(false);

  const plan = hotspot.actionPlan;
  if (!plan) return null;

  const handleApprove = () => {
    setIsApproving(true);
    setTimeout(() => {
      approveActionPlan(hotspot.id, selectedCrewId);
      setIsApproving(false);
    }, 500);
  };

  return (
    <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-6 shadow-sm text-left space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-border-subtle">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              engineering
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded">
                AI Synthesized Action Plan
              </span>
              <span className="text-xs text-on-surface-variant font-medium">Auto-Generated</span>
            </div>
            <h3 className="text-headline-md font-bold text-on-surface text-lg mt-0.5">
              {plan.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-label-sm font-bold bg-surface-operator border border-border-subtle text-on-surface px-3 py-1 rounded-lg">
            Est. Cost: {plan.estimatedCost}
          </span>
          <span className="text-label-sm font-bold bg-surface-operator border border-border-subtle text-on-surface px-3 py-1 rounded-lg">
            Target SLA: {plan.targetSLA}
          </span>
        </div>
      </div>

      {/* 4 Structured Municipal Remediation Phases */}
      <div className="space-y-3">
        <h4 className="text-label-sm font-bold uppercase text-on-surface-variant tracking-wider">
          Multi-Agency Remediation Protocol (4 Phases)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {plan.phases.map((phase) => (
            <div
              key={phase.phase}
              className="bg-surface-operator border border-border-subtle rounded-xl p-4 space-y-2 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded">
                  Phase 0{phase.phase}
                </span>
                <span className="text-[11px] font-semibold text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">timer</span>
                  <span>{phase.duration}</span>
                </span>
              </div>

              <h5 className="font-bold text-body-md text-on-surface text-sm">{phase.name}</h5>
              <p className="text-xs text-on-surface-variant">{phase.action}</p>

              <div className="pt-2 border-t border-border-subtle/60 text-[11px] text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">build</span>
                <span className="font-medium truncate">{phase.resources}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dispatch Crew Assignment Form */}
      <div className="p-4 bg-surface-container-low border border-border-subtle rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <label className="text-label-sm font-bold text-on-surface uppercase flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-primary">local_shipping</span>
            <span>Assign Municipal Response Crew:</span>
          </label>
          <span className="text-xs text-on-surface-variant">Recommended: Rapid Response Multi-Disciplinary #3</span>
        </div>

        <select
          value={selectedCrewId}
          onChange={(e) => setSelectedCrewId(e.target.value)}
          disabled={hotspot.status !== 'Detected'}
          className="w-full bg-surface-container-lowest border border-border-subtle rounded-lg p-2.5 text-body-md text-sm font-medium text-on-surface focus:outline-primary disabled:opacity-75"
        >
          {crews.map((crew) => (
            <option key={crew.id} value={crew.id}>
              {crew.name} — Lead: {crew.lead} ({crew.vehicle}) [{crew.status}]
            </option>
          ))}
        </select>
      </div>

      {/* Action Approval Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-xs text-on-surface-variant">
          {hotspot.status === 'Detected' ? (
            <span>Approving this plan generates a live municipal work order and dispatches the field unit.</span>
          ) : hotspot.status === 'Assigned' ? (
            <span className="text-primary font-bold">Crew Dispatched! Work order active. Advance status when crew begins on-site work.</span>
          ) : hotspot.status === 'In Progress' ? (
            <span className="text-tertiary-container font-bold">Repair in progress. Subsurface hydraulic clamp and fresh asphalt seal applied.</span>
          ) : hotspot.status === 'Resolved' ? (
            <span className="text-success-green font-bold">Repairs completed! Ready for citizen photographic verification.</span>
          ) : (
            <span className="text-success-green font-bold">Ticket permanently verified and closed.</span>
          )}
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          {hotspot.status === 'Detected' && (
            <button
              onClick={handleApprove}
              disabled={isApproving}
              className="w-full sm:w-auto px-6 py-3 bg-primary-container hover:bg-primary text-white rounded-xl text-label-md font-bold shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <span>{isApproving ? "Dispatching Crew..." : "Approve & Dispatch Action Plan"}</span>
            </button>
          )}

          {hotspot.status === 'Assigned' && (
            <button
              onClick={() => advanceHotspotLifecycle(hotspot.id, 'In Progress')}
              className="w-full sm:w-auto px-6 py-2.5 bg-medium-caution-yellow/30 hover:bg-medium-caution-yellow/50 text-tertiary-container border border-medium-caution-yellow rounded-xl text-label-md font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-sm">engineering</span>
              <span>Mark Crew On-Site (In Progress)</span>
            </button>
          )}

          {hotspot.status === 'In Progress' && (
            <button
              onClick={() => advanceHotspotLifecycle(hotspot.id, 'Resolved')}
              className="w-full sm:w-auto px-6 py-2.5 bg-success-green hover:bg-success-green/90 text-white rounded-xl text-label-md font-bold flex items-center justify-center gap-1.5 shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-sm">task_alt</span>
              <span>Complete Repair &amp; Attach Proof</span>
            </button>
          )}

          {hotspot.status === 'Resolved' && (
            <div className="px-4 py-2 bg-primary-fixed text-primary font-bold text-label-sm rounded-lg flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">mark_email_read</span>
              <span>Citizen Verification Awaiting</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
