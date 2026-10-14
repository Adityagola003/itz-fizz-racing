# ITZ FIZZ — The Race Experience 🏍️

A premium scroll-driven motorcycle racing experience inspired by reference track animations, built with **Next.js**, **GSAP ScrollTrigger**, and modern CSS.

---

## 🌐 Live Demo

> **[https://adityagola003.github.io/itz-fizz-racing/](https://adityagola003.github.io/itz-fizz-racing/)**

---

## ✨ Features

- **Fixed-View Scroll Racing** — The viewport remains fixed while natural window scrolling drives the bike down a vertical racing track.
- **Top-Down Superbike** — High-performance red/black sports motorcycle moving with precision throttle dynamics.
- **Dynamic Red Trail** — Illuminated red speed trail drawn on the track surface directly behind the bike.
- **Passing Stat Reveals** — Impact statistics slide in alternately from left and right as the bike cruises past each checkpoint.
- **Checkered Finish Celebration** — Complete RACE WON overlay with animated checkered flags upon crossing the finish line.
- **Bi-directional Scrubbing** — Fully reversible; scrolling back up rewinds the bike, trail, and stat panels smoothly.
- **Responsive & Accessible** — Scales across mobile, tablet, and ultra-wide screens with full contrast optimization.

---

## 📊 Impact Statistics

| Stat | Value | Description |
|------|-------|-------------|
| 01 | **58%** | Increase in pick up point use |
| 02 | **23%** | Decreased in customer phone calls |
| 03 | **27%** | Increase in pick up point use |
| 04 | **40%** | Decreased in customer phone calls |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Local Development

```bash
# Clone the repository
git clone https://github.com/Adityagola003/itz-fizz-racing.git
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
# Static export output generated in ./out/
```

---

## 📁 Project Structure

```
itz-fizz-racing/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages automated CI/CD pipeline
├── public/
│   └── images/
│       └── bike-topdown.jpg    # Top-down racing motorcycle asset
├── src/
│   └── app/
│       ├── globals.css         # Dark motorsport design system & animations
│       ├── icon.svg            # Custom ITZ FIZZ badge favicon
│       ├── layout.jsx          # Root layout + SEO metadata
│       └── page.jsx            # Scroll-driven vertical track & GSAP logic
├── jsconfig.json
├── next.config.mjs             # Static export config with dynamic basePath
├── package.json
└── README.md
```

---

## 🚢 Deployment to GitHub Pages

1. **Create a repository** on GitHub (e.g. `itz-fizz-racing`).
2. **Push your code**:
   ```bash
   git remote add origin https://github.com/Adityagola003/itz-fizz-racing.git
   git branch -M main
   git push -u origin main
   ```
3. **Enable GitHub Pages via Actions**:
   - Go to **Settings → Pages** in your GitHub repository.
   - Under **Build and deployment → Source**, select **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` will automatically build and publish the site.

---

## 🛠 Technology Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework with static export (`output: "export"`) |
| React 19 | Component model |
| GSAP 3 & ScrollTrigger | High-performance scrub animations |
| Tailwind CSS & Vanilla CSS | Sleek dark motorsport aesthetic & typography |
| GitHub Actions | Automated build & deployment |
| GitHub Pages | Global CDN hosting |

---

## 🎨 Design System

- **Background:** `#0a0a0b` (near-black tarmac)
- **Track Surface:** `#141416` with illuminated dashed lane markers
- **Accent:** `#e8102a` (racing crimson)
- **Typography:** Orbitron (display headings) & Inter (body text)
