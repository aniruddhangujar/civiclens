import React, { useState } from 'react';
import { useCivicLens } from '../../context/CivicLensContext';

export const Navbar = () => {
  const {
    role,
    switchRole,
    activeTab,
    navigateTab,
    karmaPoints,
    notifications,
    startReportWizard,
    resetDemoData,
    isFirebaseConfigured
  } = useCivicLens();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="bg-surface dark:bg-surface-container-low border-b border-border-subtle dark:border-outline-variant flex justify-between items-center w-full px-4 md:px-margin-desktop h-16 fixed top-0 z-50 shadow-sm backdrop-blur-md bg-surface/95">
      {/* Brand Logo & Name */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateTab(role === 'operator' ? 'hotspots' : 'home')}>
        <div className="h-9 w-9 bg-primary flex items-center justify-center rounded-lg shadow-sm border border-primary-fixed-dim text-white font-bold text-lg">
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            radar
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-headline-lg font-headline-lg font-semibold text-primary dark:text-primary-fixed-dim leading-none">
            CivicLens
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] tracking-wider uppercase font-semibold text-on-surface-variant">
              {role === 'operator' ? 'Municipal Intelligence' : 'Civic Action'}
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
              isFirebaseConfigured
                ? 'bg-success-green/15 text-success-green border-success-green/30'
                : 'bg-surface-container text-on-surface-variant border-border-subtle'
            }`}>
              {isFirebaseConfigured ? '☁️ Firestore' : '💾 Offline Local'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links - Role Switcher & Main Tabs */}
      <div className="flex space-x-1 sm:space-x-4 items-center">
        {/* Role Toggle Pill */}
        <div className="bg-surface-container border border-border-subtle p-1 rounded-full flex items-center shadow-inner">
          <button
            onClick={() => switchRole('citizen')}
            className={`px-3 sm:px-4 py-1 rounded-full text-label-md font-semibold transition-all flex items-center space-x-1.5 ${
              role === 'citizen'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: role === 'citizen' ? "'FILL' 1" : "'FILL' 0" }}>
              person
            </span>
            <span>Citizen</span>
          </button>

          <button
            onClick={() => switchRole('operator')}
            className={`px-3 sm:px-4 py-1 rounded-full text-label-md font-semibold transition-all flex items-center space-x-1.5 ${
              role === 'operator'
                ? 'bg-primary-container text-white shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: role === 'operator' ? "'FILL' 1" : "'FILL' 0" }}>
              shield
            </span>
            <span>Operator</span>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex space-x-5 items-center pl-4 border-l border-border-subtle">
          {role === 'citizen' ? (
            <>
              <button
                onClick={() => navigateTab('home')}
                className={`text-label-md font-semibold pb-1 transition-colors ${
                  activeTab === 'home'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigateTab('dashboard')}
                className={`text-label-md font-semibold pb-1 transition-colors ${
                  activeTab === 'dashboard'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                My Community
              </button>
              <button
                onClick={() => startReportWizard()}
                className="bg-primary-container hover:bg-primary text-white px-3 py-1.5 rounded-lg text-label-md font-semibold transition-colors flex items-center space-x-1 shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">add_circle</span>
                <span>Report Issue</span>
              </button>
              <button
                onClick={() => navigateTab('map')}
                className={`text-label-md font-semibold pb-1 transition-colors ${
                  activeTab === 'map'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                City Map
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigateTab('hotspots')}
                className={`text-label-md font-semibold pb-1 transition-colors ${
                  activeTab === 'hotspots'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Hotspots Queue
              </button>
              <button
                onClick={() => navigateTab('hotspot-detail', { hotspotId: 'HS-402' })}
                className={`text-label-md font-semibold pb-1 transition-colors ${
                  activeTab === 'hotspot-detail'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                AI Intelligence Deep Dive
              </button>
              <button
                onClick={() => navigateTab('map')}
                className={`text-label-md font-semibold pb-1 transition-colors ${
                  activeTab === 'map'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Infrastructure Heatmap
              </button>
            </>
          )}
        </div>
      </div>

      {/* Right Controls: Karma, Notifications, Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Citizen Karma Badge */}
        {role === 'citizen' && (
          <div className="hidden sm:flex items-center space-x-1.5 bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-label-sm font-bold border border-primary-fixed-dim">
            <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              stars
            </span>
            <span>{karmaPoints} Karma</span>
          </div>
        )}

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-variant relative"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-critical-red rounded-full ring-2 ring-surface animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest border border-border-subtle rounded-xl shadow-modal z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex justify-between items-center pb-3 border-b border-border-subtle">
                <span className="font-semibold text-body-md text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-sm">notifications_active</span>
                  Live Municipal Alerts
                </span>
                <span className="text-label-sm text-on-surface-variant font-medium">
                  {notifications.length} alerts
                </span>
              </div>

              <div className="divide-y divide-border-subtle max-h-72 overflow-y-auto mt-2">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-on-surface-variant text-body-md">
                    No active notifications. System nominal.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="py-3 text-left space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-label-md font-semibold text-primary">{n.title}</span>
                        <span className="text-[10px] text-on-surface-variant">{n.timestamp}</span>
                      </div>
                      <p className="text-body-md text-on-surface-variant text-xs">{n.message}</p>
                      {n.action && (
                        <button
                          onClick={() => {
                            n.action.action();
                            setShowNotifications(false);
                          }}
                          className="mt-1.5 text-label-sm font-semibold text-primary-container hover:underline inline-flex items-center gap-1"
                        >
                          <span>{n.action.label}</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account / Preset Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-surface-variant border border-border-subtle"
            title="User Profile & Demo Controls"
          >
            <span className="material-symbols-outlined text-xl">account_circle</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest border border-border-subtle rounded-xl shadow-modal z-50 p-3 text-left animate-in fade-in duration-150">
              <div className="px-3 py-2 border-b border-border-subtle">
                <div className="font-semibold text-body-md text-on-surface">
                  {role === 'operator' ? 'Operator J. Mercer' : 'Sarah Lin (Resident)'}
                </div>
                <div className="text-label-sm text-on-surface-variant">
                  {role === 'operator' ? 'Municipal Infrastructure Operations' : 'Ward 4 - Metro West'}
                </div>
              </div>
              <div className="py-2 space-y-1">
                <button
                  onClick={() => {
                    switchRole(role === 'citizen' ? 'operator' : 'citizen');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-label-md hover:bg-surface-variant rounded-md text-on-surface flex items-center justify-between"
                >
                  <span>Switch to {role === 'citizen' ? 'Operator View' : 'Citizen View'}</span>
                  <span className="material-symbols-outlined text-sm">swap_horiz</span>
                </button>
                <button
                  onClick={() => {
                    resetDemoData();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-label-md text-critical-red hover:bg-error-container/30 rounded-md flex items-center justify-between"
                >
                  <span>Reset Demo Data</span>
                  <span className="material-symbols-outlined text-sm">refresh</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
