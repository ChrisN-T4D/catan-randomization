import {
  TERRAIN_DISTRIBUTION,
  NUMBER_TOKENS,
  PORT_DISTRIBUTION,
  ROW_SIZES,
  PORT_POSITIONS,
  TERRAIN_TYPES,
} from './constants';

function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function hasAdjacentHighNumbers(hexes) {
  const adjacencyMap = buildAdjacencyMap();
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

function buildAdjacencyMap() {
  const map = {};
  const hexPositions = getHexPositions();

  for (let i = 0; i < hexPositions.length; i++) {
    map[i] = [];
    for (let j = 0; j < hexPositions.length; j++) {
      if (i === j) continue;
      const dx = hexPositions[i].col - hexPositions[j].col;
      const dy = hexPositions[i].row - hexPositions[j].row;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 1.5) {
        map[i].push(j);
      }
    }
  }
  return map;
}

function getHexPositions() {
  const positions = [];
  const maxCols = Math.max(...ROW_SIZES);

  for (let row = 0; row < ROW_SIZES.length; row++) {
    const cols = ROW_SIZES[row];
    const offset = (maxCols - cols) / 2;
    for (let col = 0; col < cols; col++) {
      positions.push({ row, col: col + offset });
    }
  }
  return positions;
}

export function generateBoard() {
  const terrains = shuffle(TERRAIN_DISTRIBUTION);

  let numbers;
  let hexes;
  let attempts = 0;

  // Keep reshuffling numbers until no two 6/8 tokens are adjacent
  do {
    numbers = shuffle(NUMBER_TOKENS);
    hexes = [];
    let numIndex = 0;

    for (let i = 0; i < terrains.length; i++) {
      if (terrains[i] === TERRAIN_TYPES.DESERT) {
        hexes.push({ terrain: terrains[i], number: null });
      } else {
        hexes.push({ terrain: terrains[i], number: numbers[numIndex] });
        numIndex++;
      }
    }
    attempts++;
  } while (hasAdjacentHighNumbers(hexes) && attempts < 100);

  const ports = shuffle(PORT_DISTRIBUTION).map((type, i) => ({
    type,
    position: PORT_POSITIONS[i],
  }));

  return { hexes, ports };
}
