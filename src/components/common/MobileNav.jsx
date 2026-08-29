import React from 'react';
import { useCivicLens } from '../../context/CivicLensContext';

export const MobileNav = () => {
  const { role, activeTab, navigateTab, startReportWizard } = useCivicLens();

  if (role === 'operator') {
    return (
      <nav className="fixed bottom-0 w-full z-50 rounded-t-xl bg-surface dark:bg-surface-container-highest border-t border-border-subtle shadow-lg flex lg:hidden justify-around items-center h-16 px-2">
        <button
          onClick={() => navigateTab('hotspots')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all ${
            activeTab === 'hotspots'
              ? 'text-primary font-bold bg-primary-fixed'
              : 'text-secondary hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: activeTab === 'hotspots' ? "'FILL' 1" : "'FILL' 0" }}>
            view_list
          </span>
          <span className="text-[10px] font-semibold mt-0.5">Hotspots</span>
        </button>

        <button
          onClick={() => navigateTab('hotspot-detail', { hotspotId: 'HS-402' })}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all ${
            activeTab === 'hotspot-detail'
              ? 'text-primary font-bold bg-primary-fixed'
              : 'text-secondary hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: activeTab === 'hotspot-detail' ? "'FILL' 1" : "'FILL' 0" }}>
            psychology
          </span>
          <span className="text-[10px] font-semibold mt-0.5">AI Insights</span>
        </button>

        <button
          onClick={() => navigateTab('map')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all ${
            activeTab === 'map'
              ? 'text-primary font-bold bg-primary-fixed'
              : 'text-secondary hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-xl">
            map
          </span>
          <span className="text-[10px] font-semibold mt-0.5">Heatmap</span>
        </button>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 w-full z-50 rounded-t-xl bg-surface dark:bg-surface-container-highest border-t border-border-subtle shadow-lg flex lg:hidden justify-around items-center h-16 px-2">
      <button
        onClick={() => navigateTab('home')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all ${
          activeTab === 'home'
            ? 'text-primary font-bold bg-primary-fixed'
            : 'text-secondary hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: activeTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}>
          home
        </span>
        <span className="text-[10px] font-semibold mt-0.5">Home</span>
      </button>

      <button
        onClick={() => startReportWizard()}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all ${
          activeTab === 'report'
            ? 'text-primary font-bold bg-primary-fixed'
            : 'text-secondary hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined text-xl">
          add_circle
        </span>
        <span className="text-[10px] font-semibold mt-0.5">Report</span>
      </button>

      <button
        onClick={() => navigateTab('dashboard')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all ${
          activeTab === 'dashboard'
            ? 'text-primary font-bold bg-primary-fixed'
            : 'text-secondary hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: activeTab === 'dashboard' ? "'FILL' 1" : "'FILL' 0" }}>
          history
        </span>
        <span className="text-[10px] font-semibold mt-0.5">My Reports</span>
      </button>

      <button
        onClick={() => navigateTab('map')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all ${
          activeTab === 'map'
            ? 'text-primary font-bold bg-primary-fixed'
            : 'text-secondary hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined text-xl">
          explore
        </span>
        <span className="text-[10px] font-semibold mt-0.5">City Map</span>
      </button>
    </nav>
  );
};
