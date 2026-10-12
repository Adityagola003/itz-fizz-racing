"use client";

import Image from "next/image";

/**
 * RacingBike — The motorcycle that moves along the track.
 * Position is controlled by the useRaceAnimation hook via GSAP.
 * Absolutely positioned within the track canvas.
 */
export default function RacingBike({ bikeRef }) {
  return (
    <div
      ref={bikeRef}
      id="racing-bike"
      className="absolute z-20 bike-shadow"
      style={{
        width: "clamp(120px, 18vw, 240px)",
        opacity: 0, // GSAP will fade in
        transformOrigin: "center center",
        willChange: "transform, opacity",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <Image
        src="/images/racing-bike.jpg"
        alt="ITZ FIZZ Racing Superbike"
        width={480}
        height={270}
        priority
        style={{
          width: "100%",
          height: "auto",
          objectFit: "contain",
          display: "block",
        }}
      />
      {/* Ground shadow */}
      <div
        style={{
          position: "absolute",
          bottom: "-6px",
          left: "10%",
          width: "80%",
          height: "8px",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)",
          filter: "blur(4px)",
        }}
      />
    </div>
  );
}
