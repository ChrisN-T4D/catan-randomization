import { useState, useCallback } from 'react';
import Board from './components/Board';
import Settings from './components/Settings';
import { generateBoard } from './utils/randomizer';
import { clonePreset } from './utils/presets';
import { validateConfig } from './utils/boardConfig';
import {
  TERRAIN_ICONS,
  TERRAIN_LABELS,
  TERRAIN_COLORS,
  ALL_TERRAIN_TYPES,
} from './utils/constants';
import './App.css';

function App() {
  const initialConfig = clonePreset('base');
  const [config, setConfig] = useState(initialConfig);
  const [board, setBoard] = useState(() => ({
    ...generateBoard(initialConfig),
    rowSizes: initialConfig.rowSizes,
  }));

  const errors = validateConfig(config);
  const canGenerate = errors.length === 0;

  const activeTerrain = ALL_TERRAIN_TYPES.filter(
    (t) => (config.terrainCounts[t] ?? 0) > 0
  );

  const handleRandomize = useCallback(() => {
    if (canGenerate) {
      setBoard({
        ...generateBoard(config),
        rowSizes: [...config.rowSizes],
      });
    }
  }, [config, canGenerate]);

  const handleConfigChange = useCallback((newConfig) => {
    setConfig(newConfig);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Catan Board Randomizer</h1>
        <p className="subtitle">Generate a balanced, randomized board for Settlers of Catan</p>
      </header>

      <main className="app-main">
        <div className="board-container">
          <Board
            hexes={board.hexes}
            ports={board.ports}
            rowSizes={board.rowSizes}
          />
        </div>

        <div className="controls">
          <button
            className="randomize-btn"
            onClick={handleRandomize}
            disabled={!canGenerate}
          >
            <span className="btn-icon">🎲</span>
            Randomize Board
          </button>

          <Settings config={config} onChange={handleConfigChange} />

          <div className="legend">
            <h3>Resources</h3>
            <div className="legend-grid">
              {activeTerrain.map((terrain) => (
                <div key={terrain} className="legend-item">
                  <span
                    className="legend-swatch"
                    style={{ backgroundColor: TERRAIN_COLORS[terrain] }}
                  />
                  <span className="legend-icon">{TERRAIN_ICONS[terrain]}</span>
                  <span className="legend-label">{TERRAIN_LABELS[terrain]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="info-card">
            <h3>How it works</h3>
            <ul>
              <li>Terrain tiles are shuffled randomly</li>
              <li>Number tokens are placed so that 6 and 8 are never adjacent</li>
              <li>Port types and positions are randomized</li>
              <li>Choose a preset or fully customize your board</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
