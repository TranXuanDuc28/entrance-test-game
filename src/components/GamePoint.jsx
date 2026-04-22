import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GamePoint = ({ point, onClick, totalTime, isGameOver, externalFade }) => {
  const [isFading, setIsFading] = useState(false);
  const [isGone, setIsGone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(totalTime);

  const handleClick = () => {
    if (isFading || isGameOver || isGone) return;
    const success = onClick(point.value);
    if (success) {
      setIsFading(true);
    }
  };

  // Support for Auto Play triggering fade
  useEffect(() => {
    if (externalFade && !isFading) {
      setIsFading(true);
    }
  }, [externalFade, isFading]);

  useEffect(() => {
    if (isFading) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const remaining = Math.max(0, totalTime - elapsed);
        setTimeLeft(remaining);
        if (remaining <= 0) {
          setIsGone(true);
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isFading, totalTime]);

  // Reset state if point data changes (e.g. restart)
  useEffect(() => {
    setIsFading(false);
    setIsGone(false);
    setTimeLeft(totalTime);
  }, [point.id, totalTime]);

  if (isGone) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: isFading ? 0 : 1,
        transition: { 
          scale: { type: 'spring', damping: 15 },
          opacity: { duration: isFading ? totalTime : 0.2 }
        }
      }}
      className="game-point"
      style={{
        position: 'absolute',
        left: `${point.x}%`,
        top: `${point.y}%`,
        borderRadius: '50%',
        border: `2px solid ${isFading ? '#fbbf24' : 'white'}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: isGameOver ? 'default' : 'pointer',
        zIndex: point.zIndex,
        backgroundColor: isFading ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(4px)',
        transform: 'translate(-50%, -50%)',
        userSelect: 'none',
        pointerEvents: isFading ? 'none' : 'auto',
        color: isFading ? '#fbbf24' : 'white'
      }}
      onClick={handleClick}
    >
      <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{point.value}</div>
      {isFading && (
        <div style={{ 
          position: 'absolute', 
          bottom: '-18px', 
          fontSize: '0.65rem',
          fontWeight: '600',
          color: '#fbbf24',
          whiteSpace: 'nowrap'
        }}>
          {timeLeft.toFixed(1)}s
        </div>
      )}
    </motion.div>
  );
};

export default GamePoint;
