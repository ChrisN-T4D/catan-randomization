export const TERRAIN_TYPES = {
  FOREST: 'forest',
  FIELDS: 'fields',
  PASTURE: 'pasture',
  HILLS: 'hills',
  MOUNTAINS: 'mountains',
  DESERT: 'desert',
  GOLD: 'gold',
  SEA: 'sea',
};

// Terrains that don't receive a number token
export const NON_NUMBERED_TERRAINS = new Set([TERRAIN_TYPES.DESERT, TERRAIN_TYPES.SEA]);

export const TERRAIN_COLORS = {
  [TERRAIN_TYPES.FOREST]: '#2d6a2e',
  [TERRAIN_TYPES.FIELDS]: '#c89320',
  [TERRAIN_TYPES.PASTURE]: '#7ec850',
  [TERRAIN_TYPES.HILLS]: '#c4622d',
  [TERRAIN_TYPES.MOUNTAINS]: '#8b8b8b',
  [TERRAIN_TYPES.DESERT]: '#e8d5a3',
  [TERRAIN_TYPES.GOLD]: '#ffd700',
  [TERRAIN_TYPES.SEA]: '#2a7ab5',
};

export const TERRAIN_LABELS = {
  [TERRAIN_TYPES.FOREST]: 'Wood',
  [TERRAIN_TYPES.FIELDS]: 'Wheat',
  [TERRAIN_TYPES.PASTURE]: 'Sheep',
  [TERRAIN_TYPES.HILLS]: 'Brick',
  [TERRAIN_TYPES.MOUNTAINS]: 'Ore',
  [TERRAIN_TYPES.DESERT]: 'Desert',
  [TERRAIN_TYPES.GOLD]: 'Gold',
  [TERRAIN_TYPES.SEA]: 'Sea',
};

export const TERRAIN_ICONS = {
  [TERRAIN_TYPES.FOREST]: '🌲',
  [TERRAIN_TYPES.FIELDS]: '🌾',
  [TERRAIN_TYPES.PASTURE]: '🐑',
  [TERRAIN_TYPES.HILLS]: '🧱',
  [TERRAIN_TYPES.MOUNTAINS]: '⛰️',
  [TERRAIN_TYPES.DESERT]: '🏜️',
  [TERRAIN_TYPES.GOLD]: '💰',
  [TERRAIN_TYPES.SEA]: '🌊',
};

export const PORT_TYPES = {
  GENERIC: 'generic',
  WOOD: 'wood',
  WHEAT: 'wheat',
  SHEEP: 'sheep',
  BRICK: 'brick',
  ORE: 'ore',
};

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

// Ordered list of all terrain types for UI display
export const ALL_TERRAIN_TYPES = [
  TERRAIN_TYPES.FOREST,
  TERRAIN_TYPES.FIELDS,
  TERRAIN_TYPES.PASTURE,
  TERRAIN_TYPES.HILLS,
  TERRAIN_TYPES.MOUNTAINS,
  TERRAIN_TYPES.DESERT,
  TERRAIN_TYPES.GOLD,
  TERRAIN_TYPES.SEA,
];

export const ALL_PORT_TYPES = [
  PORT_TYPES.GENERIC,
  PORT_TYPES.WOOD,
  PORT_TYPES.WHEAT,
  PORT_TYPES.SHEEP,
  PORT_TYPES.BRICK,
  PORT_TYPES.ORE,
];
