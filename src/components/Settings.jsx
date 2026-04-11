import { useState } from 'react';
import { PRESETS, PRESET_KEYS, clonePreset } from '../utils/presets';
import {
  ALL_TERRAIN_TYPES,
  ALL_PORT_TYPES,
  TERRAIN_TYPES,
  TERRAIN_LABELS,
  TERRAIN_ICONS,
  TERRAIN_COLORS,
  PORT_LABELS,
} from '../utils/constants';
import {
  getTotalHexes,
  getTotalTerrainCount,
  getTotalPortCount,
  getMaxPorts,
  validateConfig,
  buildRowSizes,
  rowSizesToShape,
  autoFillTerrainCounts,
  findValidBoardShapes,
  MAX_PER_TERRAIN,
  RESOURCE_TYPES,
} from '../utils/boardConfig';

export default function Settings({ config, onChange }) {
  const [activePreset, setActivePreset] = useState('base');
  const [expanded, setExpanded] = useState(false);

  const shape = rowSizesToShape(config.rowSizes);

  const errors = validateConfig(config);
  const totalHexes = getTotalHexes(config.rowSizes);
  const totalTerrain = getTotalTerrainCount(config.terrainCounts);
  const totalPorts = getTotalPortCount(config.portCounts);
  const maxPorts = getMaxPorts(config.rowSizes);

  const activeTerrain = ALL_TERRAIN_TYPES.filter(
    (t) => (config.terrainCounts[t] ?? 0) > 0 || activePreset === 'seafarers' || activePreset === 'custom'
  );

  function handlePresetChange(key) {
    setActivePreset(key);
    if (key !== 'custom') {
      onChange(clonePreset(key));
    }
  }

  function handleShapeChange(topWidth, sideLength) {
    const newRowSizes = buildRowSizes(topWidth, sideLength);
    const newTotal = getTotalHexes(newRowSizes);
    const adjustedTerrain = autoFillTerrainCounts(config.terrainCounts, newTotal);
    setActivePreset('custom');
    onChange({ ...config, rowSizes: newRowSizes, terrainCounts: adjustedTerrain });
  }

  function handleTerrainCount(type, delta) {
    const current = config.terrainCounts[type] ?? 0;
    const cap = type === TERRAIN_TYPES.SEA ? Infinity : MAX_PER_TERRAIN;
    const next = Math.max(0, Math.min(cap, current + delta));
    setActivePreset('custom');
    onChange({
      ...config,
      terrainCounts: { ...config.terrainCounts, [type]: next },
    });
  }

  const canAddAll = RESOURCE_TYPES.every((t) => (config.terrainCounts[t] ?? 0) < MAX_PER_TERRAIN);
  const canSubAll = RESOURCE_TYPES.some((t) => (config.terrainCounts[t] ?? 0) > 0);

  function handleAllResources(delta) {
    const updated = { ...config.terrainCounts };
    for (const t of RESOURCE_TYPES) {
      const current = updated[t] ?? 0;
      updated[t] = Math.max(0, Math.min(MAX_PER_TERRAIN, current + delta));
    }
    setActivePreset('custom');
    onChange({ ...config, terrainCounts: updated });
  }

  const suggestedShapes = findValidBoardShapes(totalTerrain);
  const currentShapeKey = `${shape.topWidth},${shape.sideLength}`;

  function handlePickShape(s) {
    setActivePreset('custom');
    onChange({ ...config, rowSizes: s.rowSizes });
  }

  const seaCount = config.terrainCounts[TERRAIN_TYPES.SEA] ?? 0;
  const nonSeaTerrain = totalTerrain - seaCount;
  const seaNeeded = totalHexes - nonSeaTerrain;

  function handleFillWithSea() {
    if (seaNeeded <= 0) return;
    setActivePreset('custom');
    onChange({
      ...config,
      terrainCounts: { ...config.terrainCounts, [TERRAIN_TYPES.SEA]: seaNeeded },
    });
  }

  function handleReset() {
    setActivePreset('base');
    onChange(clonePreset('base'));
  }

  function handlePortCount(type, delta) {
    const current = config.portCounts[type] ?? 0;
    const next = Math.max(0, current + delta);
    setActivePreset('custom');
    onChange({
      ...config,
      portCounts: { ...config.portCounts, [type]: next },
    });
  }

  const presetDescription = activePreset !== 'custom' && PRESETS[activePreset]?.description;

  return (
    <div className="settings-panel">
      <button
        className="settings-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="settings-toggle-icon">{expanded ? '▼' : '▶'}</span>
        Board Settings
      </button>

      {expanded && (
        <div className="settings-body">
          {/* Preset selector */}
          <div className="settings-section">
            <label className="settings-label">Preset</label>
            <select
              className="settings-select"
              value={activePreset}
              onChange={(e) => handlePresetChange(e.target.value)}
            >
              {PRESET_KEYS.map((key) => (
                <option key={key} value={key}>
                  {PRESETS[key].name}
                </option>
              ))}
              <option value="custom">Custom</option>
            </select>
            {presetDescription && (
              <p className="preset-note">{presetDescription}</p>
            )}
          </div>

          {/* Board size */}
          <div className="settings-section">
            <label className="settings-label">
              Board Size
              <span className="settings-hint">
                {totalHexes} hexes
              </span>
            </label>
            <div className="shape-controls">
              <div className="shape-field">
                <span className="shape-label">Top/Bottom Width</span>
                <div className="stepper-controls">
                  <button
                    className="stepper-btn"
                    onClick={() => handleShapeChange(shape.topWidth - 1, shape.sideLength)}
                    disabled={shape.topWidth <= 1}
                  >
                    −
                  </button>
                  <span className="stepper-value">{shape.topWidth}</span>
                  <button
                    className="stepper-btn"
                    onClick={() => handleShapeChange(shape.topWidth + 1, shape.sideLength)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="shape-field">
                <span className="shape-label">Side Length</span>
                <div className="stepper-controls">
                  <button
                    className="stepper-btn"
                    onClick={() => handleShapeChange(shape.topWidth, shape.sideLength - 1)}
                    disabled={shape.sideLength <= 1}
                  >
                    −
                  </button>
                  <span className="stepper-value">{shape.sideLength}</span>
                  <button
                    className="stepper-btn"
                    onClick={() => handleShapeChange(shape.topWidth, shape.sideLength + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="shape-preview">
                Rows: {config.rowSizes.join(', ')}
              </p>
            </div>
          </div>

          {/* Terrain counts */}
          <div className="settings-section">
            <label className="settings-label">
              Terrain Tiles
              <span className={`settings-hint ${totalTerrain !== totalHexes ? 'hint-error' : ''}`}>
                {totalTerrain} / {totalHexes}
              </span>
            </label>
            <div className="bulk-controls">
              <button
                className="bulk-btn"
                onClick={() => handleAllResources(-1)}
                disabled={!canSubAll}
              >
                − All Resources
              </button>
              <button
                className="bulk-btn"
                onClick={() => handleAllResources(1)}
                disabled={!canAddAll}
              >
                + All Resources
              </button>
            </div>
            <div className="stepper-grid">
              {activeTerrain.map((type) => (
                <div key={type} className="stepper-row">
                  <span
                    className="stepper-swatch"
                    style={{ backgroundColor: TERRAIN_COLORS[type] }}
                  />
                  <span className="stepper-icon">{TERRAIN_ICONS[type]}</span>
                  <span className="stepper-name">{TERRAIN_LABELS[type]}</span>
                  <div className="stepper-controls">
                    <button
                      className="stepper-btn"
                      onClick={() => handleTerrainCount(type, -1)}
                      disabled={(config.terrainCounts[type] ?? 0) <= 0}
                    >
                      −
                    </button>
                    <span className="stepper-value">
                      {config.terrainCounts[type] ?? 0}
                    </span>
                    <button
                      className="stepper-btn"
                      onClick={() => handleTerrainCount(type, 1)}
                      disabled={type !== TERRAIN_TYPES.SEA && (config.terrainCounts[type] ?? 0) >= MAX_PER_TERRAIN}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {nonSeaTerrain < totalHexes && (
              <button
                className="fill-sea-btn"
                onClick={handleFillWithSea}
              >
                🌊 Fill rest with sea ({seaNeeded < 0 ? 0 : seaNeeded})
              </button>
            )}
            {(config.terrainCounts[TERRAIN_TYPES.SEA] ?? 0) > 0 && (
              <div className="island-slider">
                <label className="settings-label">
                  Island Preference
                  <span className="settings-hint">
                    {config.islandBias === 0
                      ? 'Random'
                      : config.islandBias > 0
                        ? `More islands (+${config.islandBias})`
                        : `Fewer islands (${config.islandBias})`}
                  </span>
                </label>
                <div className="slider-row">
                  <span className="slider-label-left">Fewer</span>
                  <input
                    type="range"
                    min="-3"
                    max="3"
                    step="1"
                    value={config.islandBias ?? 0}
                    onChange={(e) => {
                      setActivePreset('custom');
                      onChange({ ...config, islandBias: parseInt(e.target.value, 10) });
                    }}
                    className="island-range"
                  />
                  <span className="slider-label-right">More</span>
                </div>
                <label className="island-toggle">
                  <input
                    type="checkbox"
                    checked={config.smallIslands ?? false}
                    onChange={(e) => {
                      setActivePreset('custom');
                      onChange({ ...config, smallIslands: e.target.checked });
                    }}
                  />
                  <span>Islands can be 1–2 hexes</span>
                </label>
              </div>
            )}
            <label className="island-toggle">
              <input
                type="checkbox"
                checked={config.spreadResources ?? false}
                onChange={(e) => {
                  setActivePreset('custom');
                  onChange({ ...config, spreadResources: e.target.checked });
                }}
              />
              <span>Prefer resources spread apart</span>
            </label>
          </div>

          {/* Suggested board shapes based on tile count */}
          {totalTerrain !== totalHexes && suggestedShapes.length > 0 && (
            <div className="settings-section">
              <label className="settings-label">
                Fit {totalTerrain} tiles
              </label>
              <div className="shape-suggestions">
                {suggestedShapes.map((s) => {
                  const key = `${s.topWidth},${s.sideLength}`;
                  const isActive = key === currentShapeKey;
                  return (
                    <button
                      key={key}
                      className={`shape-option ${isActive ? 'shape-option-active' : ''}`}
                      onClick={() => handlePickShape(s)}
                    >
                      <span className="shape-option-dims">
                        {s.topWidth} top &times; {s.sideLength} side
                      </span>
                      <span className="shape-option-rows">
                        {s.rowSizes.join(', ')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {totalTerrain !== totalHexes && suggestedShapes.length === 0 && (
            <p className="no-shapes-note">
              No hex board shape fits exactly {totalTerrain} tiles. Adjust tile counts.
            </p>
          )}

          {/* Port counts */}
          <div className="settings-section">
            <label className="settings-label">
              Ports
              <span className={`settings-hint ${totalPorts > maxPorts ? 'hint-error' : ''}`}>
                {totalPorts} / {maxPorts} max
              </span>
            </label>
            <div className="stepper-grid">
              {ALL_PORT_TYPES.map((type) => (
                <div key={type} className="stepper-row">
                  <span className="stepper-name port-name">{PORT_LABELS[type]}</span>
                  <div className="stepper-controls">
                    <button
                      className="stepper-btn"
                      onClick={() => handlePortCount(type, -1)}
                      disabled={(config.portCounts[type] ?? 0) <= 0}
                    >
                      −
                    </button>
                    <span className="stepper-value">
                      {config.portCounts[type] ?? 0}
                    </span>
                    <button
                      className="stepper-btn"
                      onClick={() => handlePortCount(type, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Validation errors */}
          {errors.length > 0 && (
            <div className="validation-errors">
              {errors.map((err, i) => (
                <p key={i} className="validation-error">{err}</p>
              ))}
            </div>
          )}

          <button className="reset-btn" onClick={handleReset}>
            Reset to Default
          </button>
        </div>
      )}
    </div>
  );
}
