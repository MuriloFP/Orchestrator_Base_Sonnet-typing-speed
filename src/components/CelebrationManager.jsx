/**
 * CelebrationManager component - Orchestrates all celebration effects
 * Manages confetti, achievements, and performance-based celebrations
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ConfettiEffect from './ConfettiEffect.jsx';
import AchievementBadge from './AchievementBadge.jsx';

const CelebrationManager = ({ 
  wpm, 
  accuracy, 
  isTestComplete, 
  testResults,
  onCelebrationComplete 
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const [celebrationQueue, setCelebrationQueue] = useState([]);

  // Achievement detection logic
  const detectAchievements = (wpm, accuracy, isComplete) => {
    const achievements = [];

    if (isComplete) {
      // Speed achievements
      if (wpm >= 120) achievements.push('typingMaster');
      else if (wpm >= 100) achievements.push('lightningFast');
      else if (wpm >= 80) achievements.push('speedDemon');

      // Accuracy achievements
      if (accuracy === 100) achievements.push('perfectionist');
      else if (accuracy >= 98) achievements.push('sharpshooter');
      else if (accuracy >= 95) achievements.push('accurate');

      // Combo achievements
      if (wpm >= 100 && accuracy >= 98) achievements.push('unstoppable');
      else if (wpm >= 80 && accuracy === 100) achievements.push('flawlessVictory');

      // Milestone achievements
      if (wpm > 0) achievements.push('firstTest');
    }

    return achievements;
  };

  // Trigger celebrations based on performance
  useEffect(() => {
    if (isTestComplete && testResults) {
      const achievements = detectAchievements(wpm, accuracy, true);
      
      // Show confetti for good performance
      if (wpm >= 60 || accuracy >= 90) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

      // Queue achievements
      if (achievements.length > 0) {
        setCelebrationQueue(achievements);
      }
    }
  }, [isTestComplete, testResults, wpm, accuracy]);

  // Process achievement queue
  useEffect(() => {
    if (celebrationQueue.length > 0 && !currentAchievement) {
      const nextAchievement = celebrationQueue[0];
      setCurrentAchievement(nextAchievement);
      setCelebrationQueue(prev => prev.slice(1));
    }
  }, [celebrationQueue, currentAchievement]);

  const handleAchievementComplete = () => {
    setCurrentAchievement(null);
    
    // If no more achievements, celebration is complete
    if (celebrationQueue.length === 0 && onCelebrationComplete) {
      onCelebrationComplete();
    }
  };

  const getConfettiIntensity = () => {
    if (wpm >= 100 || accuracy === 100) return 'heavy';
    if (wpm >= 80 || accuracy >= 95) return 'medium';
    return 'light';
  };

  const getConfettiColors = () => {
    if (accuracy === 100) return ['#22c55e', '#16a34a', '#15803d', '#4ade80'];
    if (wpm >= 100) return ['#3b82f6', '#1d4ed8', '#1e40af', '#60a5fa'];
    return ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
  };

  return (
    <>
      {showConfetti && (
        <ConfettiEffect
          trigger={showConfetti}
          intensity={getConfettiIntensity()}
          colors={getConfettiColors()}
          duration={3000}
          particleCount={wpm >= 100 ? 80 : 50}
        />
      )}
      
      {currentAchievement && (
        <AchievementBadge
          achievement={currentAchievement}
          onComplete={handleAchievementComplete}
          duration={4000}
        />
      )}
    </>
  );
};

CelebrationManager.propTypes = {
  wpm: PropTypes.number.isRequired,
  accuracy: PropTypes.number.isRequired,
  isTestComplete: PropTypes.bool.isRequired,
  testResults: PropTypes.object,
  onCelebrationComplete: PropTypes.func
};

CelebrationManager.defaultProps = {
  testResults: null,
  onCelebrationComplete: null
};

export default CelebrationManager;