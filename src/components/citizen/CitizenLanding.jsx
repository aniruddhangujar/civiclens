import React from 'react';
import { useCivicLens } from '../../context/CivicLensContext';

export const CitizenLanding = () => {
  const {
    startReportWizard,
    navigateTab,
    switchRole,
    reports,
    hotspots,
    jumpToDemoStep
  } = useCivicLens();

  // Dynamic statistics
  const totalReports = 12480 + reports.length;
  const resolvedReports = 3840 + reports.filter(r => r.status === 'Resolved' || r.status === 'Verified').length;
  const resolutionRate = Math.round((resolvedReports / (totalReports > 0 ? totalReports : 1)) * 100) || 91;

  return (
    <div className="relative overflow-x-hidden">
      {/* Background Map Visual (Subtle) - Exactly from Stitch */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent)]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC1ahJ4-D7tEMglZgRjwHCRONX8MIErg4dfmGj-mCrMD1RnuzTWjdAIeVbBM7bQVIFo4WU8kIEogwXAmcEn6-pf_KIRNdGlX_iQ10L6svp06FINXpzUjxdFGDPyPt0FcXSAILYCWxR-g4VnOV6Okeg3Xg3vcv28CKx0yZwZ6euLD35_TGc2Oy0Pn-knn1Whn2et9oOGRinzQsO1Qrd4DPTj-9W-F3QNCG_lNEfLI341FXBvD5YbheWmXQ')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-8 md:pt-16 pb-16">
        <div className="relative text-center max-w-3xl mx-auto space-y-6 md:space-y-8">
          {/* AI Badge */}
          <div className="inline-flex items-center space-x-2 bg-surface-operator border border-primary-fixed-dim rounded-full px-4 py-1.5 shadow-sm">
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <span className="text-label-md font-label-md text-primary font-semibold">
              AI-Powered Civic Action
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-headline-lg-mobile md:text-headline-xl font-headline-xl text-on-surface tracking-tight">
            See a problem.<br />
            <span className="text-primary bg-clip-text">Make it actionable.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">
            CivicLens uses AI to turn citizen reports into prioritized civic action, streamlining communication between residents and municipal operators.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
            <button
              onClick={() => startReportWizard()}
              className="w-full sm:w-auto bg-primary-container hover:bg-primary text-white px-8 py-3.5 rounded-lg text-label-md font-label-md font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer active:scale-98"
            >
              <span className="material-symbols-outlined mr-2 text-lg">add_circle</span>
              Report an Issue
            </button>

            <button
              onClick={() => navigateTab('map')}
              className="w-full sm:w-auto bg-surface-container-lowest border border-border-subtle text-on-surface px-8 py-3.5 rounded-lg text-label-md font-label-md font-semibold hover:bg-surface-variant transition-colors flex items-center justify-center cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined mr-2 text-lg">explore</span>
              Explore City
            </button>

            <button
              onClick={() => switchRole('operator')}
              className="w-full sm:w-auto bg-surface-operator border border-primary-fixed-dim text-primary px-6 py-3.5 rounded-lg text-label-md font-semibold hover:bg-primary-fixed transition-colors flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined mr-2 text-lg">shield</span>
              Operator Portal
            </button>
          </div>

          {/* 1-Click Judge Demo Quickstart */}
          <div className="pt-4 max-w-lg mx-auto">
            <div className="bg-surface-container-lowest/90 border border-primary/20 rounded-xl p-3 shadow-sm flex items-center justify-between text-left">
              <div className="flex items-center space-x-2.5">
                <span className="material-symbols-outlined text-primary text-xl">play_circle</span>
                <div>
                  <div className="text-label-sm font-bold text-on-surface">Hackathon Judge Demo Flow</div>
                  <div className="text-[11px] text-on-surface-variant">Step 1 of 20: Start interactive closed-loop walkthrough</div>
                </div>
              </div>
              <button
                onClick={() => jumpToDemoStep(3)}
                className="bg-primary hover:bg-primary-container text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
              >
                Launch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section (Glassmorphism inspired from Stitch) */}
      <section className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop -mt-4 relative z-20">
        <div className="bg-surface-container-lowest/80 backdrop-blur-md border border-border-subtle rounded-xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border-subtle">
          <div className="space-y-1.5 pt-4 md:pt-0">
            <div className="text-headline-lg font-headline-lg text-primary font-bold">
              {totalReports.toLocaleString()}
            </div>
            <div className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
              Reports Processed
            </div>
          </div>

          <div className="space-y-1.5 pt-4 md:pt-0">
            <div className="text-headline-lg font-headline-lg text-success-green font-bold">
              {resolvedReports.toLocaleString()}
            </div>
            <div className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
              Issues Resolved
            </div>
          </div>

          <div className="space-y-1.5 pt-4 md:pt-0">
            <div className="text-headline-lg font-headline-lg text-primary-container font-bold">
              {resolutionRate}%
            </div>
            <div className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
              Resolution Rate
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (Bento Grid from Stitch with interactive drill-down) */}
      <section className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop py-20">
        <div className="text-center mb-14 space-y-3">
          <h2 className="text-headline-lg font-headline-lg text-on-surface">
            How CivicLens Works
          </h2>
          <p className="text-body-md font-body-md text-on-surface-variant max-w-xl mx-auto">
            A seamless pipeline from observation to resolution, powered by intelligent routing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 01: Capture */}
          <div 
            onClick={() => startReportWizard()}
            className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group cursor-pointer hover:border-primary"
          >
            <div className="absolute top-0 right-0 p-4 text-headline-xl font-headline-xl text-surface-container-high font-bold opacity-30 select-none">
              01
            </div>
            <div className="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center mb-6 text-primary group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                photo_camera
              </span>
            </div>
            <h3 className="text-headline-md font-headline-md mb-2">Capture</h3>
            <p className="text-body-md font-body-md text-on-surface-variant">
              Citizens easily report local issues via mobile app, snapping photos and tagging locations.
            </p>
            <div className="mt-4 flex items-center text-label-sm font-semibold text-primary">
              <span>Try Reporting</span>
              <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </div>
          </div>

          {/* Step 02: Understand (AI Lens Glow) */}
          <div 
            onClick={() => jumpToDemoStep(5)}
            className="bg-surface-operator border border-primary-fixed-dim rounded-xl p-6 shadow-sm ai-lens-glow relative overflow-hidden group cursor-pointer hover:border-primary"
          >
            <div className="absolute top-0 right-0 p-4 text-headline-xl font-headline-xl text-primary-fixed opacity-50 select-none">
              02
            </div>
            <div className="w-12 h-12 bg-primary-container text-white rounded-lg flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                memory
              </span>
            </div>
            <h3 className="text-headline-md font-headline-md mb-2 text-primary">Understand</h3>
            <p className="text-body-md font-body-md text-on-surface-variant">
              AI analyzes the report, categorizes the issue severity, and deduplicates identical cases.
            </p>
            <div className="mt-4 flex items-center text-label-sm font-semibold text-primary">
              <span>View AI Scanner</span>
              <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </div>
          </div>

          {/* Step 03: Act */}
          <div 
            onClick={() => {
              switchRole('operator');
              navigateTab('hotspot-detail', { hotspotId: 'HS-402' });
            }}
            className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group cursor-pointer hover:border-medium-caution-yellow"
          >
            <div className="absolute top-0 right-0 p-4 text-headline-xl font-headline-xl text-surface-container-high font-bold opacity-30 select-none">
              03
            </div>
            <div className="w-12 h-12 bg-medium-caution-yellow/20 rounded-lg flex items-center justify-center mb-6 text-tertiary-container group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                assignment_turned_in
              </span>
            </div>
            <h3 className="text-headline-md font-headline-md mb-2">Act</h3>
            <p className="text-body-md font-body-md text-on-surface-variant">
              Intelligently routed to the correct municipal department queue for prioritized resolution.
            </p>
            <div className="mt-4 flex items-center text-label-sm font-semibold text-on-surface-variant group-hover:text-primary">
              <span>Inspect Action Plans</span>
              <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </div>
          </div>

          {/* Step 04: Verify */}
          <div 
            onClick={() => jumpToDemoStep(18)}
            className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group cursor-pointer hover:border-success-green"
          >
            <div className="absolute top-0 right-0 p-4 text-headline-xl font-headline-xl text-surface-container-high font-bold opacity-30 select-none">
              04
            </div>
            <div className="w-12 h-12 bg-success-green/20 rounded-lg flex items-center justify-center mb-6 text-success-green group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            </div>
            <h3 className="text-headline-md font-headline-md mb-2">Verify</h3>
            <p className="text-body-md font-body-md text-on-surface-variant">
              Operators update status, notifying the citizen when the issue is resolved for photographic audit.
            </p>
            <div className="mt-4 flex items-center text-label-sm font-semibold text-success-green">
              <span>Try Verification Diff</span>
              <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </div>
          </div>
        </div>
      </section>

      {/* Community Activity Preview */}
      <section className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop pb-28">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-headline-md font-semibold text-on-surface">Recent Community Activity</h3>
            <p className="text-body-md text-on-surface-variant text-xs">Live updates from Ward 4 & surrounding metropolitan sectors</p>
          </div>
          <button
            onClick={() => navigateTab('dashboard')}
            className="text-label-md font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All Reports</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reports.slice(0, 3).map((report) => (
            <div
              key={report.id}
              onClick={() => navigateTab('dashboard')}
              className="bg-surface-container-lowest border border-border-subtle rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                    {report.category}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    report.status === 'Verified' ? 'bg-success-green/15 text-success-green' :
                    report.status === 'Resolved' ? 'bg-primary-fixed text-primary' :
                    report.status === 'In Progress' ? 'bg-medium-caution-yellow/20 text-tertiary-container' :
                    'bg-error-container text-critical-red'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <h4 className="font-semibold text-body-md text-on-surface line-clamp-1">{report.title}</h4>
                <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">{report.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">location_on</span>
                  <span className="truncate max-w-[140px]">{report.locationName}</span>
                </span>
                <span className="font-medium text-primary">#{report.id}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
