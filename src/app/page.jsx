"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * ITZ FIZZ — The Race Experience
 *
 * Exactly like the reference (car-scroll-animation):
 * - Page does NOT scroll visually — only the bike moves
 * - A 500vh scroll-driver div gives ScrollTrigger its range
 * - The scene is sticky at top:0, 100vh
 * - Bike moves left→right along a straight horizontal road
 * - Text boxes (headline + 4 stats) fade in as bike passes them
 * - Finish "RACE WON" state at the end
 */
export default function Home() {
  const bikeRef    = useRef(null);
  const trailRef   = useRef(null);
  const finishRef  = useRef(null);

  // Individual text box refs
  const box0Ref = useRef(null); // WELCOME ITZ FIZZ
  const box1Ref = useRef(null); // 58%
  const box2Ref = useRef(null); // 23%
  const box3Ref = useRef(null); // 27%
  const box4Ref = useRef(null); // 40%

  // Checkpoint refs
  const cp1Ref = useRef(null);
  const cp2Ref = useRef(null);
  const cp3Ref = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let ctx;
    let cancelled = false;

    const init = async () => {
      const { gsap }         = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const bike    = bikeRef.current;
      const trail   = trailRef.current;
      const finish  = finishRef.current;
      const boxes   = [box0Ref, box1Ref, box2Ref, box3Ref, box4Ref].map(r => r.current);
      const cps     = [cp1Ref, cp2Ref, cp3Ref].map(r => r.current);

      if (!bike) return;

      // Road goes edge-to-edge; bike travels from ~4% to ~96% of viewport width
      const roadStart   = 0.04;  // 4% vw  — starting position
      const roadEnd     = 0.96;  // 96% vw — finish position
      const bikeWidthPx = bike.offsetWidth || 220;

      // Convert fraction [0..1] to a CSS left value (px) that centres bike on that fraction
      const toLeft = (frac) => window.innerWidth * frac - bikeWidthPx / 2;

      // Set initial bike position
      gsap.set(bike, { x: toLeft(roadStart) - (window.innerWidth * roadStart) });
      // Actually just use `left` property for simplicity
      bike.style.left = toLeft(roadStart) + "px";

      // ── Text-box trigger positions (as fraction of scroll progress) ──
      // The bike reveals each box as it passes the box's road position
      const triggers = [
        { ref: box0Ref, atProgress: 0.05 }, // Welcome ITZ FIZZ — appears right away
        { ref: box1Ref, atProgress: 0.22 }, // 58%
        { ref: box2Ref, atProgress: 0.40 }, // 23%
        { ref: box3Ref, atProgress: 0.57 }, // 27%
        { ref: box4Ref, atProgress: 0.74 }, // 40%
      ];

      const cpTriggers = [0.25, 0.50, 0.75]; // checkpoint activation fractions

      // Track active states for reverse support
      const boxActive = [false, false, false, false, false];
      const cpActive  = [false, false, false];
      let finishActive = false;

      // ─── Main scroll trigger ───
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: ".scroll-driver",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;

            // ── 1. Bike left position ──
            const frac = roadStart + p * (roadEnd - roadStart);
            const leftPx = window.innerWidth * frac - bikeWidthPx / 2;
            bike.style.left = leftPx + "px";

            // ── 2. Red trail behind bike ──
            if (trail) {
              trail.style.width = (frac * 100) + "%";
            }

            // ── 3. Text boxes reveal / hide on progress ──
            triggers.forEach(({ ref, atProgress }, i) => {
              const el = ref.current;
              if (!el) return;
              const shouldShow = p >= atProgress;
              if (shouldShow !== boxActive[i]) {
                boxActive[i] = shouldShow;
                gsap.to(el, {
                  opacity: shouldShow ? 1 : 0,
                  y:       shouldShow ? 0 : (i % 2 === 0 ? -10 : 10),
                  duration: 0.35,
                  ease: "power2.out",
                });
              }
            });

            // ── 4. Checkpoint markers ──
            cpTriggers.forEach((frac, i) => {
              const el = cps[i];
              if (!el) return;
              const shouldBeActive = p >= frac;
              if (shouldBeActive !== cpActive[i]) {
                cpActive[i] = shouldBeActive;
                el.classList.toggle("active", shouldBeActive);
              }
            });

            // ── 5. Finish overlay (last 5% of scroll) ──
            if (finish) {
              const finishProg = Math.max(0, Math.min(1, (p - 0.95) / 0.05));
              const shouldFinish = finishProg > 0;
              if (shouldFinish !== finishActive || finishProg > 0) {
                finishActive = shouldFinish;
                finish.style.opacity = finishProg;
                finish.style.pointerEvents = finishProg > 0.5 ? "auto" : "none";
              }
            }
          },
        });

        // ── Entrance: fade in the sticky scene on load ──
        const scene = document.querySelector(".sticky-scene");
        if (scene) {
          gsap.fromTo(scene, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" });
        }

        // Refresh on resize
        window.addEventListener("resize", () => {
          ScrollTrigger.refresh();
          const bikeW = bike.offsetWidth || 220;
          // Re-place bike relative to current scroll progress
          const st = ScrollTrigger.getAll()[0];
          if (st) {
            const p = st.progress;
            const frac = roadStart + p * (roadEnd - roadStart);
            bike.style.left = (window.innerWidth * frac - bikeW / 2) + "px";
          }
        }, { passive: true });
      });
    };

    init();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <>
      {/* ══════════════════════════════════════════
          SCROLL DRIVER — 500vh, gives ST its range
          Page itself does NOT scroll visually
      ══════════════════════════════════════════ */}
      <div className="scroll-driver" aria-hidden="true" />

      {/* ══════════════════════════════════════════
          STICKY SCENE — stays at top:0 always
      ══════════════════════════════════════════ */}
      <div className="sticky-scene" style={{ position: "fixed", top: 0, left: 0 }}>

        {/* ── Header ── */}
        <header className="site-header">
          <div className="brand-badge">
            <div className="brand-dot" />
            <span className="brand-label">ITZ FIZZ Racing Division</span>
          </div>
          <span className="race-status">Race Mode Active</span>
        </header>

        {/* ── Hero headline ── */}
        <div className="hero-area">
          <h1 className="welcome-headline" aria-label="Welcome ITZ FIZZ">
            W&nbsp;E&nbsp;L&nbsp;C&nbsp;O&nbsp;M&nbsp;E&nbsp;&nbsp;
            <span className="accent">I&nbsp;T&nbsp;Z&nbsp;</span>
            <span className="accent">F&nbsp;I&nbsp;Z&nbsp;Z</span>
          </h1>
          <p className="subtitle">Scroll to race &nbsp;/&nbsp; ITZ FIZZ Racing Division</p>
        </div>

        {/* ── Road area ── */}
        <div className="road-wrapper">

          {/* The road surface */}
          <div className="road">
            {/* Animated red progress trail */}
            <div className="road-trail" ref={trailRef} />
            {/* Centre dashed racing line */}
            <div className="road-center-line" />

            {/* Checkpoint markers */}
            <div className="checkpoint" ref={cp1Ref} data-label="CP 01"
              style={{ left: "25%" }} />
            <div className="checkpoint" ref={cp2Ref} data-label="CP 02"
              style={{ left: "50%" }} />
            <div className="checkpoint" ref={cp3Ref} data-label="CP 03"
              style={{ left: "75%" }} />

            {/* Start flag */}
            <div className="flag-marker" style={{ left: "2%" }}>
              <div className="flag-checkered" style={{ width: 30, height: 20 }} />
              <div className="flag-pole" style={{ height: 36 }} />
              <span className="flag-label">Start</span>
            </div>

            {/* Finish flag */}
            <div className="flag-marker" style={{ right: "2%" }}>
              <div className="flag-checkered" style={{ width: 30, height: 20 }} />
              <div className="flag-pole" style={{ height: 36 }} />
              <span className="flag-label">Finish</span>
            </div>
          </div>

          {/* ── THE BIKE — absolutely positioned, GSAP moves `left` ── */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: 0,
              zIndex: 20,
              transition: "none",
              pointerEvents: "none",
            }}
            ref={bikeRef}
          >
            <Image
              src="/images/racing-bike.jpg"
              alt="ITZ FIZZ Racing Bike"
              width={440}
              height={248}
              priority
              style={{
                height: "140px",
                width: "auto",
                display: "block",
                filter: "drop-shadow(0 8px 24px rgba(232,16,42,0.3)) drop-shadow(0 2px 8px rgba(0,0,0,0.8))",
              }}
            />
          </div>

          {/* ══════════════════════════════════════
              TEXT BOXES — positioned along the road
              They fade in as the bike passes them
          ══════════════════════════════════════ */}

          {/* Box 0 — WELCOME headline (appears at very start, above road) */}
          <div
            ref={box0Ref}
            className="text-box above"
            style={{ left: "5%", opacity: 0, transform: "translateY(-10px)" }}
          >
            <div className="text-box-label">The Race Experience</div>
            <div style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "white", lineHeight: 1.2, marginBottom: 4 }}>
              WELCOME<br />
              <span style={{ color: "#e8102a" }}>ITZ FIZZ</span>
            </div>
            <div className="text-box-desc">Scroll to race through the ITZ FIZZ experience</div>
          </div>

          {/* Box 1 — 58% (above road) */}
          <div
            ref={box1Ref}
            className="text-box above"
            style={{ left: "20%", opacity: 0, transform: "translateY(-10px)" }}
          >
            <div className="text-box-label">Impact Metric 01</div>
            <div className="text-box-value">58%</div>
            <div className="text-box-desc">Increase in pick up point use</div>
          </div>

          {/* Box 2 — 23% (below road) */}
          <div
            ref={box2Ref}
            className="text-box below"
            style={{ left: "37%", opacity: 0, transform: "translateY(10px)" }}
          >
            <div className="text-box-label">Impact Metric 02</div>
            <div className="text-box-value" style={{ color: "#e8102a" }}>23%</div>
            <div className="text-box-desc">Decreased in customer phone calls</div>
          </div>

          {/* Box 3 — 27% (above road) */}
          <div
            ref={box3Ref}
            className="text-box above"
            style={{ left: "54%", opacity: 0, transform: "translateY(-10px)" }}
          >
            <div className="text-box-label">Impact Metric 03</div>
            <div className="text-box-value">27%</div>
            <div className="text-box-desc">Increase in pick up point use</div>
          </div>

          {/* Box 4 — 40% (below road) */}
          <div
            ref={box4Ref}
            className="text-box below"
            style={{ left: "71%", opacity: 0, transform: "translateY(10px)" }}
          >
            <div className="text-box-label">Impact Metric 04</div>
            <div className="text-box-value" style={{ color: "#e8102a" }}>40%</div>
            <div className="text-box-desc">Decreased in customer phone calls</div>
          </div>

        </div>{/* end road-wrapper */}

        {/* ── Scroll hint ── */}
        <div className="scroll-hint">↓ &nbsp; Scroll to race &nbsp; ↓</div>

      </div>{/* end sticky-scene */}

      {/* ══════════════════════════════════════════
          FINISH OVERLAY — fixed, revealed at end
      ══════════════════════════════════════════ */}
      <div
        ref={finishRef}
        className="finish-banner"
        style={{ opacity: 0, pointerEvents: "none" }}
        role="status"
        aria-live="polite"
      >
        {/* Checkered flag icons */}
        <div className="finish-flags">
          <div className="finish-flag-icon" />
          <div className="finish-flag-icon" />
        </div>

        <h2 className="finish-title">
          RACE <span>WON</span>
        </h2>

        <p className="finish-sub">
          Finish Line Crossed. ITZ FIZZ Takes The Lead.
        </p>

        <p className="finish-hint">Scroll up to race again</p>
      </div>
    </>
  );
}
