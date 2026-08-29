import React from 'react';

export const DuplicateDetectionCard = ({
  similarReports,
  onMergeWithExisting,
  onCreateNewReport
}) => {
  return (
    <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-5 shadow-sm space-y-4 text-left">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-high-warning-orange/20 rounded-lg flex items-center justify-center text-tertiary-container">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              nearby
            </span>
          </div>
          <div>
            <h3 className="text-headline-md font-semibold text-on-surface">
              Similar Citizen Reports Detected Nearby
            </h3>
            <p className="text-body-md text-xs text-on-surface-variant">
              CivicLens deterministic proximity rules found {similarReports.length} related reports in the selected demo area.
            </p>
          </div>
        </div>

        <span className="text-label-sm font-bold bg-high-warning-orange/15 text-tertiary-container px-2.5 py-1 rounded-full">
          Deterministic match
        </span>
      </div>

      {/* List of similar nearby reports */}
      <div className="space-y-2.5">
        {similarReports.map((report) => (
          <div
            key={report.id}
            className="border border-border-subtle rounded-lg p-3 hover:bg-surface-variant transition-colors flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <img
                src={report.imageUrl}
                alt={report.title}
                className="w-12 h-12 object-cover rounded-md border border-border-subtle"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-bold text-primary">#{report.id}</span>
                  <span className="text-[10px] bg-primary-fixed text-on-primary-fixed px-1.5 py-0.2 rounded font-semibold">
                    Demo match
                  </span>
                  <span className="text-[10px] text-on-surface-variant">
                    {new Date(report.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h4 className="text-body-md font-semibold text-on-surface text-sm line-clamp-1">{report.title}</h4>
                <p className="text-xs text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">location_on</span>
                  <span>{report.locationName}</span>
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold text-on-surface-variant flex items-center gap-1 justify-end">
                <span className="material-symbols-outlined text-xs text-primary">thumb_up</span>
                <span>{report.upvotes || 1} upvotes</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Action Options */}
      <div className="pt-2 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-on-surface-variant">
          Your confirmation is stored as a separate report and deterministically grouped into the selected hotspot.
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={() => onMergeWithExisting()}
            className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg text-label-sm font-semibold hover:bg-primary-container transition-colors shadow-sm flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">group_work</span>
            <span>Attach as Confirmation</span>
          </button>

          <button
            onClick={() => onCreateNewReport()}
            className="w-full sm:w-auto px-4 py-2 border border-border-subtle text-on-surface hover:bg-surface-variant rounded-lg text-label-sm font-semibold transition-colors flex items-center justify-center gap-1"
          >
            <span>Submit as Distinct</span>
          </button>
        </div>
      </div>
    </div>
  );
};
