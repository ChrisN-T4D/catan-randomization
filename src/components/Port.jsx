import { PORT_LABELS, PORT_COLORS, PORT_TYPES } from '../utils/constants';
import { HEX_SIZE } from './HexTile';

const EDGE_ANGLES = [270, 330, 30, 90, 150, 210]; // degrees for edges 0-5 (pointy-top)

export default function Port({ cx, cy, type, edge }) {
  const angle = EDGE_ANGLES[edge];
  const rad = (Math.PI / 180) * angle;
  const dist = HEX_SIZE + 28;

  const px = cx + dist * Math.cos(rad);
  const py = cy + dist * Math.sin(rad);

  const midX = cx + (HEX_SIZE * 0.82) * Math.cos(rad);
  const midY = cy + (HEX_SIZE * 0.82) * Math.sin(rad);

  const label = PORT_LABELS[type];
  const isGeneric = type === PORT_TYPES.GENERIC;

  return (
    <g className="port">
      <line
        x1={midX}
        y1={midY}
        x2={px}
        y2={py}
        stroke="#6d5c3d"
        strokeWidth="2"
        strokeDasharray="4,3"
        opacity="0.6"
      />
      <rect
        x={px - 22}
        y={py - 12}
        width="44"
        height="24"
        rx="5"
        fill={PORT_COLORS[type]}
        stroke="#6d5c3d"
        strokeWidth="1.5"
      />
      <text
        x={px}
        y={py + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={isGeneric ? '12' : '10'}
        fontWeight="bold"
        fill="#3e2723"
      >
        {label}
      </text>
    </g>
  );
}
