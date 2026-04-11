import { PORT_LABELS, PORT_COLORS } from '../utils/constants';
import { EDGE_ANGLES } from '../utils/boardConfig';
import { HEX_SIZE } from './HexTile';

function cornerAngle(i) {
  return ((60 * i - 30) * Math.PI) / 180;
}

const EDGE_CORNERS = [
  [5, 0], // edge 0: top-right
  [0, 1], // edge 1: right
  [1, 2], // edge 2: bottom-right
  [2, 3], // edge 3: bottom-left
  [3, 4], // edge 4: left
  [4, 5], // edge 5: top-left
];

const OUTSET = HEX_SIZE * 0.52;
const TIP_OUTSET = HEX_SIZE * 0.75;
const INSET = 0.2;

export default function Port({ cx, cy, type, edge }) {
  const [c1, c2] = EDGE_CORNERS[edge];
  const a1 = cornerAngle(c1);
  const a2 = cornerAngle(c2);

  const p1x = cx + HEX_SIZE * Math.cos(a1);
  const p1y = cy + HEX_SIZE * Math.sin(a1);
  const p2x = cx + HEX_SIZE * Math.cos(a2);
  const p2y = cy + HEX_SIZE * Math.sin(a2);

  const edgeRad = (Math.PI / 180) * EDGE_ANGLES[edge];
  const outX = Math.cos(edgeRad);
  const outY = Math.sin(edgeRad);

  // Inset the base corners slightly along the edge so the shape narrows
  const dx = (p2x - p1x) * INSET;
  const dy = (p2y - p1y) * INSET;

  // Two shoulder points pushed outward from the inset base corners
  const s1x = p1x + dx + outX * OUTSET;
  const s1y = p1y + dy + outY * OUTSET;
  const s2x = p2x - dx + outX * OUTSET;
  const s2y = p2y - dy + outY * OUTSET;

  // Tip point: center pushed furthest outward
  const midX = (p1x + p2x) / 2;
  const midY = (p1y + p2y) / 2;
  const tipX = midX + outX * TIP_OUTSET;
  const tipY = midY + outY * TIP_OUTSET;

  const points = `${p1x},${p1y} ${s1x},${s1y} ${tipX},${tipY} ${s2x},${s2y} ${p2x},${p2y}`;

  const TEXT_OUTSET = TIP_OUTSET + HEX_SIZE * 0.3;
  const labelX = midX + outX * TEXT_OUTSET;
  const labelY = midY + outY * TEXT_OUTSET;

  const label = PORT_LABELS[type];

  return (
    <g className="port">
      <polygon
        points={points}
        fill={PORT_COLORS[type]}
        stroke="#6d5c3d"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <text
        x={labelX}
        y={labelY}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="22"
        fontWeight="bold"
        fill="#3e2723"
      >
        {label}
      </text>
    </g>
  );
}
