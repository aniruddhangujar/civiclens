import React, { useState } from 'react';
import { useCivicLens } from '../../context/CivicLensContext';

export const CitizenDashboard = () => {
  const {
    reports,
    startReportWizard,
    openVerificationModal,
    setSelectedReportId,
    navigateTab,
    karmaPoints
  } = useCivicLens();

  const [activeFilter, setActiveFilter] = useState('all'); // all | active | resolved | verified

  const filteredReports = reports.filter(r => {
    if (activeFilter === 'active') return r.status === 'Detected' || r.status === 'Assigned' || r.status === 'In Progress';
    if (activeFilter === 'resolved') return r.status === 'Resolved';
    if (activeFilter === 'verified') return r.status === 'Verified';
    return true;
  });

  const pendingVerificationReports = reports.filter(r => r.status === 'Resolved');

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-margin-desktop py-8 text-left space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-lowest border border-border-subtle rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-headline-lg font-bold text-on-surface">Citizen Portal</h1>
            <span className="bg-primary-fixed text-on-primary-fixed font-bold text-xs px-2.5 py-0.5 rounded-full border border-primary-fixed-dim">
              Ward 4 Resident
            </span>
          </div>
          <p className="text-body-md text-on-surface-variant text-sm mt-1">
            Track reported infrastructure issues, review municipal repair actions, and verify resolutions.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="bg-surface-operator px-4 py-2 rounded-xl border border-border-subtle flex items-center space-x-2">
            <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              stars
            </span>
            <div>
              <div className="text-[10px] uppercase font-bold text-on-surface-variant">Civic Karma</div>
              <div className="text-body-lg font-bold text-on-surface leading-tight">{karmaPoints} pts</div>
            </div>
          </div>

          <button
            onClick={() => startReportWizard()}
            className="flex-1 md:flex-none px-5 py-2.5 bg-primary-container hover:bg-primary text-white rounded-xl text-label-md font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span>Report New Issue</span>
          </button>
        </div>
      </div>

      {/* Urgent Action Banner for Resolved tickets needing Citizen Verification */}
      {pendingVerificationReports.length > 0 && (
        <div className="bg-gradient-to-r from-primary-fixed/60 via-surface-operator to-primary-fixed/40 border border-primary/30 rounded-2xl p-5 shadow-sm space-y-3 animate-in slide-in-from-top-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  task_alt
                </span>
              </div>
              <div>
                <h3 className="text-headline-md font-bold text-on-surface text-base">
                  Action Required: {pendingVerificationReports.length} Repaired Issue Ready for Your Verification
                </h3>
                <p className="text-body-md text-xs text-on-surface-variant mt-0.5">
                  Public Works Crew #3 has marked repairs complete on Elm St. Please verify the before/after evidence to close out the ticket and claim +50 Karma!
                </p>
              </div>
            </div>

            <button
              onClick={() => openVerificationModal(pendingVerificationReports[0])}
              className="px-4 py-2 bg-primary text-white hover:bg-primary-container text-label-sm font-bold rounded-lg shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <span>Verify Resolution Now</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-border-subtle pb-2">
        {[
          { id: 'all', label: `All Reports (${reports.length})` },
          { id: 'active', label: `In Progress (${reports.filter(r => r.status !== 'Resolved' && r.status !== 'Verified').length})` },
          { id: 'resolved', label: `Resolved (${reports.filter(r => r.status === 'Resolved').length})` },
          { id: 'verified', label: `Verified (${reports.filter(r => r.status === 'Verified').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-lg text-label-md font-semibold transition-colors ${
              activeFilter === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header Info */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-label-sm font-bold text-primary bg-primary-fixed px-2.5 py-0.5 rounded-md">
                    #{report.id}
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    {new Date(report.submittedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Status Badge */}
                <span className={`text-label-sm font-bold px-3 py-1 rounded-full ${
                  report.status === 'Verified' ? 'bg-success-green/20 text-success-green border border-success-green/30' :
                  report.status === 'Resolved' ? 'bg-primary-fixed text-primary border border-primary/30 animate-pulse' :
                  report.status === 'In Progress' ? 'bg-medium-caution-yellow/20 text-tertiary-container' :
                  report.status === 'Assigned' ? 'bg-primary-fixed/50 text-on-primary-fixed' :
                  'bg-error-container text-critical-red'
                }`}>
                  {report.status}
                </span>
              </div>

              {/* Image & Description */}
              <div className="flex space-x-3 mb-3">
                <img
                  src={report.imageUrl}
                  alt={report.title}
                  className="w-20 h-20 object-cover rounded-xl border border-border-subtle shrink-0"
                />
                <div>
                  <h3 className="font-bold text-body-lg text-on-surface line-clamp-1">{report.title}</h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">{report.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-on-surface-variant">
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs text-primary">location_on</span>
                      <span className="truncate max-w-[160px]">{report.locationName}</span>
                    </span>
                    {report.hotspotId && (
                      <span className="bg-surface-operator px-2 py-0.5 rounded font-semibold text-primary">
                        Hotspot {report.hotspotId}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline Micro-Stepper */}
              <div className="py-2.5 px-3 bg-surface-operator rounded-xl border border-border-subtle text-xs space-y-1">
                <div className="font-semibold text-on-surface flex items-center justify-between text-[11px]">
                  <span>Latest Status Update:</span>
                  <span className="text-primary font-bold">{report.status}</span>
                </div>
                <p className="text-[11px] text-on-surface-variant line-clamp-1">
                  {report.timeline && report.timeline[report.timeline.length - 1]?.description}
                </p>
              </div>
            </div>

            {/* Card Action Footer */}
            <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">
                {report.upvotes ? `${report.upvotes} community endorsements` : '1 report logged'}
              </span>

              {report.status === 'Resolved' ? (
                <button
                  onClick={() => openVerificationModal(report)}
                  className="px-4 py-1.5 bg-success-green hover:bg-success-green/90 text-white rounded-lg text-label-sm font-bold shadow-sm flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span>Verify Before / After</span>
                </button>
              ) : report.status === 'Verified' ? (
                <div className="flex items-center gap-1 text-success-green text-label-sm font-bold">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <span>Permanently Verified</span>
                </div>
              ) : (
                <span className="text-label-sm font-semibold text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">hourglass_top</span>
                  <span>In Municipal Queue</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
