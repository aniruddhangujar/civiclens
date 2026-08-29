import React, { lazy, Suspense } from 'react';
import { useCivicLens } from './context/CivicLensContext';
import { Navbar } from './components/common/Navbar';
import { MobileNav } from './components/common/MobileNav';
import { DemoTourBar } from './components/common/DemoTourBar';
import { NotificationToast } from './components/common/NotificationToast';

const CitizenLanding = lazy(() => import('./components/citizen/CitizenLanding').then(module => ({ default: module.CitizenLanding })));
const CitizenDashboard = lazy(() => import('./components/citizen/CitizenDashboard').then(module => ({ default: module.CitizenDashboard })));
const ReportWizard = lazy(() => import('./components/citizen/ReportWizard').then(module => ({ default: module.ReportWizard })));
const ResolutionVerificationModal = lazy(() => import('./components/citizen/ResolutionVerificationModal').then(module => ({ default: module.ResolutionVerificationModal })));
const OperatorDashboard = lazy(() => import('./components/operator/OperatorDashboard').then(module => ({ default: module.OperatorDashboard })));
const HotspotDetailView = lazy(() => import('./components/operator/HotspotDetailView').then(module => ({ default: module.HotspotDetailView })));
const OperatorMap = lazy(() => import('./components/operator/OperatorMap').then(module => ({ default: module.OperatorMap })));

const ScreenFallback = () => (
  <div className="flex min-h-[40vh] items-center justify-center text-sm font-semibold text-on-surface-variant">
    Loading CivicLens workspace…
  </div>
);

export const App = () => {
  const { role, activeTab } = useCivicLens();

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased flex flex-col justify-between selection:bg-primary-container selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main View Router */}
      <main className="pt-16 pb-28 flex-1">
        <Suspense fallback={<ScreenFallback />}>
        {/* Citizen Views */}
        {role === 'citizen' && (
          <>
            {activeTab === 'home' && <CitizenLanding />}
            {activeTab === 'dashboard' && <CitizenDashboard />}
            {activeTab === 'report' && <ReportWizard />}
            {activeTab === 'map' && <OperatorMap />}
          </>
        )}

        {/* Operator Views */}
        {role === 'operator' && (
          <>
            {activeTab === 'hotspots' && <OperatorDashboard />}
            {activeTab === 'hotspot-detail' && <HotspotDetailView />}
            {activeTab === 'map' && <OperatorMap />}
          </>
        )}
        </Suspense>
      </main>

      {/* Verification Modal (Shown when citizen verifies completed repairs) */}
      <Suspense fallback={null}>
        <ResolutionVerificationModal />
      </Suspense>

      {/* Real-time Notification Toast System */}
      <NotificationToast />

      {/* Demo Walkthrough Controller for Judges */}
      <DemoTourBar />

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};
