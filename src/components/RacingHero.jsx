"use client";

import ImpactStats from "./ImpactStats";
import RacingTrack from "./RacingTrack";
import RacingBike from "./RacingBike";

/**
 * RacingHero — The full-screen scroll-driven section.
 * Contains the hero text, statistics, track SVG, and bike.
 * The section has a large scrollable height to drive the GSAP animation.
 */
export default function RacingHero({
  sectionRef,
  stickyRef,
  trackRef,
  bikeRef,
  pathRef,
  racingLineRef,
  finishRef,
  heroTextRef,
  statsRef,
  scrollIndicatorRef,
  setCheckpointRef,
}) {
  // Split "WELCOME ITZ FIZZ" into individual characters for stagger animation
  const headline = "WELCOME ITZ FIZZ";
  const words = headline.split(" ");

  return (
    <>
      {/* ═══════════════════════════════════════
          SCROLLABLE OUTER SECTION
          Height determines scroll distance for race
      ════════════════════════════════════════ */}
      <section
        ref={sectionRef}
        id="race-section"
        className="race-section racing-grid"
        style={{
          height: "600vh", // long scroll distance for the full race
          position: "relative",
          background: "var(--bg-primary)",
          opacity: 0, // GSAP fades in on entrance
        }}
        aria-label="ITZ FIZZ Racing Experience"
      >
        {/* ─── STICKY CANVAS ─── */}
        <div
          ref={stickyRef}
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            overflow: "hidden",
          }}
        >
          {/* Ambient background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(232,16,42,0.06) 0%, transparent 70%)",
            }}
          />

          {/* Top racing stripe */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "rgba(232,16,42,0.4)" }}
          />

          {/* ─── TRACK SVG LAYER ─── */}
          <div
            ref={trackRef}
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 1 }}
          >
            <RacingTrack
              pathRef={pathRef}
              racingLineRef={racingLineRef}
              setCheckpointRef={setCheckpointRef}
            />
          </div>

          {/* ─── BIKE LAYER ─── */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 20, pointerEvents: "none" }}
          >
            <RacingBike bikeRef={bikeRef} />
          </div>

          {/* ─── HERO CONTENT LAYER ─── */}
          <div
            className="absolute inset-0 flex flex-col justify-between"
            style={{ zIndex: 30, pointerEvents: "none" }}
          >
            {/* ── TOP HEADER ── */}
            <header className="flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8">
              {/* Brand label */}
              <div className="flex items-center gap-3" style={{ pointerEvents: "auto" }}>
                <div
                  className="w-6 h-6 rounded flex items-center justify-center"
                  style={{ background: "#e8102a" }}
                >
                  <span
                    style={{
                      color: "white",
                      fontSize: "8px",
                      fontWeight: 900,
                      fontFamily: "Orbitron, sans-serif",
                      letterSpacing: "0.5px",
                    }}
                  >
                    IF
                  </span>
                </div>
                <span
                  className="text-xs tracking-widest uppercase hidden sm:block"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "Orbitron, sans-serif",
                  }}
                >
                  ITZ FIZZ Racing Division
                </span>
              </div>

              {/* Race status indicator */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hidden sm:flex"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full bg-red-500"
                  style={{ boxShadow: "0 0 6px #e8102a" }}
                />
                <span
                  className="text-xs tracking-wider"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "Orbitron, sans-serif",
                    fontSize: "10px",
                  }}
                >
                  RACE READY
                </span>
              </div>
            </header>

            {/* ── MAIN HERO TEXT ── */}
            <div className="flex-1 flex items-center">
              <div className="px-6 md:px-10 lg:px-14 w-full max-w-5xl">
                {/* Pre-headline */}
                <div
                  className="flex items-center gap-3 mb-4"
                  ref={heroTextRef}
                  style={{ opacity: 0 }}
                >
                  <div className="h-px w-10 bg-red-600" style={{ flexShrink: 0 }} />
                  <span
                    className="text-xs tracking-widest uppercase"
                    style={{
                      color: "#e8102a",
                      fontFamily: "Orbitron, sans-serif",
                    }}
                  >
                    The Race Experience
                  </span>
                </div>

                {/* WELCOME ITZ FIZZ — main headline */}
                <h1
                  className="font-orbitron font-black uppercase leading-none mb-8"
                  style={{
                    fontSize: "clamp(2.2rem, 7vw, 7rem)",
                    letterSpacing: "-0.02em",
                    color: "white",
                  }}
                  aria-label="Welcome ITZ FIZZ"
                >
                  {words.map((word, wi) => (
                    <span
                      key={wi}
                      className="inline-block mr-4"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {word.split("").map((char, ci) => (
                        <span
                          key={ci}
                          className="hero-char inline-block"
                          style={{
                            color:
                              wi === 1 || wi === 2
                                ? "#e8102a"
                                : "white",
                          }}
                        >
                          {char}
                        </span>
                      ))}
                    </span>
                  ))}
                </h1>

                {/* Stats */}
                <ImpactStats statsRef={statsRef} />
              </div>
            </div>

            {/* ── SCROLL INDICATOR ── */}
            <div
              ref={scrollIndicatorRef}
              className="flex flex-col items-center pb-8 gap-3"
              style={{ opacity: 0 }}
            >
              <span
                className="text-xs tracking-widest uppercase"
                style={{
                  color: "var(--text-muted)",
                  fontFamily: "Orbitron, sans-serif",
                  letterSpacing: "0.2em",
                  fontSize: "10px",
                }}
              >
                Scroll to Start the Race
              </span>
              <div className="flex flex-col items-center gap-1 scroll-bounce">
                <div
                  className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1"
                  style={{ borderColor: "rgba(255,255,255,0.3)" }}
                >
                  <div
                    className="w-1 h-2 rounded-full"
                    style={{ background: "#e8102a" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ─── CORNER DETAILS ─── */}
          {/* Top-left corner bracket */}
          <div className="absolute top-6 left-6 pointer-events-none" style={{ zIndex: 5 }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                borderTop: "2px solid rgba(232,16,42,0.4)",
                borderLeft: "2px solid rgba(232,16,42,0.4)",
              }}
            />
          </div>
          {/* Top-right corner bracket */}
          <div className="absolute top-6 right-6 pointer-events-none" style={{ zIndex: 5 }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                borderTop: "2px solid rgba(232,16,42,0.4)",
                borderRight: "2px solid rgba(232,16,42,0.4)",
              }}
            />
          </div>
          {/* Bottom-left corner bracket */}
          <div className="absolute bottom-6 left-6 pointer-events-none" style={{ zIndex: 5 }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                borderBottom: "2px solid rgba(232,16,42,0.4)",
                borderLeft: "2px solid rgba(232,16,42,0.4)",
              }}
            />
          </div>
          {/* Bottom-right corner bracket */}
          <div className="absolute bottom-6 right-6 pointer-events-none" style={{ zIndex: 5 }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                borderBottom: "2px solid rgba(232,16,42,0.4)",
                borderRight: "2px solid rgba(232,16,42,0.4)",
              }}
            />
          </div>

          {/* Side progress bar */}
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
            style={{ zIndex: 10 }}
          >
            <div
              style={{
                width: "2px",
                height: "60px",
                background: "rgba(255,255,255,0.06)",
                position: "relative",
                borderRadius: "1px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "#e8102a",
                  borderRadius: "1px",
                  height: "30%",
                }}
              />
            </div>
          </div>
        </div>

        {/* ─── RACE STAGE LABELS ─── */}
        {/* These float over different scroll sections to label each stage */}
        {[
          { top: "15%", label: "STAGE 01", sub: "Starting Grid" },
          { top: "32%", label: "STAGE 02", sub: "Race Begins" },
          { top: "52%", label: "STAGE 03", sub: "Mid-Race" },
          { top: "72%", label: "STAGE 04", sub: "Final Stretch" },
          { top: "88%", label: "STAGE 05", sub: "Finish Line" },
        ].map((stage, i) => (
          <div
            key={i}
            className="absolute right-6 md:right-10"
            style={{ top: stage.top, zIndex: 2 }}
          >
            <div
              className="text-right hidden md:block"
              style={{
                opacity: 0.25,
                fontFamily: "Orbitron, sans-serif",
              }}
            >
              <div
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: "#e8102a", fontSize: "8px" }}
              >
                {stage.label}
              </div>
              <div className="text-xs tracking-wider" style={{ color: "white", fontSize: "10px" }}>
                {stage.sub}
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
