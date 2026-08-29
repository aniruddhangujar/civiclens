---
name: CivicLens
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#424656'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#737687'
  outline-variant: '#c3c6d8'
  surface-tint: '#0052dd'
  primary: '#004ccd'
  on-primary: '#ffffff'
  primary-container: '#0f62fe'
  on-primary-container: '#f3f3ff'
  inverse-primary: '#b4c5ff'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e1dfdf'
  on-secondary-container: '#626263'
  tertiary: '#9e3100'
  on-tertiary: '#ffffff'
  tertiary-container: '#c84000'
  on-tertiary-container: '#fff1ed'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174c'
  on-primary-fixed-variant: '#003da9'
  secondary-fixed: '#e4e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#ffb59d'
  on-tertiary-fixed: '#390c00'
  on-tertiary-fixed-variant: '#832700'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  critical-red: '#da1e28'
  high-warning-orange: '#ff832b'
  medium-caution-yellow: '#f1c21b'
  success-green: '#24a148'
  border-subtle: '#e0e0e0'
  surface-operator: '#f2f4f8'
typography:
  headline-xl:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: IBM Plex Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
  headline-lg-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

This design system is engineered for a high-fidelity civic-tech AI platform, bridging the gap between municipal reliability and modern SaaS agility. The brand personality is **Systematic, Credible, and Insightful**. It rejects the dated aesthetic of traditional government portals in favor of a crisp, "AI-first" interface that feels both powerful and approachable.

The design style is **Corporate Modern with a Soft Edge**. It utilizes the structural integrity of the Carbon design system but introduces softer shapes and tonal layering to reduce cognitive load. The goal is to provide "Productive Clarity"—a high-information-density environment that remains visually calm and intuitive for both citizens and municipal operators.

## Colors

The palette is anchored by a deep professional blue, signaling trust and systemic authority. 

- **Primary Blue:** Used for high-intent actions, active states, and navigation highlights.
- **Semantic Accents:** Critical Red, High Warning Orange, and Medium Caution Yellow are reserved strictly for data status and AI-driven alerts. Success Green confirms successful operations.
- **Neutral Hierarchy:** A range of grays from `#ffffff` (Page Background) to `#161616` (Primary Text) defines the UI. 
- **Operator Surface:** Municipal operator views may utilize a slightly cooler neutral tint (`#f2f4f8`) to differentiate the high-density dashboard from the standard citizen view.

## Typography

This design system relies exclusively on **IBM Plex Sans** to convey technical precision and human-centric readability. 

- **Hierarchy through Weight:** Use SemiBold (600) for headlines and Medium (500) for labels. Regular (400) is reserved for body copy and data entry.
- **Scaling:** Headsets scale down on mobile to maintain readability without excessive scrolling. 
- **Data Readability:** For numerical data tables, ensure tabular lining figures are enabled to maintain vertical alignment.
- **Accessibility:** All body text must maintain a minimum 4.5:1 contrast ratio against its background.

## Layout & Spacing

The layout is built on a **12-column fluid grid** for desktop and a **4-column grid** for mobile.

- **Rhythm:** An 8px base unit governs all dimensions.
- **Density Tiers:** 
    - **Citizen View:** Uses `lg` (24px) and `xl` (32px) padding to create a spacious, welcoming feel.
    - **Operator View:** Uses `sm` (8px) and `md` (16px) padding to maximize information density for data-heavy monitoring tasks.
- **Consistency:** Elements should align to the grid gutters. Vertical spacing between logical sections should default to 32px or 48px to clearly define information blocks.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Subtle Shadows** rather than heavy skeuomorphism.

- **The Surface System:** The main background is white. Secondary containers (like sidebars or card wells) use `#f4f4f4`. 
- **Borders:** A 1px subtle border (`#e0e0e0`) is the primary method for defining card boundaries and input fields, ensuring clarity without adding visual weight.
- **Shadows:** Use only for transient elements (modals, dropdowns) or to elevate a primary card. 
    - **Standard Shadow:** `0 2px 6px rgba(0,0,0,0.08)`
    - **Elevated Shadow:** `0 4px 12px rgba(0,0,0,0.12)`
- **AI Insights:** Elements generated by AI can use a very subtle tinted background or a soft glow to differentiate them from static system data.

## Shapes

The shape language is **Rounded**, moving away from Carbon’s default sharp corners to create a more modern, approachable SaaS feel.

- **Cards & Containers:** Use a consistent 8px (`rounded-md`) radius.
- **Buttons & Inputs:** Use 4px or 8px depending on the component's prominence.
- **Interactive Elements:** Use 8px to ensure they look "clickable" and distinct from structural layout boxes.
- **Status Badges:** Use fully rounded (pill-shaped) geometry to differentiate them from buttons.

## Components

- **Buttons:** Primary buttons use a solid `#0f62fe` fill with white text. Secondary buttons use a 1px border. All buttons have an 8px corner radius.
- **Cards:** White background, 1px `#e0e0e0` border, and 8px corner radius. Use 16px internal padding for standard views and 24px for citizen-facing content.
- **Status Badges:** Compact labels with high-contrast text and a low-opacity background tint derived from the semantic colors (e.g., Success Green background at 15% opacity).
- **Input Fields:** 40px height for operators, 48px for citizens. Background is `#f4f4f4` with a 1px bottom border that transforms into a full 1px outline on focus.
- **Data Tables:** Clean rows with 1px bottom borders. No zebra striping; instead, use a hover state highlight of `#f2f4f8`.
- **AI "Lens" Component:** A specialized card variant with a subtle indigo border or "sparkle" icon to denote AI-generated insights or summaries.