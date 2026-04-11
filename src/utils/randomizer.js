import { NON_NUMBERED_TERRAINS, TERRAIN_TYPES } from './constants';
import {
  buildTerrainDistribution,
  buildPortDistribution,
  computeNumberTokens,
  getHexPositions,
  getNonDesertCount,
  getTotalPortCount,
  EDGE_ANGLES,
} from './boardConfig';

const NEIGHBOR_OFFSETS = [
  { dr: -1, dc: 0.5 },
  { dr: 0,  dc: 1 },
  { dr: 1,  dc: 0.5 },
  { dr: 1,  dc: -0.5 },
  { dr: 0,  dc: -1 },
  { dr: -1, dc: -0.5 },
];

function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function buildAdjacencyMap(rowSizes) {
  const positions = getHexPositions(rowSizes);
  const map = {};

  for (let i = 0; i < positions.length; i++) {
    map[i] = [];
    for (let j = 0; j < positions.length; j++) {
      if (i === j) continue;
      const dx = positions[i].col - positions[j].col;
      const dy = positions[i].row - positions[j].row;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 1.5) {
        map[i].push(j);
      }
    }
  }
  return map;
}

function hasAdjacentHighNumbers(hexes, adjacencyMap) {
  for (let i = 0; i < hexes.length; i++) {
    if (hexes[i].number === 6 || hexes[i].number === 8) {
      for (const neighbor of adjacencyMap[i]) {
        if (hexes[neighbor].number === 6 || hexes[neighbor].number === 8) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Get island sizes — returns an array of land-group sizes.
 */
function getLandIslandSizes(terrains, adjacencyMap) {
  const visited = new Set();
  const sizes = [];

  for (let i = 0; i < terrains.length; i++) {
    if (terrains[i] === TERRAIN_TYPES.SEA || visited.has(i)) continue;
    let size = 0;
    const stack = [i];
    while (stack.length > 0) {
      const cur = stack.pop();
      if (visited.has(cur)) continue;
      visited.add(cur);
      size++;
      for (const neighbor of adjacencyMap[cur]) {
        if (!visited.has(neighbor) && terrains[neighbor] !== TERRAIN_TYPES.SEA) {
          stack.push(neighbor);
        }
      }
    }
    sizes.push(size);
  }
  return sizes;
}

/**
 * Score a terrain layout for island preference.
 *   islandBias > 0 → more islands (higher = stronger)
 *   islandBias < 0 → fewer islands (lower = stronger)
 *   islandBias = 0 → no bias (random)
 *   smallIslands  → if false, penalize islands of size 1-2
 */
function scoreLayout(terrains, adjacencyMap, islandBias, smallIslands) {
  const sizes = getLandIslandSizes(terrains, adjacencyMap);
  if (sizes.length === 0) return 0;

  const strength = Math.abs(islandBias);
  const count = sizes.length;
  let score;

  if (islandBias > 0) {
    const largest = Math.max(...sizes);
    const avgSize = sizes.reduce((a, b) => a + b, 0) / count;
    score = count * (5 + strength * 5) - largest * (1 + strength * 2) - avgSize * (1 + strength);
  } else {
    score = -count * (5 + strength * 5);
  }

  if (!smallIslands) {
    const tinyCount = sizes.filter((s) => s <= 2).length;
    score -= tinyCount * 20;
  }

  return score;
}

/**
 * Place terrains with island preference using actual connectivity.
 * Uses a multi-pass hill-climbing approach with restarts.
 *   islandBias > 0 → many small land patches separated by sea
 *   islandBias < 0 → connect all land together
 */
function placeTerrainWithBias(allTerrains, rowSizes, islandBias, smallIslands) {
  const seaCount = allTerrains.filter((t) => t === TERRAIN_TYPES.SEA).length;
  if (seaCount === 0) return shuffle(allTerrains);

  const adjacencyMap = buildAdjacencyMap(rowSizes);
  const RESTARTS = 5;
  const SWAPS_PER_RESTART = Math.max(allTerrains.length * 6, 200);

  let bestResult = null;
  let bestScore = -Infinity;

  for (let restart = 0; restart < RESTARTS; restart++) {
    const result = shuffle(allTerrains);

    const seaIndices = [];
    const landIndices = [];
    for (let i = 0; i < result.length; i++) {
      if (result[i] === TERRAIN_TYPES.SEA) seaIndices.push(i);
      else landIndices.push(i);
    }

    let currentScore = scoreLayout(result, adjacencyMap, islandBias, smallIslands);

    for (let attempt = 0; attempt < SWAPS_PER_RESTART; attempt++) {
      const si = seaIndices[Math.floor(Math.random() * seaIndices.length)];
      const li = landIndices[Math.floor(Math.random() * landIndices.length)];

      [result[si], result[li]] = [result[li], result[si]];
      const newScore = scoreLayout(result, adjacencyMap, islandBias, smallIslands);

      if (newScore >= currentScore) {
        currentScore = newScore;
        seaIndices[seaIndices.indexOf(si)] = li;
        landIndices[landIndices.indexOf(li)] = si;
      } else {
        [result[si], result[li]] = [result[li], result[si]];
      }
    }

    if (currentScore > bestScore) {
      bestScore = currentScore;
      bestResult = [...result];
    }
  }

  return bestResult;
}


function computeWaterPortPositions(rowSizes, terrains, portCount) {
  const positions = getHexPositions(rowSizes);
  const posSet = new Set(positions.map((p) => `${p.row},${p.col}`));
  const posIndex = {};
  positions.forEach((p, i) => { posIndex[`${p.row},${p.col}`] = i; });

  const WATER = new Set([TERRAIN_TYPES.SEA]);
  // Each edge records the sea hex it points into (or -1 for off-board perimeter)
  const waterEdges = [];

  positions.forEach((pos, hexIdx) => {
    const isWater = WATER.has(terrains[hexIdx]);
    const isLand = !isWater;

    NEIGHBOR_OFFSETS.forEach((offset, edge) => {
      const nr = pos.row + offset.dr;
      const nc = pos.col + offset.dc;
      const nKey = `${nr},${nc}`;
      const neighborExists = posSet.has(nKey);

      if (isLand && !neighborExists) {
        waterEdges.push({ hexIndex: hexIdx, edge, seaHex: -1 });
      } else if (neighborExists) {
        const ni = posIndex[nKey];
        const neighborIsWater = WATER.has(terrains[ni]);
        if (neighborIsWater && isLand) {
          waterEdges.push({ hexIndex: hexIdx, edge, seaHex: ni });
        }
      }
    });
  });

  const seen = new Set();
  const uniqueEdges = waterEdges.filter((e) => {
    const k = `${e.hexIndex}-${e.edge}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  const totalRows = rowSizes.length;
  const maxCols = Math.max(...rowSizes);
  const centerRow = (totalRows - 1) / 2;
  const centerCol = maxCols / 2;

  uniqueEdges.sort((a, b) => {
    const pa = positions[a.hexIndex];
    const pb = positions[b.hexIndex];
    const angleA = Math.atan2(pa.row - centerRow, pa.col - centerCol) + (EDGE_ANGLES[a.edge] * Math.PI) / 180 / 100;
    const angleB = Math.atan2(pb.row - centerRow, pb.col - centerCol) + (EDGE_ANGLES[b.edge] * Math.PI) / 180 / 100;
    return angleA - angleB;
  });

  if (portCount <= 0 || uniqueEdges.length === 0) return [];

  const capped = Math.min(portCount, uniqueEdges.length);
  const usedSeaHexes = new Set();
  const usedLandHexes = new Set();
  const result = [];
  const spacing = uniqueEdges.length / capped;

  function canPlace(edge) {
    if (edge.seaHex >= 0 && usedSeaHexes.has(edge.seaHex)) return false;
    if (usedLandHexes.has(edge.hexIndex)) return false;
    return true;
  }

  function markUsed(edge) {
    if (edge.seaHex >= 0) usedSeaHexes.add(edge.seaHex);
    usedLandHexes.add(edge.hexIndex);
  }

  // First pass: try evenly spaced picks
  const tried = new Set();
  for (let i = 0; i < capped; i++) {
    const idealIdx = Math.floor(i * spacing + spacing / 2) % uniqueEdges.length;
    const edge = uniqueEdges[idealIdx];
    tried.add(idealIdx);
    if (!canPlace(edge)) continue;
    markUsed(edge);
    result.push(edge);
  }

  // Second pass: fill remaining slots from unused edges
  if (result.length < capped) {
    for (let i = 0; i < uniqueEdges.length && result.length < capped; i++) {
      if (tried.has(i)) continue;
      const edge = uniqueEdges[i];
      if (!canPlace(edge)) continue;
      markUsed(edge);
      result.push(edge);
    }
  }

  return result;
}

/**
 * Count how many adjacent pairs share the same terrain type (excluding sea/desert).
 */
function countAdjacentDuplicates(terrains, adjacencyMap) {
  let dupes = 0;
  for (let i = 0; i < terrains.length; i++) {
    if (NON_NUMBERED_TERRAINS.has(terrains[i])) continue;
    for (const j of adjacencyMap[i]) {
      if (j > i && terrains[i] === terrains[j]) {
        dupes++;
      }
    }
  }
  return dupes;
}

/**
 * Spread same-type resources apart by swapping tiles to minimize adjacent duplicates.
 * Uses hill-climbing with restarts.
 */
function spreadResourcesApart(terrains, rowSizes) {
  const adjacencyMap = buildAdjacencyMap(rowSizes);
  const RESTARTS = 5;
  const SWAPS_PER_RESTART = Math.max(terrains.length * 8, 300);

  let bestResult = [...terrains];
  let bestDupes = countAdjacentDuplicates(bestResult, adjacencyMap);

  for (let restart = 0; restart < RESTARTS; restart++) {
    const result = restart === 0 ? [...terrains] : shuffle(terrains);
    let currentDupes = countAdjacentDuplicates(result, adjacencyMap);

    const resourceIndices = [];
    for (let i = 0; i < result.length; i++) {
      if (!NON_NUMBERED_TERRAINS.has(result[i])) resourceIndices.push(i);
    }
    if (resourceIndices.length < 2) return result;

    for (let attempt = 0; attempt < SWAPS_PER_RESTART; attempt++) {
      const ai = resourceIndices[Math.floor(Math.random() * resourceIndices.length)];
      const bi = resourceIndices[Math.floor(Math.random() * resourceIndices.length)];
      if (ai === bi || result[ai] === result[bi]) continue;

      [result[ai], result[bi]] = [result[bi], result[ai]];
      const newDupes = countAdjacentDuplicates(result, adjacencyMap);

      if (newDupes <= currentDupes) {
        currentDupes = newDupes;
      } else {
        [result[ai], result[bi]] = [result[bi], result[ai]];
      }
    }

    if (currentDupes < bestDupes) {
      bestDupes = currentDupes;
      bestResult = [...result];
    }
  }

  return bestResult;
}

export function generateBoard(config) {
  const { rowSizes, terrainCounts, portCounts, islandBias = 0, smallIslands = false, spreadResources } = config;

  const allTerrains = buildTerrainDistribution(terrainCounts);
  const hasSea = allTerrains.includes(TERRAIN_TYPES.SEA);

  let terrains = hasSea && islandBias !== 0
    ? placeTerrainWithBias(allTerrains, rowSizes, islandBias, smallIslands)
    : shuffle(allTerrains);

  if (spreadResources) {
    terrains = spreadResourcesApart(terrains, rowSizes);
  }

  const nonDesertCount = getNonDesertCount(terrainCounts);
  const numberTokens = computeNumberTokens(nonDesertCount);
  const adjacencyMap = buildAdjacencyMap(rowSizes);

  let numbers;
  let hexes;
  let attempts = 0;

  do {
    numbers = shuffle(numberTokens);
    hexes = [];
    let numIndex = 0;

    for (let i = 0; i < terrains.length; i++) {
      if (NON_NUMBERED_TERRAINS.has(terrains[i])) {
        hexes.push({ terrain: terrains[i], number: null });
      } else {
        hexes.push({ terrain: terrains[i], number: numbers[numIndex] });
        numIndex++;
      }
    }
    attempts++;
  } while (hasAdjacentHighNumbers(hexes, adjacencyMap) && attempts < 200);

  const totalPorts = getTotalPortCount(portCounts);
  const portPositions = computeWaterPortPositions(rowSizes, terrains, totalPorts);
  const portTypes = shuffle(buildPortDistribution(portCounts));

  const ports = portTypes.map((type, i) => {
    const pos = portPositions[i] || { hexIndex: 0, edge: 0, seaHex: -1 };
    return {
      type,
      position: { hexIndex: pos.hexIndex, edge: pos.edge, seaHex: pos.seaHex },
    };
  });

  return { hexes, ports };
}
