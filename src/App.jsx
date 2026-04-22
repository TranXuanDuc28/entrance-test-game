import React, { useState, useEffect, useRef, useCallback } from 'react';
import GamePoint from './components/GamePoint';
import { Play, RotateCcw, Zap, ZapOff } from 'lucide-react';

const App = () => {
  // --- Game Settings ---
  const [pointsCount, setPointsCount] = useState(5);
  const [fadeTime, setFadeTime] = useState(3.0);

  // --- Game State ---
  const [points, setPoints] = useState([]);
  const [nextExpected, setNextExpected] = useState(1);
  const [gameState, setGameState] = useState('initial'); // 'initial', 'playing', 'won', 'lost'
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [gameTimer, setGameTimer] = useState(0);
  const [goneCount, setGoneCount] = useState(0);
  const [fadingPoints, setFadingPoints] = useState(new Set());

  const timerRef = useRef(null);
  const autoPlayRef = useRef(null);

  // --- Case 3: Restart / Reset ---
  const handleRestart = useCallback(() => {
    setGameState('playing');
    setNextExpected(1);
    setGoneCount(0);
    setGameTimer(0);
    setIsAutoPlay(false);
    setFadingPoints(new Set());

    // Generate new points
    const newPoints = [];
    for (let i = 1; i <= pointsCount; i++) {
      newPoints.push({
        id: Math.random(),
        value: i,
        x: Math.random() * 90 + 5, // Keep away from edges
        y: Math.random() * 80 + 10,
        zIndex: pointsCount - i + 1 // Smaller numbers on top
      });
    }
    setPoints(newPoints);

    // Start timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setGameTimer(prev => prev + 0.1);
    }, 100);
  }, [pointsCount]);

  // --- Case 1 & 2: Click Logic ---
  const handlePointClick = (val) => {
    if (gameState !== 'playing') return false;

    if (val === nextExpected) {
      setNextExpected(prev => prev + 1);
      // Case 6: Each point has its own fade timer logic handled in GamePoint
      // We just need to track when they are gone
      setTimeout(() => {
        setGoneCount(prev => prev + 1);
      }, fadeTime * 1000);
      return true;
    } else {
      // CASE 2: Wrong order
      setGameState('lost');
      if (timerRef.current) clearInterval(timerRef.current);
      return false;
    }
  };

  // --- Case 1: ALL CLEARED ---
  useEffect(() => {
    if (goneCount === pointsCount && pointsCount > 0 && gameState === 'playing') {
      setGameState('won');
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [goneCount, pointsCount, gameState]);


  // Refined Auto Play Logic: Move 'isFading' state to parent to control it better

  const handleAutoPlayClick = useCallback(() => {
    if (gameState !== 'playing') return;
    const target = nextExpected;
    if (target <= pointsCount) {
      handlePointClick(target);
      setFadingPoints(prev => new Set(prev).add(target));
    }
  }, [nextExpected, pointsCount, gameState]);

  useEffect(() => {
    let interval;
    if (isAutoPlay && gameState === 'playing') {
      interval = setInterval(handleAutoPlayClick, 600);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, gameState, handleAutoPlayClick]);

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  return (
    <div className="game-container" style={{ width: '100%', maxWidth: '800px', padding: '20px' }}>
      <div className="glass-panel" style={{ padding: '24px', position: 'relative', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>

        {/* Header Section */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{
            color: gameState === 'won' ? 'var(--success-color)' : gameState === 'lost' ? 'var(--error-color)' : 'var(--text-primary)',
            fontSize: '1.5rem',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            {gameState === 'won' ? 'ALL CLEAREDS' : gameState === 'lost' ? 'GAME OVER' : "LET'S PLAY"}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '12px', alignItems: 'end' }}>
            <div>
              <label>Points</label>
              <input
                type="number"
                value={pointsCount}
                onChange={(e) => setPointsCount(parseInt(e.target.value) || 0)}
                disabled={gameState === 'playing'}
              />
            </div>
            <div>
              <label>Time (s)</label>
              <input
                type="number"
                step="0.1"
                value={fadeTime}
                onChange={(e) => setFadeTime(parseFloat(e.target.value) || 0)}
                disabled={gameState === 'playing'}
              />
            </div>
            <button className="btn btn-primary" onClick={handleRestart} style={{ height: '38px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RotateCcw size={16} /> {gameState === 'initial' ? 'Play' : 'Restart'}
            </button>

            {/* Case 4 & 5: Auto Play Button */}
            <button
              className={`btn ${isAutoPlay ? 'btn-primary' : ''}`}
              onClick={toggleAutoPlay}
              style={{ height: '38px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {isAutoPlay ? <Zap size={16} /> : <ZapOff size={16} />}
              Auto Play {isAutoPlay ? 'ON' : 'OFF'}
            </button>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <span>Time: {gameTimer.toFixed(1)}s</span>
            {gameState === 'playing' && <span>Next: {nextExpected}</span>}
          </div>
        </div>

        {/* Board Section */}
        <div className="game-board" style={{
          flex: 1,
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          position: 'relative',
          background: 'rgba(0,0,0,0.2)',
          overflow: 'hidden'
        }}>
          {points.map(p => (
            <GamePoint
              key={p.id}
              point={p}
              onClick={handlePointClick}
              totalTime={fadeTime}
              isGameOver={gameState !== 'playing'}
              externalFade={fadingPoints.has(p.value)}
            />
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
        Click numbers in ascending order to win.
      </div>
    </div>
  );
};

export default App;
