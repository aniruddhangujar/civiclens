import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  INITIAL_REPORTS,
  INITIAL_HOTSPOTS,
  INITIAL_CREWS,
  AI_SCAN_PRESETS,
  DEMO_STEPS,
  SAMPLE_INFRASTRUCTURE_IMAGES
} from '../data/seededData';
import { analyzeInfrastructurePhoto } from '../services/aiVisionService';
import { isFirebaseConfigured } from '../services/firebase';
import {
  subscribeToReports,
  subscribeToHotspots,
  syncReportToFirestore,
  syncHotspotToFirestore,
  seedFirestoreCollectionsIfEmpty,
  resetFirestoreCollections
} from '../services/firestoreService';

const CivicLensContext = createContext(null);

const STORAGE_KEY = 'civiclens_app_state_v1';

export const CivicLensProvider = ({ children }) => {
  const [role, setRole] = useState('citizen'); // 'citizen' | 'operator'
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'dashboard' | 'report' | 'my-reports' | 'map' | 'hotspots' | 'hotspot-detail' | 'analytics'
  
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_reports`);
      return saved ? JSON.parse(saved) : INITIAL_REPORTS;
    } catch {
      return INITIAL_REPORTS;
    }
  });

  const [hotspots, setHotspots] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_hotspots`);
      return saved ? JSON.parse(saved) : INITIAL_HOTSPOTS;
    } catch {
      return INITIAL_HOTSPOTS;
    }
  });

  const [crews, setCrews] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_crews`);
      return saved ? JSON.parse(saved) : INITIAL_CREWS;
    } catch {
      return INITIAL_CREWS;
    }
  });

  const [karmaPoints, setKarmaPoints] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_karma`);
      return saved ? JSON.parse(saved) : 150;
    } catch {
      return 150;
    }
  });

  const [selectedHotspotId, setSelectedHotspotId] = useState('HS-402');
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [currentDemoStep, setCurrentDemoStep] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [activeVerificationTicket, setActiveVerificationTicket] = useState(null);

  // Wizard state for citizen report creation
  const [wizardState, setWizardState] = useState({
    step: 1, // 1: Upload, 2: AI Scanning, 3: Similar Reports, 4: Confirm & Submit, 5: Success Receipt
    selectedPreset: AI_SCAN_PRESETS[0],
    uploadedImage: AI_SCAN_PRESETS[0].imageUrl,
    isScanning: false,
    scanProgress: 0,
    scanResult: null,
    similarReports: [],
    customTitle: '',
    customDescription: '',
    customLocation: '',
    submittedReportId: null
  });

  // 1. Initialize Firestore subscriptions & auto-seeding if Firebase is active
  useEffect(() => {
    if (isFirebaseConfigured) {
      seedFirestoreCollectionsIfEmpty(INITIAL_REPORTS, INITIAL_HOTSPOTS);

      const unsubReports = subscribeToReports(cloudReports => {
        if (cloudReports && cloudReports.length > 0) {
          setReports(cloudReports);
        }
      });

      const unsubHotspots = subscribeToHotspots(cloudHotspots => {
        if (cloudHotspots && cloudHotspots.length > 0) {
          setHotspots(cloudHotspots);
        }
      });

      return () => {
        unsubReports();
        unsubHotspots();
      };
    }
  }, []);

  // 2. Save changes to localStorage as reliable offline backing store
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_reports`, JSON.stringify(reports));
      localStorage.setItem(`${STORAGE_KEY}_hotspots`, JSON.stringify(hotspots));
      localStorage.setItem(`${STORAGE_KEY}_crews`, JSON.stringify(crews));
      localStorage.setItem(`${STORAGE_KEY}_karma`, JSON.stringify(karmaPoints));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [reports, hotspots, crews, karmaPoints]);

  const addNotification = (title, message, type = 'info', action = null) => {
    const id = Date.now() + Math.random().toString();
    const newNotification = { id, title, message, type, action, timestamp: new Date().toLocaleTimeString() };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 6000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const switchRole = (newRole) => {
    setRole(newRole);
    if (newRole === 'operator') {
      if (activeTab === 'home' || activeTab === 'report' || activeTab === 'my-reports' || activeTab === 'dashboard') {
        setActiveTab('hotspots');
      }
    } else {
      if (activeTab === 'hotspots' || activeTab === 'hotspot-detail' || activeTab === 'analytics') {
        setActiveTab('home');
      }
    }
  };

  const navigateTab = (tab, params = {}) => {
    if (params.hotspotId) {
      setSelectedHotspotId(params.hotspotId);
    }
    if (params.reportId) {
      setSelectedReportId(params.reportId);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startReportWizard = (presetId = null) => {
    const preset = AI_SCAN_PRESETS.find(p => p.id === presetId) || AI_SCAN_PRESETS[0];
    setWizardState({
      step: 1,
      selectedPreset: preset,
      uploadedImage: preset.imageUrl,
      isScanning: false,
      scanProgress: 0,
      scanResult: null,
      similarReports: [],
      customTitle: preset.title,
      customDescription: preset.description,
      customLocation: preset.locationName,
      submittedReportId: null
    });
    setRole('citizen');
    setActiveTab('report');
    setCurrentDemoStep(3);
  };

  // Trigger AI vision scanning with real API call + deterministic fallback
  const triggerAiScan = async (customPreset = null) => {
    const preset = customPreset || wizardState.selectedPreset;
    const imageToAnalyze = wizardState.uploadedImage || preset.imageUrl;

    setWizardState(prev => ({
      ...prev,
      step: 2,
      isScanning: true,
      scanProgress: 20,
      selectedPreset: preset,
      uploadedImage: imageToAnalyze
    }));
    setCurrentDemoStep(5);

    const progressInterval = setInterval(() => {
      setWizardState(prev => {
        if (prev.scanProgress < 85) {
          return { ...prev, scanProgress: prev.scanProgress + 20 };
        }
        return prev;
      });
    }, 300);

    const analysisData = await analyzeInfrastructurePhoto(imageToAnalyze, preset, preset.category);

    clearInterval(progressInterval);

    setWizardState(prev => ({
      ...prev,
      scanProgress: 100,
      isScanning: false,
      scanResult: analysisData,
      customTitle: analysisData.title || preset.title,
      customDescription: analysisData.description || preset.description,
      similarReports: reports.filter(r => r.hotspotId === preset.targetHotspotId || r.category === analysisData.category).slice(0, 3),
      step: 3
    }));
  };

  const submitCitizenReport = (mergeWithExisting = false) => {
    const preset = wizardState.selectedPreset;
    const analysis = wizardState.scanResult || preset.aiAnalysis;
    const reportId = `CL-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReport = {
      id: reportId,
      citizenName: "Sarah Lin (You)",
      citizenPhone: "(555) 234-8891",
      category: analysis.category || preset.category,
      department: analysis.department || preset.department,
      title: wizardState.customTitle || analysis.title || preset.title,
      description: wizardState.customDescription || analysis.description || preset.description,
      locationName: wizardState.customLocation || preset.locationName,
      coordinates: preset.coordinates,
      imageUrl: wizardState.uploadedImage || preset.imageUrl,
      repairImageUrl: SAMPLE_INFRASTRUCTURE_IMAGES.pothole_repaired,
      status: "Detected",
      severity: analysis.severity || preset.severity,
      confidence: analysis.confidence || preset.confidence || 0.98,
      submittedAt: new Date().toISOString(),
      hotspotId: preset.targetHotspotId,
      upvotes: 1,
      timeline: [
        {
          step: "Detected",
          timestamp: new Date().toISOString(),
          description: `Report registered with CivicLens AI analysis (${analysis.defectType}).`
        }
      ]
    };

    // Update local state and Firestore
    setReports(prev => [newReport, ...prev]);
    syncReportToFirestore(newReport);

    setHotspots(prev => {
      return prev.map(hs => {
        if (hs.id === preset.targetHotspotId) {
          const updatedReportIds = Array.from(new Set([...hs.reportIds, reportId]));
          const newSeverityScore = Math.min(99, hs.severityScore + 3);
          const updatedHotspot = {
            ...hs,
            reportIds: updatedReportIds,
            reportCount: updatedReportIds.length,
            severityScore: newSeverityScore,
            confidenceScore: 0.99,
            activityLog: [
              {
                timestamp: new Date().toISOString(),
                message: `Spatial engine clustered new Report #${reportId} (${newReport.title}). Hotspot Severity Index adjusted to ${newSeverityScore}/100.`
              },
              ...hs.activityLog
            ]
          };
          syncHotspotToFirestore(updatedHotspot);
          return updatedHotspot;
        }
        return hs;
      });
    });

    setWizardState(prev => ({
      ...prev,
      step: 5,
      submittedReportId: reportId
    }));

    setCurrentDemoStep(7);

    addNotification(
      "Report Submitted Successfully",
      `Ticket #${reportId} registered. AI clustered your report into Hotspot ${preset.targetHotspotId}.`,
      "success"
    );
  };

  const approveActionPlan = (hotspotId, assignedCrewId = "CREW-03") => {
    const assignedCrew = crews.find(c => c.id === assignedCrewId) || crews[0];

    setHotspots(prev => prev.map(hs => {
      if (hs.id === hotspotId) {
        const updated = {
          ...hs,
          status: "Assigned",
          assignedCrewId: assignedCrewId,
          activityLog: [
            {
              timestamp: new Date().toISOString(),
              message: `Operator approved AI Action Plan #IR-402. Dispatched ${assignedCrew.name} (${assignedCrew.lead}).`
            },
            ...hs.activityLog
          ]
        };
        syncHotspotToFirestore(updated);
        return updated;
      }
      return hs;
    }));

    setReports(prev => prev.map(r => {
      if (r.hotspotId === hotspotId) {
        const updated = {
          ...r,
          status: "Assigned",
          assignedCrewId: assignedCrewId,
          timeline: [
            ...r.timeline,
            {
              step: "Assigned",
              timestamp: new Date().toISOString(),
              description: `Action plan approved by Municipal Operator. Dispatched ${assignedCrew.name}.`
            }
          ]
        };
        syncReportToFirestore(updated);
        return updated;
      }
      return r;
    }));

    setCrews(prev => prev.map(c => {
      if (c.id === assignedCrewId) {
        return { ...c, status: "Dispatched", activeHotspotId: hotspotId };
      }
      return c;
    }));

    setCurrentDemoStep(15);

    addNotification(
      "Action Plan Approved & Crew Dispatched",
      `Work Order created for ${assignedCrew.name}. Assigned to Hotspot ${hotspotId}.`,
      "success"
    );
  };

  const advanceHotspotLifecycle = (hotspotId, nextStatus) => {
    setHotspots(prev => prev.map(hs => {
      if (hs.id === hotspotId) {
        const updated = {
          ...hs,
          status: nextStatus,
          resolvedAt: nextStatus === 'Resolved' ? new Date().toISOString() : hs.resolvedAt,
          activityLog: [
            {
              timestamp: new Date().toISOString(),
              message: `Crew status updated to [${nextStatus.toUpperCase()}]. Subsurface hydraulic seal and asphalt patch completed.`
            },
            ...hs.activityLog
          ]
        };
        syncHotspotToFirestore(updated);
        return updated;
      }
      return hs;
    }));

    setReports(prev => prev.map(r => {
      if (r.hotspotId === hotspotId) {
        const updated = {
          ...r,
          status: nextStatus,
          resolvedAt: nextStatus === 'Resolved' ? new Date().toISOString() : r.resolvedAt,
          timeline: [
            ...r.timeline,
            {
              step: nextStatus,
              timestamp: new Date().toISOString(),
              description: nextStatus === 'In Progress' 
                ? "Public works crew on site. Sub-base hydro-excavation underway."
                : "Repair completed. Fresh asphalt compactor seal applied. Ready for citizen verification."
            }
          ]
        };
        syncReportToFirestore(updated);
        return updated;
      }
      return r;
    }));

    if (nextStatus === 'Resolved') {
      setCurrentDemoStep(17);
      addNotification(
        "Infrastructure Repair Completed",
        "Public Works Crew #3 completed Elm St repairs. Verification request sent to citizen.",
        "success",
        {
          label: "Verify Repair",
          action: () => openVerificationModal(reports.find(r => r.hotspotId === hotspotId) || reports[0])
        }
      );
    } else {
      setCurrentDemoStep(16);
      addNotification("Crew Status Updated", `Hotspot ${hotspotId} is now ${nextStatus}.`, "info");
    }
  };

  const openVerificationModal = (report) => {
    setActiveVerificationTicket(report);
    setCurrentDemoStep(18);
  };

  const verifyResolution = (reportId, userNotes = "") => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti effect triggered');
    }

    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        const updated = {
          ...r,
          status: "Verified",
          verifiedAt: new Date().toISOString(),
          timeline: [
            ...r.timeline,
            {
              step: "Verified",
              timestamp: new Date().toISOString(),
              description: `Citizen verified repair quality. Ticket closed with verified badge.`
            }
          ]
        };
        syncReportToFirestore(updated);
        return updated;
      }
      return r;
    }));

    const targetReport = reports.find(r => r.id === reportId);
    if (targetReport && targetReport.hotspotId) {
      setHotspots(prev => prev.map(hs => {
        if (hs.id === targetReport.hotspotId) {
          const updated = {
            ...hs,
            status: "Verified",
            activityLog: [
              {
                timestamp: new Date().toISOString(),
                message: `Citizen verified resolution for Report #${reportId}. Hotspot marked as VERIFIED.`
              },
              ...hs.activityLog
            ]
          };
          syncHotspotToFirestore(updated);
          return updated;
        }
        return hs;
      }));
    }

    setKarmaPoints(prev => prev + 50);
    setActiveVerificationTicket(null);
    setCurrentDemoStep(20);

    addNotification(
      "Resolution Verified! +50 Civic Karma",
      `Ticket #${reportId} has been verified and permanently recorded in the municipal ledger.`,
      "success"
    );
  };

  const resetDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_reports`);
    localStorage.removeItem(`${STORAGE_KEY}_hotspots`);
    localStorage.removeItem(`${STORAGE_KEY}_crews`);
    localStorage.removeItem(`${STORAGE_KEY}_karma`);

    setReports(INITIAL_REPORTS);
    setHotspots(INITIAL_HOTSPOTS);
    setCrews(INITIAL_CREWS);
    setKarmaPoints(150);
    setSelectedHotspotId('HS-402');
    setSelectedReportId(null);
    setCurrentDemoStep(1);
    setActiveVerificationTicket(null);
    setRole('citizen');
    setActiveTab('home');

    // Also reset Firestore if active
    if (isFirebaseConfigured) {
      resetFirestoreCollections(INITIAL_REPORTS, INITIAL_HOTSPOTS);
    }

    setWizardState({
      step: 1,
      selectedPreset: AI_SCAN_PRESETS[0],
      uploadedImage: AI_SCAN_PRESETS[0].imageUrl,
      isScanning: false,
      scanProgress: 0,
      scanResult: null,
      similarReports: [],
      customTitle: '',
      customDescription: '',
      customLocation: '',
      submittedReportId: null
    });

    addNotification("Demo Reset Complete", "All municipal data reset to pristine demo baseline.", "info");
  };

  const jumpToDemoStep = (stepNumber) => {
    const stepDef = DEMO_STEPS.find(s => s.step === stepNumber);
    if (!stepDef) return;

    setCurrentDemoStep(stepNumber);
    setRole(stepDef.role === 'system' ? 'operator' : stepDef.role);

    if (stepNumber === 1) {
      navigateTab('home');
    } else if (stepNumber === 2) {
      navigateTab('dashboard');
    } else if (stepNumber >= 3 && stepNumber <= 7) {
      navigateTab('report');
      if (stepNumber === 3) {
        setWizardState(prev => ({ ...prev, step: 1 }));
      } else if (stepNumber === 4) {
        setWizardState(prev => ({ ...prev, step: 1, uploadedImage: AI_SCAN_PRESETS[0].imageUrl }));
      } else if (stepNumber === 5) {
        triggerAiScan(AI_SCAN_PRESETS[0]);
      } else if (stepNumber === 6) {
        setWizardState(prev => ({ ...prev, step: 3, scanResult: AI_SCAN_PRESETS[0].aiAnalysis, similarReports: reports.filter(r => r.hotspotId === 'HS-402') }));
      } else if (stepNumber === 7) {
        submitCitizenReport();
      }
    } else if (stepNumber === 8 || stepNumber === 9 || stepNumber === 10) {
      navigateTab('hotspots');
    } else if (stepNumber >= 11 && stepNumber <= 16) {
      setSelectedHotspotId('HS-402');
      navigateTab('hotspot-detail', { hotspotId: 'HS-402' });
      if (stepNumber === 14 || stepNumber === 15) {
        approveActionPlan('HS-402', 'CREW-03');
      } else if (stepNumber === 16) {
        advanceHotspotLifecycle('HS-402', 'In Progress');
      }
    } else if (stepNumber === 17) {
      advanceHotspotLifecycle('HS-402', 'Resolved');
      setRole('citizen');
      navigateTab('dashboard');
    } else if (stepNumber === 18 || stepNumber === 19) {
      const rep = reports.find(r => r.id === 'CL-8821') || reports[0];
      openVerificationModal(rep);
    } else if (stepNumber === 20) {
      const rep = reports.find(r => r.id === 'CL-8821') || reports[0];
      verifyResolution(rep.id);
      setRole('citizen');
      navigateTab('dashboard');
    }
  };

  return (
    <CivicLensContext.Provider
      value={{
        role,
        switchRole,
        activeTab,
        navigateTab,
        reports,
        hotspots,
        crews,
        karmaPoints,
        selectedHotspotId,
        setSelectedHotspotId,
        selectedReportId,
        setSelectedReportId,
        currentDemoStep,
        setCurrentDemoStep,
        notifications,
        addNotification,
        removeNotification,
        wizardState,
        setWizardState,
        startReportWizard,
        triggerAiScan,
        submitCitizenReport,
        approveActionPlan,
        advanceHotspotLifecycle,
        activeVerificationTicket,
        openVerificationModal,
        closeVerificationModal: () => setActiveVerificationTicket(null),
        verifyResolution,
        resetDemoData,
        jumpToDemoStep,
        isFirebaseConfigured
      }}
    >
      {children}
    </CivicLensContext.Provider>
  );
};

export const useCivicLens = () => {
  const context = useContext(CivicLensContext);
  if (!context) {
    throw new Error('useCivicLens must be used within a CivicLensProvider');
  }
  return context;
};
