import { useMemo } from 'react';
import HexTile, { HEX_SIZE } from './HexTile';
import Port from './Port';

const HORIZ_SPACING = Math.sqrt(3) * HEX_SIZE;
const VERT_SPACING = 1.5 * HEX_SIZE;

const PAD = 140;

function getHexCenter(row, col, rowSizes) {
  const maxCols = Math.max(...rowSizes);
  const cols = rowSizes[row];
  const offsetX = ((maxCols - cols) / 2) * HORIZ_SPACING;
  return {
    x: offsetX + col * HORIZ_SPACING + HORIZ_SPACING / 2 + PAD,
    y: row * VERT_SPACING + HEX_SIZE + PAD,
  };
}

export default function Board({ hexes, ports, rowSizes }) {
  const maxCols = Math.max(...rowSizes);

  const hexCenters = useMemo(() => {
    const centers = [];
    for (let row = 0; row < rowSizes.length; row++) {
      for (let col = 0; col < rowSizes[row]; col++) {
        centers.push(getHexCenter(row, col, rowSizes));
      }
    }
    return centers;
  }, [rowSizes]);

  const portedHexes = useMemo(() => {
    const set = new Set();
    for (const port of ports) {
      if (port.position.seaHex >= 0) set.add(port.position.seaHex);
    }
    return set;
  }, [ports]);

  const svgWidth = maxCols * HORIZ_SPACING + PAD * 2;
  const svgHeight = (rowSizes.length - 1) * VERT_SPACING + 2 * HEX_SIZE + PAD * 2;

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
        <radialGradient id="oceanGradient" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#4a90d9" />
          <stop offset="100%" stopColor="#1a5276" />
        </radialGradient>
      </defs>

      <rect
        x="0" y="0"
        width={svgWidth} height={svgHeight}
        rx="24"
        fill="url(#oceanGradient)"
      />

      {hexes.map((hex, i) => (
        <HexTile
          key={`hex-${i}`}
          cx={hexCenters[i]?.x}
          cy={hexCenters[i]?.y}
          terrain={hex.terrain}
          number={hex.number}
          hasPort={portedHexes.has(i)}
        />
      ))}

      {ports.map((port, i) => {
        const center = hexCenters[port.position.hexIndex];
        if (!center) return null;
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
    </svg>
  );
}
