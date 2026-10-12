# ITZ FIZZ — The Race Experience 🏍️

A premium scroll-driven motorcycle racing experience built with **Next.js**, **GSAP ScrollTrigger**, and **Tailwind CSS**.

[![Deploy](https://github.com/YOUR_USERNAME/itz-fizz-racing/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/itz-fizz-racing/actions/workflows/deploy.yml)

---

## 🌐 Live Demo

> **[https://YOUR_USERNAME.github.io/itz-fizz-racing/](https://YOUR_USERNAME.github.io/itz-fizz-racing/)**

---

## ✨ Features

- **Scroll-driven racing** — the bike follows an SVG racing circuit in direct sync with scroll progress
- **Cinematic entrance animation** — staggered character reveal, bike fade-in, stat counters
- **Three checkpoints** — activate as the bike passes each marker on the track
- **Finish-line celebration** — RACE WON state with checkered flags at scroll completion
- **Fully reversible** — scroll back up and the bike retreats, checkpoints deactivate
- **Responsive** — works on desktop, tablet, and mobile
- **Reduced-motion support** — static fallback for `prefers-reduced-motion` users

---

## 🏁 Racing Line Implementation

The circuit is drawn as a single SVG `<path>` element using cubic Bézier curves (viewBox 800×500). The path traces a flowing S-curve circuit from the starting grid through three checkpoint zones to the finish line.

### Bike Path Following

- **`path.getTotalLength()`** — gets total path length on mount
- **`path.getPointAtLength(progress * totalLength)`** — returns `{x, y}` at any scroll fraction
- **Tangent angle** — computed from two points `±3px` along the path via `Math.atan2`, clamped to ±30°
- **SVG→screen coordinate conversion** — `svgEl.getBoundingClientRect()` converts viewBox coordinates to actual screen pixels accounting for responsive scaling
- **`gsap.set(bike, { x, y, rotation })`** — applied inside a `ScrollTrigger.onUpdate` callback with `scrub: 1.5` for smooth lag

### Racing Line Draw

- `strokeDasharray = pathLength` + `strokeDashoffset = pathLength * (1 - progress)` creates the drawing effect
- Updated via `gsap.set()` on every scroll tick

### ScrollTrigger Configuration

```js
ScrollTrigger.create({
  trigger: section,
  start: "top top",
  end: "bottom bottom",
  scrub: 1.5,         // lag factor for smooth trailing
  onUpdate: (self) => { /* bike position, line draw, checkpoints */ }
});
```

---

## 📊 Impact Statistics

| Stat | Value | Description |
|------|-------|-------------|
| 1 | **58%** | Increase in pick up point use |
| 2 | **23%** | Decreased in customer phone calls |
| 3 | **27%** | Increase in pick up point use |
| 4 | **40%** | Decreased in customer phone calls |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/itz-fizz-racing.git
cd itz-fizz-racing

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
# Static output generated in ./out/
```

---

## 📁 Project Structure

```
itz-fizz-racing/
├── public/
│   ├── images/
│   │   └── racing-bike.jpg        # Racing superbike asset
│   └── icons/
│       └── checkered-flag.svg     # Finish line flag
├── src/
│   ├── app/
│   │   ├── globals.css            # Design system & animations
│   │   ├── layout.jsx             # Root layout + SEO metadata
│   │   └── page.jsx               # Main page + GSAP animation logic
│   └── components/
│       ├── RacingHero.jsx         # Full-screen racing canvas
│       ├── ImpactStats.jsx        # Four required statistics
│       ├── RacingTrack.jsx        # SVG circuit with racing line
│       ├── RacingBike.jsx         # Scroll-driven motorcycle
│       └── FinishOverlay.jsx      # RACE WON celebration state
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Pages deployment
├── next.config.mjs                # Static export config
└── package.json
```

---

## 🚢 Deployment

### GitHub Pages Setup

1. Push the repository to GitHub
2. Go to **Settings → Pages → Source → GitHub Actions**
3. Push to `main` branch — the workflow automatically builds and deploys

The `next.config.mjs` is pre-configured with:
- `output: "export"` — static HTML/CSS/JS export
- `basePath: "/itz-fizz-racing"` — correct asset paths for project URL
- `images: { unoptimized: true }` — compatible with static export

---

## 🛠 Technology Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework + static export |
| React 19 | UI component library |
| Tailwind CSS | Utility-first styling |
| GSAP 3 | Animation engine |
| GSAP ScrollTrigger | Scroll-driven animation |
| GitHub Actions | CI/CD pipeline |
| GitHub Pages | Static hosting |

---

## 🎨 Design System

- **Background:** `#0a0a0b` (near-black charcoal)
- **Accent:** `#e8102a` (electric red)
- **Typography:** Orbitron (display), Inter (body)
- **Aesthetic:** Dark motorsport — cinematic, editorial, premium

---

*Reference: [paraschaturvedi.github.io/car-scroll-animation](https://paraschaturvedi.github.io/car-scroll-animation/)*
