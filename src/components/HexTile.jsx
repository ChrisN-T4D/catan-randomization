import { TERRAIN_COLORS, TERRAIN_ICONS, TERRAIN_LABELS } from '../utils/constants';

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

export default function HexTile({ cx, cy, terrain, number }) {
  const fill = TERRAIN_COLORS[terrain];
  const icon = TERRAIN_ICONS[terrain];
  const label = TERRAIN_LABELS[terrain];
  const isHighProb = number === 6 || number === 8;

  const dotCount = number ? (number <= 7 ? number - 1 : 13 - number) : 0;

  return (
    <g className="hex-tile">
      <polygon
        points={hexPoints(cx, cy, HEX_SIZE)}
        fill={fill}
        stroke="#5c4a32"
        strokeWidth="2.5"
      />
      <polygon
        points={hexPoints(cx, cy, HEX_SIZE - 3)}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
      />

      <text
        x={cx}
        y={cy - 12}
        textAnchor="middle"
        fontSize="20"
        className="hex-icon"
      >
        {icon}
      </text>

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

      {!number && (
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
