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
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="glass-panel p-3 p-md-4 shadow-lg" style={{ position: 'relative', minHeight: '650px', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header Section */}
            <div className="mb-4">
              <h2 className={`h3 mb-3 text-uppercase fw-bold ${
                gameState === 'won' ? 'text-success' : gameState === 'lost' ? 'text-danger' : 'text-white'
              }`} style={{ letterSpacing: '2px' }}>
                {gameState === 'won' ? 'ALL CLEAREDS' : gameState === 'lost' ? 'GAME OVER' : "LET'S PLAY"}
              </h2>
              
              <div className="row g-3 align-items-end">
                <div className="col-6 col-md-3">
                  <label className="form-label small text-secondary mb-1">Points</label>
                  <input 
                    type="number" 
                    className="form-control form-control-sm bg-dark text-white border-secondary"
                    value={pointsCount} 
                    onChange={(e) => setPointsCount(parseInt(e.target.value) || 0)} 
                    disabled={gameState === 'playing'}
                  />
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label small text-secondary mb-1">Time (s)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    className="form-control form-control-sm bg-dark text-white border-secondary"
                    value={fadeTime} 
                    onChange={(e) => setFadeTime(parseFloat(e.target.value) || 0)} 
                    disabled={gameState === 'playing'}
                  />
                </div>
                <div className="col-6 col-md-3">
                  <button className="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleRestart} style={{ height: '31px' }}>
                    <RotateCcw size={14} /> {gameState === 'initial' ? 'Play' : 'Restart'}
                  </button>
                </div>
                <div className="col-6 col-md-3">
                  <button 
                    className={`btn btn-sm w-100 d-flex align-items-center justify-content-center gap-2 ${isAutoPlay ? 'btn-primary' : 'btn-outline-light'}`}
                    onClick={toggleAutoPlay}
                    style={{ height: '31px' }}
                  >
                    {isAutoPlay ? <Zap size={14} /> : <ZapOff size={14} />}
                    Auto Play {isAutoPlay ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
              
              <div className="mt-3 d-flex justify-content-between text-secondary small fw-medium">
                <span>Time: {gameTimer.toFixed(1)}s</span>
                {gameState === 'playing' && <span>Next: {nextExpected}</span>}
              </div>
            </div>

            {/* Board Section */}
            <div className="game-board flex-grow-1 position-relative rounded-3" style={{ 
              background: 'rgba(0,0,0,0.2)',
              overflow: 'hidden',
              border: '1px solid var(--glass-border)'
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
          <div className="mt-4 text-center text-secondary small">
            Click numbers in ascending order to win.
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
