import React from "react";

export default function GeometricBackground({ className, style }) {
  const W = 938;
  const H = 634;

  // Dot grid (6x6), 8px squares, 24px spacing, ~30px margin
  const gridCols = 6;
  const gridRows = 6;
  const dotSize = 8;
  const dotSpacing = 24; // spacing between dots
  const gridMargin = 30;

  const gridRects = Array.from({ length: gridRows * gridCols }, (_, i) => {
    const r = Math.floor(i / gridCols);
    const c = i % gridCols;
    const x = gridMargin + c * (dotSize + dotSpacing);
    const y = gridMargin + r * (dotSize + dotSpacing);
    return <rect key={`d-${i}`} x={x} y={y} width={dotSize} height={dotSize} fill="#D3D3D3" rx={1.5} />;
  });

  // Wavy line parameters - smooth sine wave pattern
  const waveAmplitude = 12  ; // horizontal amplitude of the wave
  const waveFrequency = 12; // number of complete waves
  const waveHeight = H * 0.3  ; // vertical height of the wave
  const yStart = H / 2 - waveHeight / 2.5;
  const numPoints = 100; // smooth curve with many points

  const makeWavePoints = (centerX, reverse = false) => {
    const points = [];
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints; // 0 to 1
      const y = yStart + t * waveHeight;
      // Sine wave pattern
      const phase = t * waveFrequency * Math.PI * 2;
      const x = centerX + (reverse ? -1 : 1) * Math.sin(phase) * waveAmplitude;
      points.push([x, y]);
    }
    return points;
  };

  const leftCenterX = 40; // near center-left
  const rightCenterX = W - 30; // near center-right (mirrored)

  const leftPoints = makeWavePoints(leftCenterX, false);
  const rightPoints = makeWavePoints(rightCenterX, true);

  const toPointsAttr = (pts) => pts.map((p) => p.join(",")).join(" ");

  const leftTop = leftPoints[0];
  const leftBottom = leftPoints[leftPoints.length - 1];
  const rightTop = rightPoints[0];
  const rightBottom = rightPoints[rightPoints.length - 1];

  return (
    <svg
      className={className}
      style={style}
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Geometric background with dot grid, quarter circles, and mirrored wavy lines"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Group 1: Dot grid */}
      <g id="dot-grid">{gridRects}</g>

      {/* Group 2: Top-right quarter circle (200x200),rgb(81, 255, 0), touching top and right edges */}
      <g id="quarter-top-right">
        <path
          d={`M ${W - 200} 0 A 200 200 0 0 1 ${W} 200 L ${W} 0 Z`}
          fill="#D9EDD0"
        />
      </g>

      {/* Group 3: Bottom-left quarter circle (100x100),rgb(255, 0, 0), touching bottom and left edges */}
      <g id="quarter-bottom-left">
        <path
          d={`M 0 ${H - 100} A 100 100 0 0 0 100 ${H} L 0 ${H} Z`}
          fill="#D9EDD0"
        />
      </g>

      {/* Group 4: Wavy lines (sine waves) and circles (mirrored) */}
      <g id="wavy-lines">
        {/* Left wavy line - smooth sine wave, vertically centered */}
        <polyline
          points={toPointsAttr(leftPoints)}
          fill="none"
          stroke="#D0E0F0"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Top circle - connected to top-most point */}
        <circle cx={leftTop[0]} cy={leftTop[1]} r={5} fill="#FFC070" />
        {/* Bottom circle - connected to bottom-most point */}
        <circle cx={leftBottom[0]} cy={leftBottom[1]} r={5} fill="#FFC070" />

        {/* Right wavy line (mirrored) - smooth sine wave, vertically centered */}
        <polyline
          points={toPointsAttr(rightPoints)}
          fill="none"
          stroke="#D0E0F0"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Top circle - connected to top-most point */}
        <circle cx={rightTop[0]} cy={rightTop[1]} r={5} fill="#FFC070" />
        {/* Bottom circle - connected to bottom-most point */}
        <circle cx={rightBottom[0]} cy={rightBottom[1]} r={5} fill="#FFC070" />
      </g>
    </svg>
  );
}

