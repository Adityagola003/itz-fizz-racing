"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import bikeImg from "../../public/images/bike-topdown.jpg";

/**
 * ITZ FIZZ — The Race Experience (v4)
 *
 * KEY MECHANICS:
 * - body height = 500vh → window scrolls normally
 * - scene is position:fixed → never visually moves
 * - ScrollTrigger watches window scroll (no custom scroller)
 * - Bike descends the vertical road strip as user scrolls
 * - Road dashes animate upward (infinite road illusion)
 * - "WELCOME ITZ FIZZ" fades in at start, then fades as bike leaves it behind
 * - 4 stat panels appear left/right as bike passes them
 * - RACE WON overlay at the end
 * - All reversible on scroll-up
 */
export default function Home() {
  const bikeRef        = useRef(null);
  const trailRef       = useRef(null);
  const dashInnerRef   = useRef(null);
  const progressFill   = useRef(null);
  const finishRef      = useRef(null);
  const welcomeRef     = useRef(null);
  const scrollHintRef  = useRef(null);
  const sceneRef       = useRef(null);

  const p1Ref = useRef(null);
  const p2Ref = useRef(null);
  const p3Ref = useRef(null);
  const p4Ref = useRef(null);

  const cp1Ref = useRef(null);
  const cp2Ref = useRef(null);
  const cp3Ref = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Give the window scroll space — the scene itself is fixed
    document.body.style.height = "500vh";
    document.body.style.overflow = "auto";

    let ctx;
    let cancelled = false;

    const init = async () => {
      const { gsap }          = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      if (ctx) ctx.revert();

      ctx = gsap.context(() => {
        const bike    = bikeRef.current;
        const trail   = trailRef.current;
        const dash    = dashInnerRef.current;
        const prog    = progressFill.current;
        const finish  = finishRef.current;
        const welcome = welcomeRef.current;
        const hint    = scrollHintRef.current;
        const panels  = [p1Ref, p2Ref, p3Ref, p4Ref].map(r => r.current);
        const cps     = [cp1Ref, cp2Ref, cp3Ref].map(r => r.current);

        if (!bike) return;

        // Bike travels: top 8% → 80% of viewport height
        const START = 8;
        const END   = 80;

        // Scroll fractions at which each panel fades in
        const PANEL_AT = [0.18, 0.38, 0.58, 0.76];
        const CP_AT    = [0.22, 0.50, 0.74];

        // GSAP initial states
        gsap.set(bike,   { top: `${START}%`, opacity: 0 });
        gsap.set(panels, { opacity: 0, x: 0 });
        if (welcome) gsap.set(welcome, { opacity: 0, y: 10 });

        // Track per-item active state for clean reversals
        const panelOn = [false, false, false, false];
        const cpOn    = [false, false, false];

        // ── Entrance animation on load ──
        gsap.timeline({ delay: 0.2 })
          .to(sceneRef.current, { opacity: 1, duration: 0.7, ease: "power2.out" })
          .to(bike,    { opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, "-=0.3")
          .to(welcome, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.4")
          .to(hint,    { opacity: 1, duration: 0.4 }, "-=0.1");

        // ── Main scroll-driven animation ──
        ScrollTrigger.create({
          trigger: document.body,
          start:   "top top",
          end:     "bottom bottom",
          scrub:   0.9,
          onUpdate(self) {
            const p = self.progress;

            // 1. Bike position (top %)
            const topPct = START + p * (END - START);
            bike.style.top = topPct + "%";

            // 2. Red trail behind bike (above it = the path it has raced through)
            if (trail) trail.style.height = topPct + "%";

            // 3. Road dashes scroll upward — moves 2× viewport worth of dash repeat
            if (dash) {
              const offset = (p * window.innerHeight * 4) % 96; // 96px = dash repeat
              dash.style.transform = `translateX(-50%) translateY(-${offset}px)`;
            }

            // 4. Right-side progress bar
            if (prog) prog.style.height = (p * 100) + "%";

            // 5. Welcome text: visible 0→20%, fades 20→32%
            if (welcome) {
              const op = p < 0.04  ? p / 0.04
                       : p < 0.20  ? 1
                       : p < 0.33  ? 1 - (p - 0.20) / 0.13
                       : 0;
              welcome.style.opacity = Math.max(0, op).toString();
            }

            // 6. Stat panels — slide in from the side as bike passes
            PANEL_AT.forEach((trig, i) => {
              const el = panels[i];
              if (!el) return;
              const should = p >= trig;
              if (should !== panelOn[i]) {
                panelOn[i] = should;
                // Even panels slide from right (left side panels), odd from left (right panels)
                const fromX = (i % 2 === 0) ? 30 : -30;
                gsap.fromTo(el,
                  { x: should ? fromX : 0, opacity: should ? 0 : 1 },
                  { x: 0, opacity: should ? 1 : 0, duration: 0.45, ease: "power2.out" }
                );
              }
            });

            // 7. Checkpoint bands highlight
            CP_AT.forEach((trig, i) => {
              const el = cps[i];
              if (!el) return;
              const should = p >= trig;
              if (should !== cpOn[i]) {
                cpOn[i] = should;
                el.classList.toggle("active", should);
              }
            });

            // 8. Scroll hint fades out quickly
            if (hint) hint.style.opacity = Math.max(0, 1 - p * 12).toString();

            // 9. Finish overlay — last 7% of scroll
            if (finish) {
              const fp = Math.max(0, Math.min(1, (p - 0.93) / 0.07));
              finish.style.opacity = fp.toString();
              finish.style.pointerEvents = fp > 0.5 ? "auto" : "none";
            }
          },
        });

        // Recalculate on resize
        window.addEventListener("resize", () => ScrollTrigger.refresh(), { passive: true });
      });
    };

    init();

    return () => {
      cancelled = true;
      document.body.style.height = "";
      document.body.style.overflow = "";
      if (ctx) ctx.revert();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* ══════════════════════════════════════════════
          FIXED SCENE — pinned to viewport always
      ══════════════════════════════════════════════ */}
      <div ref={sceneRef} className="scene" style={{ opacity: 0 }}>

        {/* ── HEADER ── */}
        <header className="header">
          <div className="brand">
            <div className="brand-icon">IF</div>
            <span className="brand-name">ITZ FIZZ Racing Division</span>
          </div>
          <div className="live-badge">
            <div className="live-dot" />
            <span className="live-text">Race Live</span>
          </div>
        </header>

        {/* ── TRACK AREA (full scene, centred vertical road) ── */}
        <div className="track-area">

          {/* ─── ROAD STRIP ─── */}
          <div className="road-strip">

            {/* Red trail left behind as bike descends */}
            <div ref={trailRef} className="trail-behind" style={{ height: "0%" }} />

            {/* Road edge accent lines */}
            <div className="road-edge-left"  />
            <div className="road-edge-right" />

            {/* Scrolling dashes — animated upward in onUpdate */}
            <div className="road-dashes">
              <div ref={dashInnerRef} className="dash-inner" />
            </div>

            {/* Checkpoint marker bands */}
            <div ref={cp1Ref} className="checkpoint-band" style={{ top: "28%" }} />
            <div ref={cp2Ref} className="checkpoint-band" style={{ top: "52%" }} />
            <div ref={cp3Ref} className="checkpoint-band" style={{ top: "76%" }} />

            {/* Start / finish lines */}
            <div className="start-line" />
            <div className="finish-line" />

          </div>{/* end road-strip */}

          {/* ─── BIKE (top-down view, moves vertically) ─── */}
          <div
            ref={bikeRef}
            className="bike-container"
            style={{ opacity: 0, top: "8%" }}
            aria-label="ITZ FIZZ racing bike"
          >
            <Image
              src={bikeImg}
              alt="ITZ FIZZ Racing Superbike — top-down view"
              width={280}
              height={280}
              priority
              className="bike-img"
            />
            <div className="bike-glow" />
          </div>

          {/* ─── WELCOME ITZ FIZZ — centred, fades in on load, fades out as bike leaves ─── */}
          <div ref={welcomeRef} className="welcome-panel" aria-label="Welcome ITZ FIZZ">
            <h1 className="welcome-headline">
              WELCOME<br />
              <span className="red">ITZ&nbsp;FIZZ</span>
            </h1>
            <p className="welcome-tagline">Scroll to race ↓</p>
          </div>

          {/* ═══════════════════════════════════════════════════════
              STAT PANELS — appear left / right as bike descends
              Behind = above the bike's current position on screen
          ═══════════════════════════════════════════════════════ */}

          {/* 58% — LEFT, appears ~26% down */}
          <div
            ref={p1Ref}
            className="content-panel left"
            style={{ top: "26%", opacity: 0 }}
          >
            <div className="connector" />
            <div className="panel-label">Impact · 01</div>
            <div className="panel-value">58%</div>
            <p className="panel-desc">Increase in pick up point use</p>
          </div>

          {/* 23% — RIGHT, appears ~44% down */}
          <div
            ref={p2Ref}
            className="content-panel right"
            style={{ top: "44%", opacity: 0 }}
          >
            <div className="connector" />
            <div className="panel-label">Impact · 02</div>
            <div className="panel-value" style={{ color: "#e8102a" }}>23%</div>
            <p className="panel-desc">Decreased in customer phone calls</p>
          </div>

          {/* 27% — LEFT, appears ~60% down */}
          <div
            ref={p3Ref}
            className="content-panel left"
            style={{ top: "60%", opacity: 0 }}
          >
            <div className="connector" />
            <div className="panel-label">Impact · 03</div>
            <div className="panel-value">27%</div>
            <p className="panel-desc">Increase in pick up point use</p>
          </div>

          {/* 40% — RIGHT, appears ~76% down */}
          <div
            ref={p4Ref}
            className="content-panel right"
            style={{ top: "76%", opacity: 0 }}
          >
            <div className="connector" />
            <div className="panel-label">Impact · 04</div>
            <div className="panel-value" style={{ color: "#e8102a" }}>40%</div>
            <p className="panel-desc">Decreased in customer phone calls</p>
          </div>

          {/* Finish line label */}
          <div className="finish-label">FINISH LINE</div>

        </div>{/* end track-area */}

        {/* Right-side race progress bar */}
        <div className="progress-bar">
          <div ref={progressFill} className="progress-fill" style={{ height: "0%" }} />
        </div>

        {/* Scroll hint */}
        <div ref={scrollHintRef} className="scroll-hint" style={{ opacity: 0 }}>
          <span className="scroll-arrow">↓</span>
          &nbsp;&nbsp;Scroll to Race&nbsp;&nbsp;
          <span className="scroll-arrow">↓</span>
        </div>

      </div>{/* end scene */}

      {/* ══════════════════════════════════════════════
          FINISH OVERLAY — also fixed, revealed at end
      ══════════════════════════════════════════════ */}
      <div
        ref={finishRef}
        className="finish-overlay"
        style={{ opacity: 0, pointerEvents: "none" }}
        role="status"
        aria-live="polite"
      >
        <div className="finish-flags">
          <div className="flag" />
          <div className="flag" />
        </div>
        <h2 className="finish-title">
          RACE <span className="red">WON</span>
        </h2>
        <p className="finish-sub">
          Finish Line Crossed.&nbsp; ITZ FIZZ Takes The Lead.
        </p>
        <p className="finish-hint">↑ Scroll up to race again</p>
      </div>
    </>
  );
}
