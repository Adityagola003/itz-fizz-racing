"use client";

import Image from "next/image";

/**
 * FinishOverlay — The "RACE WON" celebration state revealed at end of scroll.
 * Opacity is controlled by GSAP based on scroll progress (>92%).
 */
export default function FinishOverlay({ finishRef }) {
  return (
    <div
      ref={finishRef}
      id="finish-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        opacity: 0,
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse at center, rgba(232,16,42,0.12) 0%, rgba(10,10,11,0.96) 70%)",
        backdropFilter: "blur(2px)",
      }}
      aria-live="polite"
      role="status"
    >
      {/* Background checkered pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0px, #fff 10px, transparent 10px, transparent 20px), repeating-linear-gradient(-45deg, #fff 0px, #fff 10px, transparent 10px, transparent 20px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top finish stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-3"
        style={{
          background:
            "repeating-linear-gradient(90deg, #fff 0px, #fff 20px, #111 20px, #111 40px)",
        }}
      />
      {/* Bottom finish stripe */}
      <div
        className="absolute bottom-0 left-0 right-0 h-3"
        style={{
          background:
            "repeating-linear-gradient(90deg, #111 0px, #111 20px, #fff 20px, #fff 40px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Small label */}
        <div
          className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full"
          style={{
            background: "rgba(232,16,42,0.15)",
            border: "1px solid rgba(232,16,42,0.3)",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full bg-red-500"
            style={{ boxShadow: "0 0 8px #e8102a" }}
          />
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: "#e8102a", fontFamily: "Orbitron, sans-serif" }}
          >
            FINISH — 01 / 01
          </span>
        </div>

        {/* Checkered flags */}
        <div className="flex justify-center items-center gap-6 mb-6">
          <Image
            src="/icons/checkered-flag.svg"
            alt="Checkered flag"
            width={64}
            height={64}
            className="flag-wave"
            style={{ filter: "drop-shadow(0 0 12px rgba(255,255,255,0.3))" }}
          />
          <Image
            src="/icons/checkered-flag.svg"
            alt="Checkered flag"
            width={64}
            height={64}
            className="flag-wave"
            style={{
              transform: "scaleX(-1)",
              filter: "drop-shadow(0 0 12px rgba(255,255,255,0.3))",
              animationDelay: "0.1s",
            }}
          />
        </div>

        {/* RACE WON */}
        <h2
          className="font-orbitron font-black uppercase leading-none mb-4"
          style={{
            fontSize: "clamp(3rem, 10vw, 8rem)",
            color: "#ffffff",
            letterSpacing: "-0.02em",
            textShadow: "0 0 60px rgba(232,16,42,0.4)",
          }}
        >
          RACE{" "}
          <span
            style={{
              color: "#e8102a",
              textShadow: "0 0 40px rgba(232,16,42,0.8)",
            }}
          >
            WON
          </span>
        </h2>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div
            className="h-px flex-1"
            style={{ maxWidth: "80px", background: "rgba(255,255,255,0.2)" }}
          />
          <div className="w-2 h-2 rounded-full bg-red-600" />
          <div
            className="h-px flex-1"
            style={{ maxWidth: "80px", background: "rgba(255,255,255,0.2)" }}
          />
        </div>

        {/* Supporting text */}
        <p
          className="uppercase tracking-widest mb-3"
          style={{
            fontSize: "clamp(0.7rem, 2vw, 1rem)",
            color: "rgba(255,255,255,0.8)",
            fontFamily: "Orbitron, sans-serif",
            fontWeight: 500,
            letterSpacing: "0.2em",
          }}
        >
          FINISH LINE CROSSED. ITZ FIZZ TAKES THE LEAD.
        </p>

        <p
          className="text-sm"
          style={{
            color: "var(--text-muted)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Scroll up to restart the race
        </p>

        {/* Decorative particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                background: i % 3 === 0 ? "#e8102a" : "white",
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1,
                animation: `scroll-bounce ${1.5 + Math.random()}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 1}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
