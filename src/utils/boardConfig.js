import { TERRAIN_TYPES } from './constants';

const NON_NUMBERED_TERRAINS = new Set([TERRAIN_TYPES.DESERT, TERRAIN_TYPES.SEA]);

export function buildTerrainDistribution(terrainCounts) {
  const distribution = [];
  for (const [type, count] of Object.entries(terrainCounts)) {
    for (let i = 0; i < count; i++) {
      distribution.push(type);
    }
  }
  return distribution;
}

export function buildPortDistribution(portCounts) {
  const distribution = [];
  for (const [type, count] of Object.entries(portCounts)) {
    for (let i = 0; i < count; i++) {
      distribution.push(type);
    }
  }
  return distribution;
}

const BASE_TOKENS = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

export function computeNumberTokens(nonDesertCount) {
  if (nonDesertCount <= 0) return [];
  if (nonDesertCount === BASE_TOKENS.length) return [...BASE_TOKENS];

  const tokens = [];
  // Cycle through the base token pattern, repeating as needed
  const cycle = [2, 12, 3, 11, 3, 11, 4, 10, 4, 10, 5, 9, 5, 9, 6, 8, 6, 8];
  for (let i = 0; i < nonDesertCount; i++) {
    tokens.push(cycle[i % cycle.length]);
  }
  return tokens;
}

export function getTotalHexes(rowSizes) {
  return rowSizes.reduce((sum, n) => sum + n, 0);
}

export function getTotalTerrainCount(terrainCounts) {
  return Object.values(terrainCounts).reduce((sum, n) => sum + n, 0);
}

export function getTotalPortCount(portCounts) {
  return Object.values(portCounts).reduce((sum, n) => sum + n, 0);
}

export function getNonDesertCount(terrainCounts) {
  return Object.entries(terrainCounts)
    .filter(([type]) => !NON_NUMBERED_TERRAINS.has(type))
    .reduce((sum, [, count]) => sum + count, 0);
}

export function getHexPositions(rowSizes) {
  const positions = [];
  const maxCols = Math.max(...rowSizes);
  for (let row = 0; row < rowSizes.length; row++) {
    const cols = rowSizes[row];
    const offset = (maxCols - cols) / 2;
    for (let col = 0; col < cols; col++) {
      positions.push({ row, col: col + offset });
    }
  }
  return positions;
}

/**
 * Walk the perimeter of the hex board and return evenly-spaced port positions.
 * Each position is { hexIndex, edge } where edge 0..5 corresponds to the
 * hex edge facing outward on the perimeter.
 */
export function computePortPositions(rowSizes, portCount) {
  const perimeterEdges = getPerimeterEdges(rowSizes);
  if (portCount <= 0 || perimeterEdges.length === 0) return [];

  const capped = Math.min(portCount, perimeterEdges.length);
  const spacing = perimeterEdges.length / capped;
  const positions = [];
  for (let i = 0; i < capped; i++) {
    const idx = Math.floor(i * spacing + spacing / 2) % perimeterEdges.length;
    positions.push(perimeterEdges[idx]);
  }
  return positions;
}

export function getMaxPorts(rowSizes) {
  return getPerimeterEdges(rowSizes).length;
}

// Pointy-top hex: 6 edges numbered clockwise from top-right.
// Each entry is the (row, col) offset to the neighbor that shares that edge.
//   Edge 0: top-right     (outward angle 300°)
//   Edge 1: right         (outward angle   0°)
//   Edge 2: bottom-right  (outward angle  60°)
//   Edge 3: bottom-left   (outward angle 120°)
//   Edge 4: left          (outward angle 180°)
//   Edge 5: top-left      (outward angle 240°)
const NEIGHBOR_OFFSETS = [
  { dr: -1, dc: 0.5 },
  { dr: 0,  dc: 1 },
  { dr: 1,  dc: 0.5 },
  { dr: 1,  dc: -0.5 },
  { dr: 0,  dc: -1 },
  { dr: -1, dc: -0.5 },
];

// Outward angle (SVG degrees, y-down) for each edge, matching NEIGHBOR_OFFSETS
export const EDGE_ANGLES = [300, 0, 60, 120, 180, 240];

function getPerimeterEdges(rowSizes) {
  const positions = getHexPositions(rowSizes);
  const edges = [];

  const posSet = new Set(positions.map((p) => `${p.row},${p.col}`));

  positions.forEach((pos, hexIndex) => {
    NEIGHBOR_OFFSETS.forEach((offset, edge) => {
      const nr = pos.row + offset.dr;
      const nc = pos.col + offset.dc;
      const key = `${nr},${nc}`;
      if (!posSet.has(key)) {
        edges.push({ hexIndex, edge });
      }
    });
  });

  // Sort edges clockwise around the board center for even port spacing
  const totalRows = rowSizes.length;
  const maxCols = Math.max(...rowSizes);
  const centerRow = (totalRows - 1) / 2;
  const centerCol = maxCols / 2;

  edges.sort((a, b) => {
    const pa = positions[a.hexIndex];
    const pb = positions[b.hexIndex];
    const angA = Math.atan2(pa.row - centerRow, pa.col - centerCol + NEIGHBOR_OFFSETS[a.edge].dc * 0.3);
    const angB = Math.atan2(pb.row - centerRow, pb.col - centerCol + NEIGHBOR_OFFSETS[b.edge].dc * 0.3);
    return angA - angB;
  });

  return edges;
}

/**
 * Build a symmetric hex board row layout from two parameters:
 *   topWidth   = hexes across the flat top/bottom edge
 *   sideLength = hexes along each diagonal edge between corners
 *
 * A hex board shaped like a regular hexagon has topWidth == sideLength.
 *
 * Total rows = topWidth + 2*(sideLength - 1) - (topWidth - 1) = sideLength*2 - 1  (regular)
 * For non-regular: rows = sideLength + sideLength - 1 = 2*sideLength - 1,
 *   widest row = topWidth + sideLength - 1
 *
 * Example: topWidth=3, sideLength=3  => [3, 4, 5, 4, 3]  (standard Catan)
 *          topWidth=3, sideLength=4  => [3, 4, 5, 6, 5, 4, 3]  (5-6 player)
 */
export function buildRowSizes(topWidth, sideLength) {
  const rows = [];
  for (let i = 0; i < sideLength; i++) {
    rows.push(topWidth + i);
  }
  for (let i = sideLength - 2; i >= 0; i--) {
    rows.push(topWidth + i);
  }
  return rows;
}

/**
 * Extract the topWidth and sideLength from an existing rowSizes array.
 */
export function rowSizesToShape(rowSizes) {
  if (!rowSizes || rowSizes.length === 0) return { topWidth: 3, sideLength: 3 };
  const topWidth = rowSizes[0];
  const sideLength = Math.ceil(rowSizes.length / 2);
  return { topWidth, sideLength };
}

export const RESOURCE_TYPES = [
  TERRAIN_TYPES.FOREST,
  TERRAIN_TYPES.FIELDS,
  TERRAIN_TYPES.PASTURE,
  TERRAIN_TYPES.HILLS,
  TERRAIN_TYPES.MOUNTAINS,
];

const SPECIAL_TYPES = [
  TERRAIN_TYPES.DESERT,
  TERRAIN_TYPES.GOLD,
  TERRAIN_TYPES.SEA,
];

/**
 * Auto-adjust terrain counts so they fill `targetTotal` hexes exactly.
 * Special terrains (desert, gold, sea) stay as-is.
 * Resource terrains are distributed as evenly as possible.
 */
export const MAX_PER_TERRAIN = 8;

export function autoFillTerrainCounts(terrainCounts, targetTotal) {
  const result = {};

  let fixedTotal = 0;
  for (const t of SPECIAL_TYPES) {
    const count = terrainCounts[t] ?? 0;
    if (count > 0) {
      result[t] = Math.min(count, MAX_PER_TERRAIN);
      fixedTotal += result[t];
    }
  }

  const resourceSlots = Math.max(0, targetTotal - fixedTotal);
  const perType = Math.min(MAX_PER_TERRAIN, Math.floor(resourceSlots / RESOURCE_TYPES.length));
  const remainder = resourceSlots - perType * RESOURCE_TYPES.length;

  RESOURCE_TYPES.forEach((t, i) => {
    result[t] = Math.min(MAX_PER_TERRAIN, perType + (i < remainder ? 1 : 0));
  });

  return result;
}

/**
 * Find all valid hex board shapes (topWidth, sideLength) that use exactly
 * `totalTiles` hexes. Formula: total = topWidth*(2*side - 1) + (side - 1)^2
 */
export function findValidBoardShapes(totalTiles) {
  if (totalTiles < 1) return [];
  const shapes = [];
  const maxSide = Math.ceil(Math.sqrt(totalTiles));

  for (let s = 1; s <= maxSide; s++) {
    const divisor = 2 * s - 1;
    const numerator = totalTiles - (s - 1) * (s - 1);
    if (numerator <= 0) continue;
    if (numerator % divisor !== 0) continue;
    const t = numerator / divisor;
    if (t >= 1) {
      shapes.push({
        topWidth: t,
        sideLength: s,
        rowSizes: buildRowSizes(t, s),
      });
    }
  }

  shapes.sort((a, b) => {
    const diffA = Math.abs(a.topWidth - a.sideLength);
    const diffB = Math.abs(b.topWidth - b.sideLength);
    return diffA - diffB;
  });

  return shapes;
}

export function validateConfig(config) {
  const errors = [];
  const totalHexes = getTotalHexes(config.rowSizes);
  const totalTerrain = getTotalTerrainCount(config.terrainCounts);

  if (totalTerrain !== totalHexes) {
    errors.push(
      `Terrain count (${totalTerrain}) doesn't match board size (${totalHexes} hexes)`
    );
  }

  const maxPorts = getMaxPorts(config.rowSizes);
  const totalPorts = getTotalPortCount(config.portCounts);
  if (totalPorts > maxPorts) {
    errors.push(
      `Too many ports (${totalPorts}) for board perimeter (max ${maxPorts})`
    );
  }

  if (config.rowSizes.length === 0 || config.rowSizes.some((n) => n < 1)) {
    errors.push('Row sizes must each be at least 1');
  }

  return errors;
}
