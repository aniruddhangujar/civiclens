import React, { useState } from 'react';
import { useCivicLens } from '../../context/CivicLensContext';

export const OperatorDashboard = () => {
  const {
    hotspots,
    reports,
    crews,
    navigateTab,
    setSelectedHotspotId,
    advanceHotspotLifecycle
  } = useCivicLens();

  const [selectedDept, setSelectedDept] = useState('all');

  const filteredHotspots = hotspots.filter(h => {
    if (selectedDept === 'all') return true;
    return h.department.toLowerCase().includes(selectedDept.toLowerCase());
  });

  const criticalCount = hotspots.filter(h => h.severity === 'Critical').length;
  const dispatchedCrewsCount = crews.filter(c => c.status === 'Dispatched' || c.status.includes('Active')).length;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop py-8 text-left space-y-6">
      {/* Operator Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-lowest border border-border-subtle rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-success-green rounded-full animate-ping" />
            <h1 className="text-headline-lg font-bold text-on-surface">Municipal Telemetry &amp; Hotspot Operations</h1>
          </div>
          <p className="text-body-md text-on-surface-variant text-sm mt-1">
            Real-time AI spatial clustering, automated root-cause synthesis, and multi-agency work order orchestration.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigateTab('map')}
            className="px-4 py-2.5 bg-surface-operator hover:bg-primary-fixed border border-primary-fixed-dim text-primary rounded-xl text-label-md font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">map</span>
            <span>City Heatmap View</span>
          </button>

          <button
            onClick={() => navigateTab('hotspot-detail', { hotspotId: 'HS-402' })}
            className="px-5 py-2.5 bg-primary-container hover:bg-primary text-white rounded-xl text-label-md font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-98"
          >
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              psychology
            </span>
            <span>Open Hotspot #HS-402</span>
          </button>
        </div>
      </div>

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-4 shadow-sm">
          <div className="text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">Active Hotspots</div>
          <div className="text-headline-lg font-bold text-primary mt-1">{hotspots.length} Clusters</div>
          <div className="text-[11px] text-on-surface-variant mt-1">Aggregated from {reports.length} citizen tickets</div>
        </div>

        <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-4 shadow-sm">
          <div className="text-label-sm font-bold uppercase tracking-wider text-critical-red">Critical Severity Rate</div>
          <div className="text-headline-lg font-bold text-critical-red mt-1">{criticalCount} Critical</div>
          <div className="text-[11px] text-on-surface-variant mt-1">Requiring immediate dispatch &lt;4h</div>
        </div>

        <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-4 shadow-sm">
          <div className="text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">Active Crews Dispatched</div>
          <div className="text-headline-lg font-bold text-tertiary-container mt-1">{dispatchedCrewsCount} / {crews.length} Units</div>
          <div className="text-[11px] text-on-surface-variant mt-1">Field telemetry active</div>
        </div>

        <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-4 shadow-sm">
          <div className="text-label-sm font-bold uppercase tracking-wider text-success-green">AI Model Accuracy</div>
          <div className="text-headline-lg font-bold text-success-green mt-1">98.4%</div>
          <div className="text-[11px] text-on-surface-variant mt-1">Automated cluster confidence</div>
        </div>
      </div>

      {/* Priority Hotspot Queue Table */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl shadow-sm overflow-hidden">
        {/* Table Filter Header */}
        <div className="p-5 border-b border-border-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-headline-md font-bold text-on-surface text-base">
              Priority Hotspots Queue
            </h2>
            <p className="text-xs text-on-surface-variant">
              Ranked by Hotspot Severity Index (HSI) and multi-report acceleration rate.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-on-surface-variant font-semibold">Filter Department:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-surface-container-low border border-border-subtle text-xs rounded-lg px-3 py-1.5 font-medium text-on-surface focus:outline-primary"
            >
              <option value="all">All Departments</option>
              <option value="public works">Public Works &amp; Transportation</option>
              <option value="traffic">Traffic Operations &amp; Signals</option>
              <option value="sanitation">Sanitation &amp; Drainage</option>
            </select>
          </div>
        </div>

        {/* Hotspots Data Rows */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-operator border-b border-border-subtle text-on-surface-variant font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Hotspot Code</th>
                <th className="py-3 px-4">Incident Title &amp; Sector</th>
                <th className="py-3 px-4">Department Taskforce</th>
                <th className="py-3 px-4 text-center">Clustered Reports</th>
                <th className="py-3 px-4">Severity Score</th>
                <th className="py-3 px-4">Status &amp; SLA</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredHotspots.map((hotspot) => (
                <tr
                  key={hotspot.id}
                  className="hover:bg-surface-operator transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedHotspotId(hotspot.id);
                    navigateTab('hotspot-detail', { hotspotId: hotspot.id });
                  }}
                >
                  <td className="py-4 px-4 font-mono font-bold text-primary">
                    {hotspot.code}
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-on-surface text-sm line-clamp-1">{hotspot.title}</div>
                    <div className="text-on-surface-variant text-[11px] flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-xs text-primary">location_on</span>
                      <span>{hotspot.locationName}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="bg-surface-container text-on-surface px-2 py-1 rounded font-semibold text-[11px] border border-border-subtle">
                      {hotspot.department}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center justify-center bg-primary-fixed text-primary font-bold px-2.5 py-0.5 rounded-full text-xs">
                      {hotspot.reportIds.length} Reports
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-surface-container rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            hotspot.severityScore > 90 ? 'bg-critical-red' :
                            hotspot.severityScore > 75 ? 'bg-high-warning-orange' : 'bg-medium-caution-yellow'
                          }`}
                          style={{ width: `${hotspot.severityScore}%` }}
                        />
                      </div>
                      <span className="font-bold text-xs">{hotspot.severityScore}/100</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        hotspot.status === 'Verified' ? 'bg-success-green/20 text-success-green' :
                        hotspot.status === 'Resolved' ? 'bg-primary-fixed text-primary' :
                        hotspot.status === 'In Progress' ? 'bg-medium-caution-yellow/20 text-tertiary-container' :
                        hotspot.status === 'Assigned' ? 'bg-primary-fixed/50 text-on-primary-fixed' :
                        'bg-error-container text-critical-red animate-pulse'
                      }`}>
                        {hotspot.status}
                      </span>
                      <div className="text-[10px] text-on-surface-variant font-mono">
                        {hotspot.slaHoursRemaining}h SLA
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setSelectedHotspotId(hotspot.id);
                        navigateTab('hotspot-detail', { hotspotId: hotspot.id });
                      }}
                      className="px-3 py-1.5 bg-primary text-white hover:bg-primary-container rounded-lg text-label-sm font-semibold shadow-sm inline-flex items-center gap-1"
                    >
                      <span>Deep Dive</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
