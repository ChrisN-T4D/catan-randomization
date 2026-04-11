import { TERRAIN_TYPES, PORT_TYPES } from './constants';

export const PRESETS = {
  base: {
    name: 'Base (3-4 Players)',
    rowSizes: [3, 4, 5, 4, 3],
    terrainCounts: {
      [TERRAIN_TYPES.FOREST]: 4,
      [TERRAIN_TYPES.FIELDS]: 4,
      [TERRAIN_TYPES.PASTURE]: 4,
      [TERRAIN_TYPES.HILLS]: 3,
      [TERRAIN_TYPES.MOUNTAINS]: 3,
      [TERRAIN_TYPES.DESERT]: 1,
    },
    portCounts: {
      [PORT_TYPES.GENERIC]: 4,
      [PORT_TYPES.WOOD]: 1,
      [PORT_TYPES.WHEAT]: 1,
      [PORT_TYPES.SHEEP]: 1,
      [PORT_TYPES.BRICK]: 1,
      [PORT_TYPES.ORE]: 1,
    },
  },

  '5-6': {
    name: '5-6 Player Extension',
    rowSizes: [3, 4, 5, 6, 5, 4, 3],
    terrainCounts: {
      [TERRAIN_TYPES.FOREST]: 6,
      [TERRAIN_TYPES.FIELDS]: 6,
      [TERRAIN_TYPES.PASTURE]: 6,
      [TERRAIN_TYPES.HILLS]: 5,
      [TERRAIN_TYPES.MOUNTAINS]: 5,
      [TERRAIN_TYPES.DESERT]: 2,
    },
    portCounts: {
      [PORT_TYPES.GENERIC]: 5,
      [PORT_TYPES.WOOD]: 1,
      [PORT_TYPES.WHEAT]: 1,
      [PORT_TYPES.SHEEP]: 1,
      [PORT_TYPES.BRICK]: 1,
      [PORT_TYPES.ORE]: 1,
    },
  },

  seafarers: {
    name: 'Seafarers',
    rowSizes: [4, 5, 6, 5, 4],
    terrainCounts: {
      [TERRAIN_TYPES.FOREST]: 4,
      [TERRAIN_TYPES.FIELDS]: 4,
      [TERRAIN_TYPES.PASTURE]: 4,
      [TERRAIN_TYPES.HILLS]: 3,
      [TERRAIN_TYPES.MOUNTAINS]: 3,
      [TERRAIN_TYPES.DESERT]: 1,
      [TERRAIN_TYPES.GOLD]: 2,
      [TERRAIN_TYPES.SEA]: 3,
    },
    portCounts: {
      [PORT_TYPES.GENERIC]: 4,
      [PORT_TYPES.WOOD]: 1,
      [PORT_TYPES.WHEAT]: 1,
      [PORT_TYPES.SHEEP]: 1,
      [PORT_TYPES.BRICK]: 1,
      [PORT_TYPES.ORE]: 1,
    },
  },

  'cities-knights': {
    name: 'Cities & Knights',
    description: 'Same board layout as Base — Cities & Knights adds game mechanics, not new terrain.',
    rowSizes: [3, 4, 5, 4, 3],
    terrainCounts: {
      [TERRAIN_TYPES.FOREST]: 4,
      [TERRAIN_TYPES.FIELDS]: 4,
      [TERRAIN_TYPES.PASTURE]: 4,
      [TERRAIN_TYPES.HILLS]: 3,
      [TERRAIN_TYPES.MOUNTAINS]: 3,
      [TERRAIN_TYPES.DESERT]: 1,
    },
    portCounts: {
      [PORT_TYPES.GENERIC]: 4,
      [PORT_TYPES.WOOD]: 1,
      [PORT_TYPES.WHEAT]: 1,
      [PORT_TYPES.SHEEP]: 1,
      [PORT_TYPES.BRICK]: 1,
      [PORT_TYPES.ORE]: 1,
    },
  },
};

export const PRESET_KEYS = Object.keys(PRESETS);

export function clonePreset(key) {
  const preset = PRESETS[key];
  return {
    rowSizes: [...preset.rowSizes],
    terrainCounts: { ...preset.terrainCounts },
    portCounts: { ...preset.portCounts },
    islandBias: 0,
    smallIslands: false,
    spreadResources: false,
  };
}
