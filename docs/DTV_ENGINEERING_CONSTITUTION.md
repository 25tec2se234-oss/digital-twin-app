# Digital Twin Verse — Engineering Constitution
**Document ID:** DTV-ENG-CONST-2026-v1  
**Authority:** Founding Technical & Product Leadership  

---

## 1. Non-Negotiable Core Directives

### 1.1 Zero Dummy Code Policy
* **No Placeholders:** Code shipped to production must never contain `href="#"`, `// TODO`, fake loading states without underlying state machine transitions, or mocked data where real dynamic state logic is expected.
* **Functional Logic:** Every button, link, toggle, input, and modal interaction must be backed by working event handlers, state updates, or validated navigation.

### 1.2 Performance & Web Vitals Target
* **Lighthouse Scores:** Must achieve >= 95 across Performance, Accessibility, Best Practices, and SEO.
* **Core Web Vitals:**
  * Largest Contentful Paint (LCP) < 1.8s
  * First Input Delay (FID) / Interaction to Next Paint (INP) < 50ms
  * Cumulative Layout Shift (CLS) = 0.00
* **Asset Optimization:** All critical CSS must be loaded efficiently; scripts must be defer/async loaded; SVG icons preferred over raster images.

### 1.3 Design System & Aesthetics
* **Design Philosophy:** Apple-level spatial grid & typography, Linear-level dark mode UI contrast, OpenAI-level minimal clarity, and Framer-quality micro-interactions.
* **Theme Support:** Dark mode primary with seamless Light mode CSS variable fallbacks.
* **Glassmorphism & Lighting:** 3D bevels, subtle radial cursor spotlights, hardware-accelerated (`transform: translateZ(0)`) backdrop blurs.

### 1.4 Technical SEO & Schema Blueprint
* **Semantic HTML:** Strict HTML5 tags (`<main>`, `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`).
* **Structured Data:** Valid JSON-LD scripts on every route defining `WebPage`, `BreadcrumbList`, `Organization`, and relevant domain schemas.
* **Social Meta:** High-resolution Open Graph (`og:title`, `og:image`, `og:url`) and Twitter Card specifications.

### 1.5 Accessibility (WCAG 2.1 AA)
* **Keyboard Nav:** Complete focus ring visualization (`:focus-visible`) and logical tabIndex sequencing.
* **Screen Readers:** Explicit ARIA labels (`aria-label`, `aria-expanded`, `aria-live`, `aria-hidden`) on all interactive controls.
* **Reduced Motion:** Respect `@media (prefers-reduced-motion: reduce)` by disabling non-essential transition sequences.

---

## 2. Technical Quality Assurance & Verification
1. **Console Sanitation:** Zero uncaught exceptions, zero console warnings, zero missing resource 404s.
2. **Regression Auditing:** Every new route deployment must maintain compatibility with navbar, footer, auth session locks, and responsive mobile layouts (320px to 4K).
