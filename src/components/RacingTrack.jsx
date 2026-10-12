"use client";

/**
 * RacingTrack — The SVG racing circuit with path, racing line, and checkpoint markers.
 * The SVG viewBox is 800×500. The path is designed as a flowing racing circuit.
 * pathRef → the ghost path used for getPointAtLength calculations
 * racingLineRef → the visible animated stroke that draws as the bike progresses
 */
export default function RacingTrack({
  pathRef,
  racingLineRef,
  setCheckpointRef,
}) {
  // Circuit path: starts bottom-left, sweeps through 3 checkpoint zones, ends top-right
  // Designed to be visually interesting — sweeping S-curves and banking corners
  const circuitPath =
    "M 60,420 C 60,420 120,420 180,400 C 240,380 260,320 280,280 C 300,240 310,200 340,180 C 370,160 420,165 460,175 C 500,185 530,210 550,240 C 570,270 570,310 580,340 C 590,370 610,390 640,390 C 670,390 700,370 720,340 C 740,310 740,260 730,220 C 720,180 690,150 660,130 C 630,110 590,105 550,110 C 510,115 470,130 440,150 C 410,170 380,200 360,230 C 340,260 330,300 310,330 C 290,360 260,390 230,405 C 200,420 160,425 120,425 C 80,425 40,415 30,400";

  // Checkpoint positions along the path (approximate SVG coordinates)
  const checkpoints = [
    { cx: 340, cy: 178, label: "CHECKPOINT 01", fraction: 0.3 },
    { cx: 580, cy: 342, label: "CHECKPOINT 02", fraction: 0.56 },
    { cx: 730, cy: 218, label: "CHECKPOINT 03", fraction: 0.78 },
  ];

  return (
    <div className="absolute inset-0 w-full h-full" aria-hidden="true">
      <svg
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
        style={{ overflow: "visible" }}
      >
        {/* ── Track definitions ── */}
        <defs>
          <filter id="track-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="red-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="startGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e8102a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#e8102a" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* ── Wide track surface (asphalt) ── */}
        <path
          d={circuitPath}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="56"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ── Track edge lines ── */}
        <path
          d={circuitPath}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="58"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="8 12"
        />

        {/* ── Center dashed line ── */}
        <path
          d={circuitPath}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="20 15"
        />

        {/* ── Ghost path (used by getPointAtLength, invisible) ── */}
        <path
          ref={pathRef}
          id="race-path"
          d={circuitPath}
          fill="none"
          stroke="transparent"
          strokeWidth="0"
        />

        {/* ── Animated racing line (red, draws on scroll) ── */}
        <path
          ref={racingLineRef}
          d={circuitPath}
          fill="none"
          stroke="#e8102a"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#red-glow)"
          style={{
            strokeDasharray: 10000,
            strokeDashoffset: 10000,
          }}
        />

        {/* ── Start marker ── */}
        <g transform="translate(60, 420)">
          <circle r="10" fill="#e8102a" opacity="0.9" />
          <circle r="14" fill="none" stroke="#e8102a" strokeWidth="1.5" opacity="0.4" />
          <text
            x="0"
            y="-18"
            textAnchor="middle"
            fill="white"
            fontSize="9"
            fontFamily="Orbitron, sans-serif"
            fontWeight="600"
            letterSpacing="1"
          >
            START
          </text>
        </g>

        {/* ── Finish line (end of path near x=30, y=400) ── */}
        <g transform="translate(30, 400)">
          {/* Checkered finish line */}
          <rect x="-3" y="-30" width="8" height="60" fill="white" opacity="0.9" rx="2" />
          <rect x="-3" y="-30" width="4" height="10" fill="black" opacity="0.9" />
          <rect x="-3" y="-10" width="4" height="10" fill="black" opacity="0.9" />
          <rect x="-3" y="10" width="4" height="10" fill="black" opacity="0.9" />
          <rect x="1" y="-20" width="4" height="10" fill="black" opacity="0.9" />
          <rect x="1" y="0" width="4" height="10" fill="black" opacity="0.9" />
          <rect x="1" y="20" width="4" height="10" fill="black" opacity="0.9" />
          <text
            x="18"
            y="-18"
            textAnchor="start"
            fill="white"
            fontSize="8"
            fontFamily="Orbitron, sans-serif"
            fontWeight="700"
            letterSpacing="1.5"
          >
            FINISH
          </text>
        </g>

        {/* ── Checkpoint markers ── */}
        {checkpoints.map((cp, i) => (
          <g
            key={i}
            ref={(el) => setCheckpointRef(el, i)}
            data-active="false"
            style={{ transition: "opacity 0.3s" }}
          >
            {/* Outer ring */}
            <circle
              cx={cp.cx}
              cy={cp.cy}
              r="16"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              className="cp-ring"
            />
            {/* Inner dot */}
            <circle
              cx={cp.cx}
              cy={cp.cy}
              r="8"
              fill="#1e1e24"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.5"
              className="cp-dot"
            />
            {/* Number */}
            <text
              x={cp.cx}
              y={cp.cy + 4}
              textAnchor="middle"
              fill="rgba(255,255,255,0.5)"
              fontSize="7"
              fontFamily="Orbitron, sans-serif"
              fontWeight="700"
              className="cp-num"
            >
              {String(i + 1).padStart(2, "0")}
            </text>
            {/* Label — positioned to avoid overlap */}
            <text
              x={cp.cx + (i === 0 ? 22 : i === 1 ? -22 : 22)}
              y={cp.cy - 22}
              textAnchor={i === 1 ? "end" : "start"}
              fill="rgba(255,255,255,0.35)"
              fontSize="7"
              fontFamily="Orbitron, sans-serif"
              fontWeight="600"
              letterSpacing="1"
              className="cp-label"
            >
              {cp.label}
            </text>
          </g>
        ))}

        {/* ── Track direction arrows ── */}
        {[0.15, 0.42, 0.68].map((frac, i) => (
          <g key={`arrow-${i}`} opacity="0.2">
            <polygon
              points="0,-5 10,0 0,5"
              fill="white"
              transform={`translate(${
                frac < 0.4 ? 200 + frac * 300 : frac < 0.6 ? 580 : 660
              }, ${
                frac < 0.4 ? 300 - frac * 200 : frac < 0.6 ? 360 : 200
              })`}
            />
          </g>
        ))}
      </svg>

      {/* CSS for checkpoint active state */}
      <style>{`
        [data-active="true"] .cp-ring {
          stroke: #e8102a;
          opacity: 1;
          filter: drop-shadow(0 0 6px rgba(232,16,42,0.8));
        }
        [data-active="true"] .cp-dot {
          fill: #e8102a;
          stroke: #ff4060;
        }
        [data-active="true"] .cp-num {
          fill: white;
        }
        [data-active="true"] .cp-label {
          fill: rgba(232,16,42,0.9);
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
