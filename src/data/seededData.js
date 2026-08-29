// High-fidelity seeded data for CivicLens Hackathon Prototype
// Contains realistic municipal reports, hotspots, AI vision analysis models, crews, and before/after verification photos.

export const SAMPLE_INFRASTRUCTURE_IMAGES = {
  pothole_water: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
  pothole_repaired: "https://images.unsplash.com/photo-1578874691223-a492623d2c7f?auto=format&fit=crop&w=800&q=80",
  traffic_signal: "https://images.unsplash.com/photo-1508873696983-2df5703bc222?auto=format&fit=crop&w=800&q=80",
  traffic_signal_fixed: "https://images.unsplash.com/photo-1565576238874-555139046c87?auto=format&fit=crop&w=800&q=80",
  storm_drain: "https://images.unsplash.com/photo-1527489377706-5bf97e608852?auto=format&fit=crop&w=800&q=80",
  storm_drain_fixed: "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80",
  fallen_tree: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
  fallen_tree_fixed: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
};

// SVG Fallback graphics if offline or network failure
export const SVG_FALLBACKS = {
  pothole: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'><rect width='800' height='500' fill='%23333842'/><path d='M220 280 C300 240, 480 250, 560 300 C600 350, 500 420, 380 410 C260 400, 180 340, 220 280 Z' fill='%231b1d22' stroke='%23da1e28' stroke-width='4'/><ellipse cx='370' cy='330' rx='90' ry='40' fill='%230f62fe' opacity='0.75'/><text x='400' y='80' font-family='Arial' font-size='24' font-weight='bold' fill='%23ffffff' text-anchor='middle'>INFRASTRUCTURE DEFECT: SEVERE ROAD BED COLLAPSE</text><text x='400' y='120' font-family='Arial' font-size='16' fill='%23ff832b' text-anchor='middle'>Elm St &amp; 5th Ave - Dept of Transportation</text></svg>",
  pothole_fixed: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'><rect width='800' height='500' fill='%23282c34'/><path d='M200 270 C320 250, 480 250, 580 280 C600 340, 520 410, 380 410 C250 410, 180 340, 200 270 Z' fill='%231e2126' stroke='%2324a148' stroke-width='4'/><path d='M100 350 L700 350' stroke='%23f1c21b' stroke-width='8' stroke-dasharray='30 20'/><circle cx='400' cy='250' r='50' fill='%2324a148' opacity='0.2'/><text x='400' y='80' font-family='Arial' font-size='24' font-weight='bold' fill='%2324a148' text-anchor='middle'>RESOLUTION COMPLETED: FRESH ASPHALT SEAL</text><text x='400' y='120' font-family='Arial' font-size='16' fill='%23ffffff' text-anchor='middle'>Public Works Crew %233 Dispatch Verified</text></svg>"
};

export const AI_SCAN_PRESETS = [
  {
    id: "preset-pothole-water",
    name: "Severe Pothole & Water Leak (Main Demo)",
    category: "Roadways & Pavement",
    department: "Public Works & Transportation",
    title: "Deep Pothole with Active Subsurface Water Flow",
    description: "Rapidly expanding pothole (approx 1.2m wide, 18cm deep) with water bubbling up from subterranean fracture. Vehicles actively swerving into oncoming lane.",
    locationName: "Elm St & 5th Ave (Ward 4 - Metro West)",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    imageUrl: SAMPLE_INFRASTRUCTURE_IMAGES.pothole_water,
    severity: "Critical",
    confidence: 0.984,
    aiAnalysis: {
      defectType: "Pavement Structural Void (Class 3)",
      depthEstimate: "18 cm",
      surfaceArea: "1.4 sq. meters",
      hazardLevel: "Critical - High Collision / Suspension Damage Risk",
      secondaryDefect: "Subsurface Pipe Hydraulic Pressure Anomaly",
      urgencyScore: 94,
      suggestedAction: "Immediate emergency traffic coning + multi-agency dispatch (Water Works & Pavement Crew)",
      boundingBoxes: [
        { label: "Void Fracture (18cm)", top: "34%", left: "28%", width: "44%", height: "42%", color: "#da1e28" },
        { label: "Water Inundation Zone", top: "45%", left: "35%", width: "28%", height: "26%", color: "#0f62fe" }
      ],
      aiTags: ["Structural Void", "Hydro-erosion", "Active Flow", "Multi-Lane Risk", "School Zone Proximity"]
    },
    similarReportsCount: 3,
    targetHotspotId: "HS-402"
  },
  {
    id: "preset-traffic-signal",
    name: "Traffic Signal Junction Blackout",
    category: "Electrical & Signals",
    department: "Traffic Operations & Electrical",
    title: "4-Way Traffic Signal Array Out of Service",
    description: "Main intersection signals dark after power surge; pedestrian crossing buttons unresponsive and heavy morning congestion building.",
    locationName: "Oakridge Blvd & Commercial Way (Ward 2)",
    coordinates: { lat: 40.7180, lng: -74.0110 },
    imageUrl: SAMPLE_INFRASTRUCTURE_IMAGES.traffic_signal,
    severity: "High",
    confidence: 0.962,
    aiAnalysis: {
      defectType: "Signal Power Controller Relay Failure",
      depthEstimate: "N/A",
      surfaceArea: "Intersection Span (4 quadrants)",
      hazardLevel: "High - Intersection Gridlock & Pedestrian Safety",
      secondaryDefect: "Crosswalk Illumination Loss",
      urgencyScore: 86,
      suggestedAction: "Deploy mobile traffic management + Electrical Rapid Response #2",
      boundingBoxes: [
        { label: "Controller Housing Open", top: "25%", left: "40%", width: "22%", height: "35%", color: "#ff832b" }
      ],
      aiTags: ["Power Relay Outage", "Intersection Risk", "Signal Desynchronization"]
    },
    similarReportsCount: 2,
    targetHotspotId: "HS-319"
  },
  {
    id: "preset-storm-drain",
    name: "Storm Basin & Curb Inundation",
    category: "Stormwater & Drainage",
    department: "Sanitation & Drainage Bureau",
    title: "Storm Drain Basin Clogged by Debris Causing Flash Flooding",
    description: "Curb drain completely blocked by leaves and construction silt, rainwater pooling onto sidewalk and entrance of local grocery store.",
    locationName: "Pine St & Market Plaza (Ward 1)",
    coordinates: { lat: 40.7080, lng: -74.0020 },
    imageUrl: SAMPLE_INFRASTRUCTURE_IMAGES.storm_drain,
    severity: "Medium",
    confidence: 0.948,
    aiAnalysis: {
      defectType: "Drain Catchment Basin Blockage",
      depthEstimate: "12 cm standing runoff",
      surfaceArea: "6.0 sq. meters curb perimeter",
      hazardLevel: "Medium - Pedestrian Pathway Inundation",
      secondaryDefect: "Algae / Slip Hazard",
      urgencyScore: 72,
      suggestedAction: "High-pressure vactor truck clearance + curb silt barrier",
      boundingBoxes: [
        { label: "Catchment Debris Clog", top: "40%", left: "30%", width: "40%", height: "35%", color: "#f1c21b" }
      ],
      aiTags: ["Runoff Overflow", "Catchment Basin", "Sediment Accumulation"]
    },
    similarReportsCount: 1,
    targetHotspotId: "HS-105"
  }
];

export const INITIAL_REPORTS = [
  {
    id: "CL-8821",
    citizenName: "Marcus Vance",
    citizenPhone: "(555) 349-2910",
    category: "Roadways & Pavement",
    department: "Public Works & Transportation",
    title: "Pothole deepening near Elm St bus stop",
    description: "Bus #14 hit this pothole and rattled violently. Water is coming out of the hole even on a dry day.",
    locationName: "Elm St & 5th Ave (Northbound)",
    coordinates: { lat: 40.7126, lng: -74.0062 },
    imageUrl: SAMPLE_INFRASTRUCTURE_IMAGES.pothole_water,
    repairImageUrl: SAMPLE_INFRASTRUCTURE_IMAGES.pothole_repaired,
    status: "Detected", // Detected, Assigned, In Progress, Resolved, Verified
    severity: "Critical",
    confidence: 0.97,
    submittedAt: "2026-08-28T19:30:00Z",
    hotspotId: "HS-402",
    upvotes: 8,
    timeline: [
      { step: "Detected", timestamp: "2026-08-28T19:30:00Z", description: "Report submitted via CivicLens mobile app with AI Vision classification (Class 3 Void)." }
    ]
  },
  {
    id: "CL-8840",
    citizenName: "Priya Patel",
    citizenPhone: "(555) 882-1922",
    category: "Water & Utilities",
    department: "Water & Sewer Authority",
    title: "Water leaking under Elm street asphalt",
    description: "The road feels spongy and water is bubbling up through the cracks near the 5th Ave intersection.",
    locationName: "142 Elm St, near 5th Ave",
    coordinates: { lat: 40.7130, lng: -74.0058 },
    imageUrl: SAMPLE_INFRASTRUCTURE_IMAGES.pothole_water,
    repairImageUrl: SAMPLE_INFRASTRUCTURE_IMAGES.pothole_repaired,
    status: "Detected",
    severity: "Critical",
    confidence: 0.98,
    submittedAt: "2026-08-28T20:15:00Z",
    hotspotId: "HS-402",
    upvotes: 14,
    timeline: [
      { step: "Detected", timestamp: "2026-08-28T20:15:00Z", description: "AI detected 96% spatial-semantic correlation with Report #CL-8821." }
    ]
  },
  {
    id: "CL-8902",
    citizenName: "Elena Gomez",
    citizenPhone: "(555) 441-9032",
    category: "Electrical & Signals",
    department: "Traffic Operations & Electrical",
    title: "Flashing signal light at Oakridge Blvd",
    description: "Pedestrian crosswalk button doesn't trigger the walk sign. Cars are speeding through.",
    locationName: "Oakridge Blvd & 4th St",
    coordinates: { lat: 40.7182, lng: -74.0108 },
    imageUrl: SAMPLE_INFRASTRUCTURE_IMAGES.traffic_signal,
    repairImageUrl: SAMPLE_INFRASTRUCTURE_IMAGES.traffic_signal_fixed,
    status: "Assigned",
    severity: "High",
    confidence: 0.95,
    submittedAt: "2026-08-28T16:00:00Z",
    hotspotId: "HS-319",
    assignedCrewId: "CREW-02",
    upvotes: 5,
    timeline: [
      { step: "Detected", timestamp: "2026-08-28T16:00:00Z", description: "Report logged with high urgency rating." },
      { step: "Assigned", timestamp: "2026-08-28T17:15:00Z", description: "Assigned to Electrical Rapid Response #2." }
    ]
  },
  {
    id: "CL-7719",
    citizenName: "James Thornton",
    citizenPhone: "(555) 672-9011",
    category: "Parks & Urban Forestry",
    department: "Parks & Urban Forestry",
    title: "Large pine branch cleared from bike lane",
    description: "Branch fell during the storm, blocking the protected cycling track.",
    locationName: "Maple Ave & 8th St",
    coordinates: { lat: 40.7220, lng: -74.0150 },
    imageUrl: SAMPLE_INFRASTRUCTURE_IMAGES.fallen_tree,
    repairImageUrl: SAMPLE_INFRASTRUCTURE_IMAGES.fallen_tree_fixed,
    status: "Verified",
    severity: "Medium",
    confidence: 0.99,
    submittedAt: "2026-08-27T10:00:00Z",
    resolvedAt: "2026-08-27T14:30:00Z",
    verifiedAt: "2026-08-27T15:45:00Z",
    hotspotId: null,
    assignedCrewId: "CREW-04",
    upvotes: 22,
    timeline: [
      { step: "Detected", timestamp: "2026-08-27T10:00:00Z", description: "Issue detected via mobile submission." },
      { step: "Assigned", timestamp: "2026-08-27T10:45:00Z", description: "Dispatched Forestry Crew #4." },
      { step: "In Progress", timestamp: "2026-08-27T12:00:00Z", description: "Chipping and limb removal underway." },
      { step: "Resolved", timestamp: "2026-08-27T14:30:00Z", description: "Bike path fully cleared and swept." },
      { step: "Verified", timestamp: "2026-08-27T15:45:00Z", description: "Citizen James Thornton verified before/after evidence." }
    ]
  }
];

export const INITIAL_HOTSPOTS = [
  {
    id: "HS-402",
    code: "HOTSPOT-402",
    title: "Elm & 5th Ave Subsurface Hydraulic Erosion & Multi-Pothole Collapse",
    department: "Public Works & Water Bureau Joint Taskforce",
    locationName: "Elm St between 4th & 6th Ave (Ward 4)",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    radiusMeters: 140,
    severity: "Critical",
    severityScore: 94, // 0 - 100
    confidenceScore: 0.98,
    status: "Detected", // Detected, Assigned, In Progress, Resolved, Verified
    reportIds: ["CL-8821", "CL-8840"],
    reportCount: 2,
    firstDetected: "2026-08-28T19:30:00Z",
    slaHoursRemaining: 3.5,
    assignedCrewId: null,
    repairProofImageUrl: SAMPLE_INFRASTRUCTURE_IMAGES.pothole_repaired,
    aiExplanation: {
      summary: "CivicLens spatial clustering identified multiple correlated reports spanning 80 meters along Elm St.",
      rootCause: "Underlying pressurized water main fracture is actively washing out the sub-base aggregate beneath asphalt layer, accelerating pavement shear failure and forming deep potholes under bus transit loads.",
      riskProjection: "Without intervention within 6 hours, foundation collapse risk rises to 89%, with potential water shutoff impacting 450 residential units.",
      affectedSectors: ["Transit Route 14", "Metro West Residential", "Ward 4 Storm Outfall"]
    },
    actionPlan: {
      title: "Municipal Integrated Emergency Remediation Protocol #IR-402",
      phases: [
        {
          phase: 1,
          name: "Immediate Traffic & Safety Control",
          action: "Deploy safety coning, establish single-lane detour on Elm St, and reroute Bus Line 14.",
          duration: "30 mins",
          resources: "Traffic Safety Unit + 16 LED Barricades"
        },
        {
          phase: 2,
          name: "Utility Isolation & Hydro-Excavation",
          action: "Water Bureau crews isolate 12-inch cast iron distribution main and vacuum-excavate compromised sub-base.",
          duration: "2 hours",
          resources: "Hydro-Excavator Crew + Pressure Gauge Telemetry"
        },
        {
          phase: 3,
          name: "Sleeve Repair & Compaction Patch",
          action: "Install full-circle stainless repair clamp on 12-inch main, backfill with crushed stone, and apply hot-mix asphalt patch with 3-ton roller.",
          duration: "2.5 hours",
          resources: "Rapid Response Crew #3 + Hot Mix Roller"
        },
        {
          phase: 4,
          name: "CivicLens AI Verification & Reopening",
          action: "Post-repair drone/crew photographic scan, automated smoothness index verification, and reopen traffic.",
          duration: "30 mins",
          resources: "CivicLens AI Vision Audit Suite"
        }
      ],
      estimatedCost: "$3,850",
      estimatedDuration: "5.5 Hours",
      targetSLA: "6 Hours",
      recommendedCrewId: "CREW-03"
    },
    activityLog: [
      { timestamp: "2026-08-28T19:30:00Z", message: "Spatial engine clustered Report #CL-8821 (Pothole void)." },
      { timestamp: "2026-08-28T20:15:00Z", message: "Spatial engine correlated Report #CL-8840 (Water leak). Hotspot Severity escalated to CRITICAL (94/100)." },
      { timestamp: "2026-08-28T20:16:00Z", message: "AI Action Plan #IR-402 synthesized with root-cause analysis." }
    ]
  },
  {
    id: "HS-319",
    code: "HOTSPOT-319",
    title: "Oakridge Blvd Arterial Traffic Signal Desynchronization",
    department: "Traffic Operations & Electrical",
    locationName: "Oakridge Blvd Corridor (Ward 2)",
    coordinates: { lat: 40.7180, lng: -74.0110 },
    radiusMeters: 220,
    severity: "High",
    severityScore: 86,
    confidenceScore: 0.95,
    status: "Assigned",
    reportIds: ["CL-8902"],
    reportCount: 1,
    firstDetected: "2026-08-28T16:00:00Z",
    slaHoursRemaining: 5.0,
    assignedCrewId: "CREW-02",
    repairProofImageUrl: SAMPLE_INFRASTRUCTURE_IMAGES.traffic_signal_fixed,
    aiExplanation: {
      summary: "Signal cabinet telemetry dropped optical link following voltage fluctuation at 15:45.",
      rootCause: "Secondary surge suppressor trip in master cabinet 4B.",
      riskProjection: "Estimated PM rush hour queue expansion of +1.8 miles without reset.",
      affectedSectors: ["Arterial Commuter Corridor", "Pedestrian Crossing"]
    },
    actionPlan: {
      title: "Signal Controller Telemetry & Board Swap Protocol",
      phases: [
        { phase: 1, name: "Traffic Flow Manual Override", action: "Switch intersection to flashing amber/red safety cycle.", duration: "15 mins", resources: "Traffic Officer" },
        { phase: 2, name: "Optical Board Replacement", action: "Replace optical isolation transceiver board in Cabinet 4B.", duration: "45 mins", resources: "Electrical Rapid Response #2" }
      ],
      estimatedCost: "$1,200",
      estimatedDuration: "1.5 Hours",
      targetSLA: "4 Hours",
      recommendedCrewId: "CREW-02"
    },
    activityLog: [
      { timestamp: "2026-08-28T16:00:00Z", message: "Report #CL-8902 clustered into Hotspot HS-319." },
      { timestamp: "2026-08-28T17:15:00Z", message: "Action plan approved by Operator J. Mercer. Dispatched to Crew #2." }
    ]
  }
];

export const INITIAL_CREWS = [
  {
    id: "CREW-03",
    name: "Rapid Response Multi-Disciplinary #3",
    lead: "Mike Rodriguez (Lead Operator)",
    department: "Public Works & Water Bureau",
    status: "Available", // Available, Dispatched, On-Site, Completed
    vehicle: "Hydro-Excavator & Asphalt Patch Unit #12",
    location: "Ward 4 Depot (0.8 mi away)",
    contact: "(555) 910-4421",
    activeHotspotId: null
  },
  {
    id: "CREW-02",
    name: "Electrical & Traffic Signals Unit #2",
    lead: "Elena Rostova (Master Tech)",
    department: "Traffic Operations",
    status: "Dispatched",
    vehicle: "Bucket Truck & Telemetry Rig #7",
    location: "Oakridge Blvd & 4th (On-Route)",
    contact: "(555) 910-8833",
    activeHotspotId: "HS-319"
  },
  {
    id: "CREW-01",
    name: "Pavement & Roadbed Milling Crew #1",
    lead: "David Chang (Superintendent)",
    department: "Public Works",
    status: "Active on 8th Ave",
    vehicle: "Heavy Milling & Compactor Unit #4",
    location: "Ward 3 Sector",
    contact: "(555) 910-1199",
    activeHotspotId: null
  },
  {
    id: "CREW-04",
    name: "Forestry & Stormwater Response #4",
    lead: "Marcus Bell (Field Inspector)",
    department: "Parks & Urban Forestry",
    status: "Available",
    vehicle: "Wood Chipper & Crane Rig #9",
    location: "Central Yard",
    contact: "(555) 910-5577",
    activeHotspotId: null
  }
];

export const DEMO_STEPS = [
  { step: 1, title: "1. Landing Page", role: "citizen", tab: "home", desc: "Citizen opens CivicLens landing page with AI insights." },
  { step: 2, title: "2. Citizen Dashboard", role: "citizen", tab: "dashboard", desc: "Citizen reviews neighborhood status and recent civic reports." },
  { step: 3, title: "3. Report Issue Wizard", role: "citizen", tab: "report", desc: "Citizen opens the interactive infrastructure reporting tool." },
  { step: 4, title: "4. Upload Photo", role: "citizen", tab: "report", desc: "Citizen selects or snaps photo of Elm St road collapse & water leak." },
  { step: 5, title: "5. AI Vision Analysis", role: "citizen", tab: "report", desc: "CivicLens AI computer vision scans defect, detects bounding box & 98.4% severity." },
  { step: 6, title: "6. Similar Reports Detected", role: "citizen", tab: "report", desc: "AI detects nearby matching reports within 150m and suggests cluster merge." },
  { step: 7, title: "7. Citizen Submits Report", role: "citizen", tab: "report", desc: "Report #CL-9402 is submitted and confirmation token generated." },
  { step: 8, title: "8. Hotspot Clustering Engine", role: "system", tab: "hotspots", desc: "Spatial engine clusters new report into Hotspot #HS-402." },
  { step: 9, title: "9. Severity & Confidence Calc", role: "system", tab: "hotspots", desc: "Hotspot Severity Index calculates at 94/100 (Critical) with 98% confidence." },
  { step: 10, title: "10. Operator Opens Hotspots", role: "operator", tab: "hotspots", desc: "Municipal operator views telemetry command center and priority queue." },
  { step: 11, title: "11. Open Hotspot Deep Dive", role: "operator", tab: "hotspot-detail", desc: "Operator opens Hotspot #HS-402 for spatial investigation." },
  { step: 12, title: "12. AI Pattern Explanation", role: "operator", tab: "hotspot-detail", desc: "AI Root Cause analysis explains subsurface water pipe washout." },
  { step: 13, title: "13. AI Remediation Action Plan", role: "operator", tab: "hotspot-detail", desc: "AI synthesizes 4-phase remediation protocol with crew resource estimate." },
  { step: 14, title: "14. Operator Approves Plan", role: "operator", tab: "hotspot-detail", desc: "Operator approves Action Plan and triggers municipal work order." },
  { step: 15, title: "15. Assignment & Dispatch", role: "operator", tab: "hotspot-detail", desc: "Rapid Response Crew #3 is dispatched with hydro-excavator unit." },
  { step: 16, title: "16. Lifecycle Progression", role: "operator", tab: "hotspot-detail", desc: "Crew advances status: Assigned -> In Progress -> Resolved with repair proof." },
  { step: 17, title: "17. Citizen Receives Resolution", role: "citizen", tab: "dashboard", desc: "Citizen receives push notification that Elm St repair is ready for audit." },
  { step: 18, title: "18. Before & After Evidence", role: "citizen", tab: "verify", desc: "Citizen compares interactive before/after visual diff slider." },
  { step: 19, title: "19. AI Verification Audit", role: "citizen", tab: "verify", desc: "CivicLens AI verifies smooth asphalt index (99.2% compliance)." },
  { step: 20, title: "20. Issue Marked VERIFIED", role: "citizen", tab: "dashboard", desc: "Citizen clicks Verify. Ticket is stamped VERIFIED and +50 Karma awarded!" }
];
