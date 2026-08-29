# CivicLens: AI-Powered Civic Infrastructure Intelligence Platform

> Transforming resident observation into coordinated municipal action through multimodal AI vision analysis, spatial hotspot clustering, root-cause intelligence, and photographic before/after verification.

---

## 🔍 System Capabilities & Implementation Architecture

To ensure total transparency, the platform architecture clearly separates real AI capabilities from deterministic municipal systems:

| Layer | Implementation Type | Description & Exact Technologies |
| :--- | :--- | :--- |
| **Defect Vision Diagnostics** | **Real AI Inference** | Multimodal image classification using **Google Gemini 2.5 Flash** (via OpenRouter gateway) or **Gemini 1.5 Flash** (direct API) via server-side boundary `POST /api/analyze-image`. Returns structured JSON (`defectType`, `severity`, `urgencyScore`, `department`, `reasoning`). |
| **Physical Measurements** | **Visual Approximations** | Labeled explicitly as *"Visual approximations from photo only. Physical dimensions require on-site calibration."* (No false claims of hardware laser depth sensors). |
| **Spatial Deduplication** | **Deterministic Logic** | 150-meter Euclidean proximity clustering detecting duplicate resident reports. |
| **Hotspot Clustering & SLA** | **Deterministic Logic** | Mathematical aggregation into municipal hotspot clusters (`#HS-402`) with dynamic Hotspot Severity Index (HSI) and SLA countdown timers. |
| **Remediation Action Plan** | **Deterministic Templates** | Structured 4-phase public works protocol with standard municipal cost and duration modeling. |
| **Resolution Verification** | **Deterministic & Interactive** | Interactive split-diff before/after visual slider with audit compliance checks. |
| **Cloud Persistence** | **Firebase Firestore** | Dual-mode real-time persistence with `onSnapshot` subscriptions across `civiclens_reports` and `civiclens_hotspots`. |
| **Offline Mode** | **LocalStorage Backing** | 100% functional fallback if Firebase keys are absent or network is unavailable. |

---

## 🏗️ Technical Architecture

```
 ┌────────────────────────────────────────────────────────┐
 │                      CITIZEN PORTAL                    │
 │  • Google Stitch UI Design  • 5-Step Report Wizard     │
 └───────────────────────────┬────────────────────────────┘
                             │
                  [ Upload Defect Photo ]
                             │
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │          SERVER-SIDE AI VISION BOUNDARY (/api)         │
 │  • Zero Client Secret Leaks                            │
 │  • Router: AI_PROVIDER=auto | openrouter | gemini      │
 │  • Active Model: google/gemini-2.5-flash / 1.5-flash   │
 │  • Instant Deterministic Fallback Engine               │
 └───────────────────────────┬────────────────────────────┘
                             │
                  [ Clustered Spatial Sync ]
                             │
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │          PERSISTENCE & SYSTEM INTELLIGENCE             │
 │  • Cloud Mode: Firebase Firestore (onSnapshot)         │
 │  • Offline Mode: LocalStorage Backing Store            │
 │  • Deterministic Spatial Clustering & HSI SLA Engine   │
 └───────────────────────────┬────────────────────────────┘
                             │
                  [ Real-Time Dispatch Event ]
                             │
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │             OPERATOR COMMAND CENTER                    │
 │  • Hotspot Queue Table  • Failure Mechanism Synthesis   │
 │  • 4-Phase Action Plan  • Crew Dispatch & Tracking     │
 └───────────────────────────┬────────────────────────────┘
                             │
                  [ Repair Complete + Photo Proof ]
                             │
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │            BEFORE / AFTER CITIZEN AUDIT                │
 │  • Interactive Visual Diff Split Slider                │
 │  • AI Quality Compliance Audit (99.2%)                 │
 │  • Ticket Marked VERIFIED & Civic Karma Awarded        │
 └────────────────────────────────────────────────────────┘
```

---

## 🔄 The 20-Step Closed-Loop Demo Lifecycle

| Phase | Steps | Milestone Description |
| :--- | :--- | :--- |
| **Citizen Intake** | `1 – 7` | **1.** Landing page → **2.** Citizen Dashboard → **3.** Report Wizard → **4.** Photo Selection → **5.** AI Vision Scan → **6.** Duplicate Detection → **7.** Submit Report. |
| **System Intelligence** | `8 – 9` | **8.** Auto-clustered into **Hotspot #HS-402** → **9.** Dynamic HSI calculated to `94/100 (Critical)` with 6-hr SLA. |
| **Operator Intelligence** | `10 – 15` | **10.** Hotspots queue → **11.** Deep Dive on #HS-402 → **12.** AI Root Cause (Pressurized Water Main Washout) → **13.** 4-Phase Action Plan ($3,850 / 5.5 hrs) → **14.** Operator Approval → **15.** Rapid Response Crew #3 Dispatched. |
| **Resolution & Verification** | `16 – 20` | **16.** Lifecycle progression (`Assigned` → `In Progress` → `Resolved` with photo) → **17.** Citizen Push Notification → **18.** Interactive Before/After Visual Diff Slider → **19.** AI Quality Audit (99.2% compliance) → **20.** Ticket stamped **VERIFIED** (+50 Karma). |

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- **Node.js** v18+ (tested on Node.js v20, v22, v24)
- **npm** v9+

### 2. Installation
```bash
git clone https://github.com/your-username/civiclens.git
cd civiclens
npm install
```

### 3. Configure Environment Variables
Copy the example environment template:
```bash
cp .env.example .env
```

Edit `.env` to configure your AI providers and Firebase (optional):
```ini
# AI Provider ('auto' | 'openrouter' | 'gemini')
AI_PROVIDER=auto

# OpenRouter API Key (Server-side only)
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_MODEL=google/gemini-2.5-flash

# Optional Direct Gemini Key (Server-side only)
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash

# Optional Firebase Client Configuration (Safe for browser)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_PROJECT_ID=
```

### 4. Run Development Server
```bash
npm run dev
```
Open **http://localhost:5173** in your browser.

### 5. Run Production Server
```bash
npm run build
npm start
```
Open **http://localhost:3000** in your browser.

---

## 🔒 Security & Secret Isolation

- **Zero Client-Side Key Exposure**: AI keys are loaded strictly on the server and never prefixed with `VITE_`.
- **Verified Bundle Sanitization**: Production bundles in `dist/` contain zero API keys or server tokens.
- **Git Ignore Protection**: `.env`, `.env.*`, `service-account*.json`, and build artifacts are strictly ignored by `.gitignore`.

---

## 🛠️ Built With

- **Frontend**: React 18, Vite 6, Tailwind CSS, Canvas Confetti, Lucide React
- **Design System**: Google Stitch Specification, IBM Plex Sans, Material Symbols Outlined
- **AI Vision Engine**: Google Gemini 2.5 Flash (`google/gemini-2.5-flash`), OpenRouter Gateway, Google Generative Language API
- **Cloud Database**: Firebase Firestore (Modular SDK v12)
- **Production Server**: Node.js Standard HTTP Server (Zero external server dependencies)

---

## 📄 License
MIT License. Built for the Google Hackathon.
