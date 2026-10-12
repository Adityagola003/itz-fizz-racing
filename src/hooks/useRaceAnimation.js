"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * useRaceAnimation — Master GSAP + ScrollTrigger hook
 * Drives the bike along an SVG path keyed to scroll progress.
 * Returns refs that components attach to their DOM nodes.
 */
export function useRaceAnimation() {
  const sectionRef = useRef(null);
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

  // Helper: get point + angle at given fraction along SVG path
  const getPathData = useCallback((path, fraction) => {
    if (!path) return { x: 0, y: 0, angle: 0 };
    const len = path.getTotalLength();
    const pos = fraction * len;
    const pt = path.getPointAtLength(pos);
    const delta = 2;
    const ptA = path.getPointAtLength(Math.max(0, pos - delta));
    const ptB = path.getPointAtLength(Math.min(len, pos + delta));
    const angle = Math.atan2(ptB.y - ptA.y, ptB.x - ptA.x) * (180 / Math.PI);
    return { x: pt.x, y: pt.y, angle };
  }, []);

  useEffect(() => {
    // Bail on SSR
    if (typeof window === "undefined") return;

    // Respect reduced-motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      // Show everything statically
      if (heroTextRef.current) heroTextRef.current.style.opacity = "1";
      if (statsRef.current) statsRef.current.style.opacity = "1";
      if (bikeRef.current) bikeRef.current.style.opacity = "1";
      if (finishRef.current) finishRef.current.style.opacity = "1";
      return;
    }

    let gsap, ScrollTrigger;

    const init = async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      gsap = gsapMod.gsap;
      ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      // Clean previous context
      if (gsapCtxRef.current) {
        gsapCtxRef.current.revert();
      }

      gsapCtxRef.current = gsap.context(() => {
        const section = sectionRef.current;
        const bike = bikeRef.current;
        const path = pathRef.current;
        const racingLine = racingLineRef.current;
        const finishEl = finishRef.current;
        const heroText = heroTextRef.current;
        const stats = statsRef.current;
        const scrollIndicator = scrollIndicatorRef.current;

        if (!section || !bike || !path) return;

        const pathLength = path.getTotalLength();

        // ─── Checkpoint fractions along the path ───
        const checkpointFractions = [0.3, 0.56, 0.78];

        // ─── ENTRANCE ANIMATION (page load) ───
        const entranceTL = gsap.timeline({ delay: 0.3 });

        // 1. Background / track fade in
        entranceTL.fromTo(
          section,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: "power2.out" }
        );

        // 2. Hero text character reveal
        if (heroText) {
          const chars = heroText.querySelectorAll(".hero-char");
          if (chars.length > 0) {
            entranceTL.fromTo(
              chars,
              { y: 60, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.7,
                stagger: 0.04,
                ease: "power3.out",
              },
              "-=0.2"
            );
          } else {
            entranceTL.fromTo(
              heroText,
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
              "-=0.2"
            );
          }
        }

        // 3. Stats stagger
        if (stats) {
          const statItems = stats.querySelectorAll(".stat-item");
          if (statItems.length > 0) {
            entranceTL.fromTo(
              statItems,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.12,
                ease: "power2.out",
              },
              "-=0.3"
            );
          }
        }

        // 4. Bike entrance
        entranceTL.fromTo(
          bike,
          { opacity: 0, scale: 0.9, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.2)" },
          "-=0.4"
        );

        // 5. Scroll indicator
        if (scrollIndicator) {
          entranceTL.fromTo(
            scrollIndicator,
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            "-=0.1"
          );
        }

        // ─── RACING LINE DRAW PREP ───
        if (racingLine) {
          gsap.set(racingLine, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          });
        }

        // ─── INITIAL BIKE POSITION ───
        const startPt = getPathData(path, 0);
        // Get SVG viewport dimensions for positioning
        const svgEl = path.closest("svg");
        const svgRect = svgEl ? svgEl.getBoundingClientRect() : { width: 800, height: 500 };
        const vbWidth = 800;
        const vbHeight = 500;
        const scaleX = svgRect.width / vbWidth;
        const scaleY = svgRect.height / vbHeight;

        gsap.set(bike, {
          x: startPt.x * scaleX - bike.offsetWidth / 2,
          y: startPt.y * scaleY - bike.offsetHeight / 2,
        });

        // ─── SCROLL-DRIVEN RACE TIMELINE ───
        const raceTL = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
            pin: false,
            onUpdate: (self) => {
              const progress = self.progress;

              // Move bike along path
              const svgNow = path.closest("svg");
              const rectNow = svgNow ? svgNow.getBoundingClientRect() : { width: 800, height: 500 };
              const sxNow = rectNow.width / vbWidth;
              const syNow = rectNow.height / vbHeight;
              const pt = getPathData(path, progress);
              const bikeW = bike.offsetWidth;
              const bikeH = bike.offsetHeight;

              // Clamp rotation to ±25 deg for readability
              const clampedAngle = Math.max(-25, Math.min(25, pt.angle));

              gsap.set(bike, {
                x: pt.x * sxNow - bikeW / 2,
                y: pt.y * syNow - bikeH / 2,
                rotation: clampedAngle,
              });

              // Animate racing line draw
              if (racingLine) {
                gsap.set(racingLine, {
                  strokeDashoffset: pathLength * (1 - progress),
                });
              }

              // Checkpoints
              checkpointFractions.forEach((fraction, i) => {
                const el = checkpointRefs.current[i];
                if (!el) return;
                const isActive = progress >= fraction;
                el.dataset.active = isActive ? "true" : "false";
              });

              // Finish state
              if (finishEl) {
                const finishProgress = Math.max(0, (progress - 0.92) / 0.08);
                gsap.set(finishEl, {
                  opacity: finishProgress,
                  pointerEvents: finishProgress > 0.5 ? "auto" : "none",
                });
              }
            },
          },
        });

        // Refresh ScrollTrigger on window resize
        const handleResize = () => {
          ScrollTrigger.refresh();
        };
        window.addEventListener("resize", handleResize);

        // Refresh after images load
        const imgs = section.querySelectorAll("img");
        let loadedCount = 0;
        imgs.forEach((img) => {
          if (img.complete) {
            loadedCount++;
            if (loadedCount === imgs.length) ScrollTrigger.refresh();
          } else {
            img.addEventListener("load", () => {
              loadedCount++;
              if (loadedCount === imgs.length) ScrollTrigger.refresh();
            });
          }
        });

        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, sectionRef);
    };

    init();

    return () => {
      if (gsapCtxRef.current) {
        gsapCtxRef.current.revert();
      }
    };
  }, [getPathData]);

  const setCheckpointRef = useCallback((el, index) => {
    checkpointRefs.current[index] = el;
  }, []);

  return {
    sectionRef,
    trackRef,
    bikeRef,
    pathRef,
    racingLineRef,
    checkpointRefs,
    finishRef,
    heroTextRef,
    statsRef,
    scrollIndicatorRef,
    setCheckpointRef,
  };
}
