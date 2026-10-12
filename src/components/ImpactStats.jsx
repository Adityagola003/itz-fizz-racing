"use client";

/**
 * ImpactStats — Four required statistics displayed in a refined horizontal grid.
 * Stats are from the original assignment and must not be removed or modified.
 */

const STATS = [
  {
    id: "stat-1",
    value: "58%",
    description: "Increase in pick up point use",
    prefix: "",
  },
  {
    id: "stat-2",
    value: "23%",
    description: "Decreased in customer phone calls",
    prefix: "",
  },
  {
    id: "stat-3",
    value: "27%",
    description: "Increase in pick up point use",
    prefix: "",
  },
  {
    id: "stat-4",
    value: "40%",
    description: "Decreased in customer phone calls",
    prefix: "",
  },
];

export default function ImpactStats({ statsRef }) {
  return (
    <div
      ref={statsRef}
      className="w-full"
      aria-label="ITZ FIZZ Impact Statistics"
    >
      {/* Section label */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px w-8 bg-red-600" />
        <span
          className="text-xs tracking-widest uppercase font-medium"
          style={{
            color: "var(--text-muted)",
            fontFamily: "Orbitron, sans-serif",
          }}
        >
          Impact Metrics
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {STATS.map((stat, i) => (
          <div
            key={stat.id}
            id={stat.id}
            className="stat-item"
            style={{
              opacity: 0, // GSAP controls entrance
              borderLeft: "2px solid",
              borderColor: i % 2 === 0 ? "#e8102a" : "rgba(255,255,255,0.1)",
              paddingLeft: "16px",
            }}
          >
            {/* Percentage */}
            <div
              className="font-orbitron font-bold leading-none mb-2 stat-glow"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                color: i % 2 === 0 ? "#e8102a" : "#ffffff",
                letterSpacing: "-0.02em",
              }}
            >
              {stat.value}
            </div>
            {/* Description */}
            <p
              className="text-xs leading-snug"
              style={{
                color: "var(--text-secondary)",
                maxWidth: "120px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
              }}
            >
              {stat.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
