import { TERRAIN_COLORS, TERRAIN_ICONS, TERRAIN_LABELS, TERRAIN_TYPES } from '../utils/constants';

const HEX_SIZE = 52;

function hexCorner(cx, cy, size, i) {
  const angleDeg = 60 * i - 30;
  const angleRad = (Math.PI / 180) * angleDeg;
  return {
    x: cx + size * Math.cos(angleRad),
    y: cy + size * Math.sin(angleRad),
  };
}

function hexPoints(cx, cy, size) {
  return Array.from({ length: 6 }, (_, i) => {
    const corner = hexCorner(cx, cy, size, i);
    return `${corner.x},${corner.y}`;
  }).join(' ');
}

export default function HexTile({ cx, cy, terrain, number, hasPort }) {
  const fill = TERRAIN_COLORS[terrain];
  const icon = TERRAIN_ICONS[terrain];
  const label = TERRAIN_LABELS[terrain];
  const isHighProb = number === 6 || number === 8;
  const isGold = terrain === TERRAIN_TYPES.GOLD;
  const isSea = terrain === TERRAIN_TYPES.SEA;
  const hideLabel = isSea && hasPort;

  const dotCount = number ? (number <= 7 ? number - 1 : 13 - number) : 0;

  const goldId = isGold ? `gold-grad-${cx}-${cy}` : null;

  return (
    <g className="hex-tile">
      {isGold && (
        <defs>
          <radialGradient id={goldId} cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fff8b0" />
            <stop offset="40%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#b8860b" />
          </radialGradient>
        </defs>
      )}
      <polygon
        points={hexPoints(cx, cy, HEX_SIZE)}
        fill={isGold ? `url(#${goldId})` : fill}
        stroke={isGold ? '#b8860b' : '#5c4a32'}
        strokeWidth={isGold ? 3.5 : 2.5}
      />
      <polygon
        points={hexPoints(cx, cy, HEX_SIZE - 3)}
        fill="none"
        stroke={isGold ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'}
        strokeWidth={isGold ? 1.5 : 1}
      />
      {isGold && (
        <>
          <line x1={cx - 8} y1={cy - 22} x2={cx - 5} y2={cy - 16} stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
          <line x1={cx + 14} y1={cy - 10} x2={cx + 10} y2={cy - 6} stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
          <line x1={cx - 16} y1={cy + 4} x2={cx - 12} y2={cy + 8} stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        </>
      )}

      {!hideLabel && (
        <text
          x={cx}
          y={cy - 12}
          textAnchor="middle"
          fontSize="20"
          className="hex-icon"
        >
          {icon}
        </text>
      )}

      {number && (
        <>
          <circle
            cx={cx}
            cy={cy + 10}
            r="16"
            fill="#faf3e0"
            stroke={isHighProb ? '#d32f2f' : '#8b7355'}
            strokeWidth={isHighProb ? 2.5 : 1.5}
          />
          <text
            x={cx}
            y={cy + 11}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="16"
            fontWeight="bold"
            fill={isHighProb ? '#d32f2f' : '#3e2723'}
            className="number-text"
          >
            {number}
          </text>
          <text
            x={cx}
            y={cy + 23}
            textAnchor="middle"
            fontSize="6"
            fill={isHighProb ? '#d32f2f' : '#8b7355'}
          >
            {'•'.repeat(dotCount)}
          </text>
        </>
      )}

      {!number && !hideLabel && (
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="#8b7355"
          className="terrain-label"
        >
          {label}
        </text>
      )}
    </g>
  );
}

export { HEX_SIZE };
