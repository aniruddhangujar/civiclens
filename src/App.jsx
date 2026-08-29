import React from 'react';
import { useCivicLens } from './context/CivicLensContext';
import { Navbar } from './components/common/Navbar';
import { MobileNav } from './components/common/MobileNav';
import { DemoTourBar } from './components/common/DemoTourBar';
import { NotificationToast } from './components/common/NotificationToast';
import { CitizenLanding } from './components/citizen/CitizenLanding';
import { CitizenDashboard } from './components/citizen/CitizenDashboard';
import { ReportWizard } from './components/citizen/ReportWizard';
import { ResolutionVerificationModal } from './components/citizen/ResolutionVerificationModal';
import { OperatorDashboard } from './components/operator/OperatorDashboard';
import { HotspotDetailView } from './components/operator/HotspotDetailView';
import { OperatorMap } from './components/operator/OperatorMap';

export const App = () => {
  const { role, activeTab } = useCivicLens();

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased flex flex-col justify-between selection:bg-primary-container selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main View Router */}
      <main className="pt-16 pb-28 flex-1">
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
      </main>

      {/* Verification Modal (Shown when citizen verifies completed repairs) */}
      <ResolutionVerificationModal />

      {/* Real-time Notification Toast System */}
      <NotificationToast />

      {/* Demo Walkthrough Controller for Judges */}
      <DemoTourBar />

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};
