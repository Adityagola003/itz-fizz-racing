"use client";

import { useEffect, useRef, useCallback } from "react";
import RacingHero from "@/components/RacingHero";
import FinishOverlay from "@/components/FinishOverlay";

/**
 * Home — Root page component.
 * Handles all GSAP ScrollTrigger animation logic directly here.
 *
 * KEY ARCHITECTURE NOTE:
 * - The outer `section` (sectionRef) has height: 600vh — it's the scroll driver.
 * - Inside is a sticky container (height: 100vh) that stays fixed while you scroll.
 * - The bike (bikeRef) is absolutely positioned inside the sticky container.
 * - SVG coordinates are converted to sticky-container-relative coordinates.
 */
export default function Home() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);   // the sticky 100vh container
  const trackRef = useRef(null);
  const bikeRef = useRef(null);
  const pathRef = useRef(null);
  const racingLineRef = useRef(null);
  const checkpointRefs = useRef([]);
  const finishRef = useRef(null);
  const heroTextRef = useRef(null);
  const statsRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const gsapCtxRef = useRef(null);

  const setCheckpointRef = useCallback((el, index) => {
    checkpointRefs.current[index] = el;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      [sectionRef, heroTextRef, statsRef, bikeRef, scrollIndicatorRef].forEach(
        (r) => {
          if (r.current) r.current.style.opacity = "1";
        }
      );
      const statItems = statsRef.current?.querySelectorAll(".stat-item");
      statItems?.forEach((el) => (el.style.opacity = "1"));
      return;
    }

    let cancelled = false;

    const initGsap = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      // Clean up previous context
      if (gsapCtxRef.current) gsapCtxRef.current.revert();

      gsapCtxRef.current = gsap.context(() => {
        const section = sectionRef.current;
        const sticky = stickyRef.current;
        const bike = bikeRef.current;
        const path = pathRef.current;
        const racingLine = racingLineRef.current;
        const finishEl = finishRef.current;
        const heroText = heroTextRef.current;
        const statsEl = statsRef.current;
        const scrollIndicator = scrollIndicatorRef.current;

        if (!section || !sticky || !bike || !path) return;

        // SVG viewBox dimensions (must match RacingTrack.jsx viewBox)
        const VB_W = 800;
        const VB_H = 500;

        // Get real SVG element
        const svgEl = path.closest("svg");

        /**
         * Convert SVG viewBox coordinates → sticky-container-relative px.
         * The sticky container is always viewport-height and positioned at top:0
         * of the viewport while pinned, so we use its bounding rect as origin.
         */
        const toContainerCoords = (svgX, svgY) => {
          if (!svgEl) return { x: svgX, y: svgY };
          const svgRect = svgEl.getBoundingClientRect();
          const containerRect = sticky.getBoundingClientRect();
          const sx = svgRect.width / VB_W;
          const sy = svgRect.height / VB_H;
          return {
            x: (svgRect.left - containerRect.left) + svgX * sx,
            y: (svgRect.top - containerRect.top) + svgY * sy,
          };
        };

        /**
         * Get bike position + rotation angle for a given scroll fraction [0..1].
         */
        const getPathPoint = (fraction) => {
          const len = path.getTotalLength();
          const pos = Math.min(Math.max(fraction, 0), 1) * len;
          const pt = path.getPointAtLength(pos);
          const delta = 4;
          const ptA = path.getPointAtLength(Math.max(0, pos - delta));
          const ptB = path.getPointAtLength(Math.min(len, pos + delta));
          const angle =
            Math.atan2(ptB.y - ptA.y, ptB.x - ptA.x) * (180 / Math.PI);
          return { svgX: pt.x, svgY: pt.y, angle };
        };

        // Total path length for racing line dash animation
        const pathLength = path.getTotalLength();

        // Init racing line to fully hidden (drawn as bike progresses)
        if (racingLine) {
          gsap.set(racingLine, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          });
        }

        // Place bike at circuit START (fraction = 0)
        const startPt = getPathPoint(0);
        const startCoords = toContainerCoords(startPt.svgX, startPt.svgY);
        const bikeW = bike.offsetWidth || 200;
        const bikeH = bike.offsetHeight || 112;
        gsap.set(bike, {
          x: startCoords.x - bikeW / 2,
          y: startCoords.y - bikeH / 2,
          rotation: startPt.angle,
          opacity: 0,
        });

        // ════════════════════════════════════════════════
        //  ENTRANCE ANIMATION (fires once on page load)
        // ════════════════════════════════════════════════
        const entranceTL = gsap.timeline({ delay: 0.4 });

        // 1. Section fade in (background + track become visible)
        entranceTL.fromTo(
          section,
          { opacity: 0 },
          { opacity: 1, duration: 0.9, ease: "power2.out" }
        );

        // 2. Headline character reveal
        if (heroText) {
          // heroTextRef is on the pre-headline wrapper; the h1 is a sibling
          const h1 = heroText.nextElementSibling;
          const chars = h1?.querySelectorAll(".hero-char");
          if (chars && chars.length > 0) {
            entranceTL.fromTo(
              chars,
              { y: 80, opacity: 0, skewY: 4 },
              {
                y: 0,
                opacity: 1,
                skewY: 0,
                duration: 0.85,
                stagger: 0.025,
                ease: "power4.out",
              },
              "-=0.3"
            );
          }
          // Also animate the pre-headline bar
          entranceTL.fromTo(
            heroText,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
            "<"
          );
        }

        // 3. Stats stagger entrance
        if (statsEl) {
          const statItems = statsEl.querySelectorAll(".stat-item");
          if (statItems.length) {
            entranceTL.fromTo(
              statItems,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
              },
              "-=0.3"
            );
          }
        }

        // 4. Bike enters the scene
        entranceTL.fromTo(
          bike,
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 1.0, ease: "back.out(1.5)" },
          "-=0.5"
        );

        // 5. Scroll indicator appears
        if (scrollIndicator) {
          entranceTL.fromTo(
            scrollIndicator,
            { opacity: 0, y: -15 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            "-=0.2"
          );
        }

        // ════════════════════════════════════════════════
        //  SCROLL-DRIVEN RACE (main animation)
        // ════════════════════════════════════════════════
        // Checkpoint fractions: bike triggers each at these progress values
        const checkpointFractions = [0.3, 0.56, 0.78];
        const cpActiveStates = [false, false, false];

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          onUpdate: (self) => {
            const p = self.progress;

            // ── 1. Move bike along the SVG path ──
            const pt = getPathPoint(p);
            const coords = toContainerCoords(pt.svgX, pt.svgY);
            const bW = bike.offsetWidth || 200;
            const bH = bike.offsetHeight || 112;

            // Clamp rotation so bike doesn't appear upside-down
            const clampedAngle = Math.max(-35, Math.min(35, pt.angle));

            gsap.set(bike, {
              x: coords.x - bW / 2,
              y: coords.y - bH / 2,
              rotation: clampedAngle,
            });

            // ── 2. Draw racing line up to current progress ──
            if (racingLine) {
              gsap.set(racingLine, {
                strokeDashoffset: pathLength * (1 - p),
              });
            }

            // ── 3. Activate / deactivate checkpoints ──
            checkpointFractions.forEach((fraction, i) => {
              const el = checkpointRefs.current[i];
              if (!el) return;
              const shouldBeActive = p >= fraction;
              if (cpActiveStates[i] !== shouldBeActive) {
                cpActiveStates[i] = shouldBeActive;
                el.dataset.active = shouldBeActive ? "true" : "false";
              }
            });

            // ── 4. Reveal finish overlay (last 8% of scroll) ──
            if (finishEl) {
              const finishProg = Math.max(0, Math.min(1, (p - 0.92) / 0.08));
              gsap.set(finishEl, {
                opacity: finishProg,
                pointerEvents: finishProg > 0.5 ? "auto" : "none",
              });
            }

            // ── 5. Fade out scroll indicator as race begins ──
            if (scrollIndicator) {
              const fadeOut = Math.max(0, 1 - p * 20);
              gsap.set(scrollIndicator, { opacity: fadeOut });
            }
          },
        });

        // ── Recalculate on resize ──
        const handleResize = () => {
          ScrollTrigger.refresh();
          // Re-place bike at current position immediately after resize
        };
        window.addEventListener("resize", handleResize, { passive: true });

        // ── Refresh after images load (bike asset) ──
        const imgs = section.querySelectorAll("img");
        let loaded = 0;
        const total = imgs.length;
        if (total === 0) {
          ScrollTrigger.refresh();
        } else {
          imgs.forEach((img) => {
            const onLoad = () => {
              loaded++;
              if (loaded >= total) ScrollTrigger.refresh();
            };
            if (img.complete) onLoad();
            else img.addEventListener("load", onLoad, { once: true });
          });
        }

        return () => {
          window.removeEventListener("resize", handleResize);
        };
      });
    };

    initGsap();

    return () => {
      cancelled = true;
      if (gsapCtxRef.current) {
        gsapCtxRef.current.revert();
        gsapCtxRef.current = null;
      }
    };
  }, []);

  return (
    <main id="main-content" style={{ background: "var(--bg-primary)" }}>
      <RacingHero
        sectionRef={sectionRef}
        stickyRef={stickyRef}
        trackRef={trackRef}
        bikeRef={bikeRef}
        pathRef={pathRef}
        racingLineRef={racingLineRef}
        finishRef={finishRef}
        heroTextRef={heroTextRef}
        statsRef={statsRef}
        scrollIndicatorRef={scrollIndicatorRef}
        setCheckpointRef={setCheckpointRef}
      />

      {/* RACE WON finish overlay — fixed overlay, revealed at end of scroll */}
      <FinishOverlay finishRef={finishRef} />

      {/* ─── POST-RACE CONTENT ─── */}
      <section
        id="post-race"
        className="relative py-24 px-6 md:px-10 racing-grid"
        style={{
          background: "var(--bg-secondary)",
          borderTop: "1px solid rgba(232,16,42,0.2)",
        }}
        aria-labelledby="post-race-heading"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Section badge */}
          <div
            className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full"
            style={{
              background: "rgba(232,16,42,0.08)",
              border: "1px solid rgba(232,16,42,0.2)",
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#e8102a", boxShadow: "0 0 6px #e8102a" }}
            />
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: "#e8102a", fontFamily: "Orbitron, sans-serif" }}
            >
              Season Summary
            </span>
          </div>

          <h2
            id="post-race-heading"
            className="font-orbitron font-bold uppercase mb-6"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            The Road Ahead
          </h2>

          <p
            className="text-base md:text-lg leading-relaxed mx-auto mb-12"
            style={{
              color: "var(--text-secondary)",
              maxWidth: "600px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            ITZ FIZZ continues to push the boundaries of delivery performance.
            The statistics speak for themselves — smarter pick-up solutions,
            fewer support calls, and a race to the top that&apos;s just getting
            started.
          </p>

          {/* Stats recap */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { v: "58%", d: "Increase in pick up point use" },
              { v: "23%", d: "Decreased customer phone calls" },
              { v: "27%", d: "Increase in pick up point use" },
              { v: "40%", d: "Decreased customer phone calls" },
            ].map((s, i) => (
              <div
                key={i}
                className="p-5 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="font-orbitron font-bold mb-2"
                  style={{
                    fontSize: "2rem",
                    color: i % 2 === 0 ? "#e8102a" : "white",
                  }}
                >
                  {s.v}
                </div>
                <p
                  className="text-xs leading-snug"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className="py-8 px-6 md:px-10"
        style={{
          background: "var(--bg-primary)",
          borderTop: "1px solid var(--border-subtle)",
        }}
        role="contentinfo"
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded flex items-center justify-center"
              style={{ background: "#e8102a" }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: "9px",
                  fontWeight: 900,
                  fontFamily: "Orbitron, sans-serif",
                  letterSpacing: "0.5px",
                }}
              >
                IF
              </span>
            </div>
            <span
              className="text-sm font-medium"
              style={{
                color: "var(--text-muted)",
                fontFamily: "Orbitron, sans-serif",
                letterSpacing: "0.1em",
              }}
            >
              ITZ FIZZ RACING DIVISION
            </span>
          </div>
          {/* Copyright */}
          <p
            className="text-xs text-center sm:text-right"
            style={{
              color: "var(--text-muted)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            © 2024 ITZ FIZZ. All rights reserved.
            <br className="sm:hidden" />{" "}
            Built with Next.js &amp; GSAP ScrollTrigger.
          </p>
        </div>
      </footer>
    </main>
  );
}
