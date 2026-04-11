import HexTile, { HEX_SIZE } from './HexTile';
import Port from './Port';
import { ROW_SIZES } from '../utils/constants';

const HORIZ_SPACING = Math.sqrt(3) * HEX_SIZE;
const VERT_SPACING = 1.5 * HEX_SIZE;
const MAX_COLS = Math.max(...ROW_SIZES);

function getHexCenter(row, col) {
  const cols = ROW_SIZES[row];
  const offsetX = ((MAX_COLS - cols) / 2) * HORIZ_SPACING;
  return {
    x: offsetX + col * HORIZ_SPACING + HORIZ_SPACING / 2 + 100,
    y: row * VERT_SPACING + HEX_SIZE + 80,
  };
}

export default function Board({ hexes, ports }) {
  const hexCenters = [];
  let idx = 0;
  for (let row = 0; row < ROW_SIZES.length; row++) {
    for (let col = 0; col < ROW_SIZES[row]; col++) {
      hexCenters.push(getHexCenter(row, col));
      idx++;
    }
  }

  const svgWidth = MAX_COLS * HORIZ_SPACING + 200;
  const svgHeight = (ROW_SIZES.length - 1) * VERT_SPACING + 2 * HEX_SIZE + 160;

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="board-svg"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="board-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#00000030" />
        </filter>
      </defs>

      {/* Ocean background */}
      <rect
        x="0" y="0"
        width={svgWidth} height={svgHeight}
        rx="24"
        fill="url(#oceanGradient)"
      />
      <defs>
        <radialGradient id="oceanGradient" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#4a90d9" />
          <stop offset="100%" stopColor="#1a5276" />
        </radialGradient>
      </defs>

      {/* Ports */}
      {ports.map((port, i) => {
        const center = hexCenters[port.position.hexIndex];
        return (
          <Port
            key={`port-${i}`}
            cx={center.x}
            cy={center.y}
            type={port.type}
            edge={port.position.edge}
          />
        );
      })}

      {/* Hex tiles */}
      {hexes.map((hex, i) => (
        <HexTile
          key={`hex-${i}`}
          cx={hexCenters[i].x}
          cy={hexCenters[i].y}
          terrain={hex.terrain}
          number={hex.number}
        />
      ))}
    </svg>
  );
}
