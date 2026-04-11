import { useState, useCallback } from 'react';
import Board from './components/Board';
import { generateBoard } from './utils/randomizer';
import { TERRAIN_ICONS, TERRAIN_LABELS, TERRAIN_COLORS, TERRAIN_TYPES } from './utils/constants';
import './App.css';

const TERRAIN_ORDER = [
  TERRAIN_TYPES.FOREST,
  TERRAIN_TYPES.FIELDS,
  TERRAIN_TYPES.PASTURE,
  TERRAIN_TYPES.HILLS,
  TERRAIN_TYPES.MOUNTAINS,
  TERRAIN_TYPES.DESERT,
];

function App() {
  const [board, setBoard] = useState(() => generateBoard());

  const handleRandomize = useCallback(() => {
    setBoard(generateBoard());
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Catan Board Randomizer</h1>
        <p className="subtitle">Generate a balanced, randomized board for Settlers of Catan</p>
      </header>

      <main className="app-main">
        <div className="board-container">
          <Board hexes={board.hexes} ports={board.ports} />
        </div>

        <div className="controls">
          <button className="randomize-btn" onClick={handleRandomize}>
            <span className="btn-icon">🎲</span>
            Randomize Board
          </button>

          <div className="legend">
            <h3>Resources</h3>
            <div className="legend-grid">
              {TERRAIN_ORDER.map((terrain) => (
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
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
