export const TERRAIN_TYPES = {
  FOREST: 'forest',
  FIELDS: 'fields',
  PASTURE: 'pasture',
  HILLS: 'hills',
  MOUNTAINS: 'mountains',
  DESERT: 'desert',
};

// Standard Catan terrain distribution (19 tiles)
export const TERRAIN_DISTRIBUTION = [
  TERRAIN_TYPES.FOREST,
  TERRAIN_TYPES.FOREST,
  TERRAIN_TYPES.FOREST,
  TERRAIN_TYPES.FOREST,
  TERRAIN_TYPES.FIELDS,
  TERRAIN_TYPES.FIELDS,
  TERRAIN_TYPES.FIELDS,
  TERRAIN_TYPES.FIELDS,
  TERRAIN_TYPES.PASTURE,
  TERRAIN_TYPES.PASTURE,
  TERRAIN_TYPES.PASTURE,
  TERRAIN_TYPES.PASTURE,
  TERRAIN_TYPES.HILLS,
  TERRAIN_TYPES.HILLS,
  TERRAIN_TYPES.HILLS,
  TERRAIN_TYPES.MOUNTAINS,
  TERRAIN_TYPES.MOUNTAINS,
  TERRAIN_TYPES.MOUNTAINS,
  TERRAIN_TYPES.DESERT,
];

// Number tokens placed on non-desert tiles (18 tokens)
export const NUMBER_TOKENS = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

// Board layout: number of hexes per row
export const ROW_SIZES = [3, 4, 5, 4, 3];

export const TERRAIN_COLORS = {
  [TERRAIN_TYPES.FOREST]: '#2d6a2e',
  [TERRAIN_TYPES.FIELDS]: '#e6b422',
  [TERRAIN_TYPES.PASTURE]: '#7ec850',
  [TERRAIN_TYPES.HILLS]: '#c4622d',
  [TERRAIN_TYPES.MOUNTAINS]: '#8b8b8b',
  [TERRAIN_TYPES.DESERT]: '#e8d5a3',
};

export const TERRAIN_LABELS = {
  [TERRAIN_TYPES.FOREST]: 'Wood',
  [TERRAIN_TYPES.FIELDS]: 'Wheat',
  [TERRAIN_TYPES.PASTURE]: 'Sheep',
  [TERRAIN_TYPES.HILLS]: 'Brick',
  [TERRAIN_TYPES.MOUNTAINS]: 'Ore',
  [TERRAIN_TYPES.DESERT]: 'Desert',
};

export const TERRAIN_ICONS = {
  [TERRAIN_TYPES.FOREST]: '🌲',
  [TERRAIN_TYPES.FIELDS]: '🌾',
  [TERRAIN_TYPES.PASTURE]: '🐑',
  [TERRAIN_TYPES.HILLS]: '🧱',
  [TERRAIN_TYPES.MOUNTAINS]: '⛰️',
  [TERRAIN_TYPES.DESERT]: '🏜️',
};

// Port types
export const PORT_TYPES = {
  GENERIC: 'generic',
  WOOD: 'wood',
  WHEAT: 'wheat',
  SHEEP: 'sheep',
  BRICK: 'brick',
  ORE: 'ore',
};

// Standard port distribution (9 ports)
export const PORT_DISTRIBUTION = [
  PORT_TYPES.GENERIC,
  PORT_TYPES.GENERIC,
  PORT_TYPES.GENERIC,
  PORT_TYPES.GENERIC,
  PORT_TYPES.WOOD,
  PORT_TYPES.WHEAT,
  PORT_TYPES.SHEEP,
  PORT_TYPES.BRICK,
  PORT_TYPES.ORE,
];

export const PORT_LABELS = {
  [PORT_TYPES.GENERIC]: '3:1',
  [PORT_TYPES.WOOD]: '2:1 🌲',
  [PORT_TYPES.WHEAT]: '2:1 🌾',
  [PORT_TYPES.SHEEP]: '2:1 🐑',
  [PORT_TYPES.BRICK]: '2:1 🧱',
  [PORT_TYPES.ORE]: '2:1 ⛰️',
};

export const PORT_COLORS = {
  [PORT_TYPES.GENERIC]: '#f0f0f0',
  [PORT_TYPES.WOOD]: '#4a9e4a',
  [PORT_TYPES.WHEAT]: '#f0d060',
  [PORT_TYPES.SHEEP]: '#a0e880',
  [PORT_TYPES.BRICK]: '#e08040',
  [PORT_TYPES.ORE]: '#b0b0b0',
};

// 9 port positions around the board perimeter.
// Each port is defined by the hex index it's adjacent to and the edge direction (0-5).
// Edge 0 = top, going clockwise: 1=top-right, 2=bottom-right, 3=bottom, 4=bottom-left, 5=top-left
export const PORT_POSITIONS = [
  { hexIndex: 0, edge: 5 },
  { hexIndex: 1, edge: 0 },
  { hexIndex: 2, edge: 1 },
  { hexIndex: 6, edge: 1 },
  { hexIndex: 11, edge: 2 },
  { hexIndex: 15, edge: 2 },
  { hexIndex: 17, edge: 3 },
  { hexIndex: 16, edge: 4 },
  { hexIndex: 12, edge: 4 },
];
