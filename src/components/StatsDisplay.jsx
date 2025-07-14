/**
 * StatsDisplay component - shows real-time typing statistics
 * Displays WPM, accuracy, and other performance metrics
 */

import { useState, useEffect, useRef } from 'react';
import { animateCounter, safeAnimate } from '../utils/animations.js';
import './StatsDisplay.css';

function StatsDisplay({ 
  wpm = 0, 
  accuracy = 100, 
  timeRemaining = 60, 
  progress = 0, 
  isActive = false 
}) {
  const [animatedWpm, setAnimatedWpm] = useState(0);
  const [animatedAccuracy, setAnimatedAccuracy] = useState(100);
  const wpmRef = useRef(null);
  const accuracyRef = useRef(null);
  const previousWpm = useRef(0);
  const previousAccuracy = useRef(100);
  
  // Animated counter for WPM
  useEffect(() => {
    if (wpmRef.current && Math.abs(wpm - previousWpm.current) > 0.5) {
      safeAnimate(() =>
        animateCounter(wpmRef.current, previousWpm.current, wpm, 500)
      );
      previousWpm.current = wpm;
    }
    setAnimatedWpm(wpm);
  }, [wpm]);
  
  // Animated counter for accuracy
  useEffect(() => {
    if (accuracyRef.current && Math.abs(accuracy - previousAccuracy.current) > 0.5) {
      safeAnimate(() =>
        animateCounter(accuracyRef.current, previousAccuracy.current, accuracy, 500, (val) => Math.round(val))
      );
      previousAccuracy.current = accuracy;
    }
    setAnimatedAccuracy(accuracy);
  }, [accuracy]);
  
  // Get performance level based on WPM
  const getPerformanceLevel = (wpmValue) => {
    if (wpmValue >= 70) return 'excellent';
    if (wpmValue >= 50) return 'good';
    if (wpmValue >= 30) return 'average';
    return 'beginner';
  };
  
  // Get accuracy level
  const getAccuracyLevel = (accuracyValue) => {
    if (accuracyValue >= 95) return 'excellent';
    if (accuracyValue >= 85) return 'good';
    if (accuracyValue >= 75) return 'average';
    return 'needs-improvement';
  };
  
  const performanceLevel = getPerformanceLevel(animatedWpm);
  const accuracyLevel = getAccuracyLevel(animatedAccuracy);
  
  return (
    <div className={`stats-display ${isActive ? 'active' : 'inactive'}`}>
      {/* Main stats */}
      <div className="main-stats">
        {/* WPM Display */}
        <div className={`stat-item wpm-stat ${performanceLevel} animate-fade-in-up animate-stagger-1`}>
          <div className="stat-value" ref={wpmRef}>
            {Math.round(animatedWpm)}
          </div>
          <div className="stat-label">WPM</div>
          <div className="stat-sublabel">Words per minute</div>
        </div>
        
        {/* Accuracy Display */}
        <div className={`stat-item accuracy-stat ${accuracyLevel} animate-fade-in-up animate-stagger-2`}>
          <div className="stat-value" ref={accuracyRef}>
            {Math.round(animatedAccuracy)}%
          </div>
          <div className="stat-label">Accuracy</div>
          <div className="stat-sublabel">Correct characters</div>
        </div>
        
        {/* Time Display */}
        <div className="stat-item time-stat animate-fade-in-up animate-stagger-3">
          <div className="stat-value">
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </div>
          <div className="stat-label">Time</div>
          <div className="stat-sublabel">Remaining</div>
        </div>
        
        {/* Progress Display */}
        <div className="stat-item progress-stat animate-fade-in-up animate-stagger-4">
          <div className="stat-value">
            {Math.round(progress)}%
          </div>
          <div className="stat-label">Progress</div>
          <div className="stat-sublabel">Completion</div>
        </div>
      </div>
      
      {/* Performance indicators */}
      <div className="performance-indicators">
        <div className={`performance-badge wpm-badge ${performanceLevel}`}>
          {performanceLevel === 'excellent' && '🚀 Excellent Speed!'}
          {performanceLevel === 'good' && '👍 Good Speed'}
          {performanceLevel === 'average' && '📈 Keep Going'}
          {performanceLevel === 'beginner' && '🌱 Getting Started'}
        </div>
        
        <div className={`performance-badge accuracy-badge ${accuracyLevel}`}>
          {accuracyLevel === 'excellent' && '🎯 Perfect Accuracy!'}
          {accuracyLevel === 'good' && '✅ Great Accuracy'}
          {accuracyLevel === 'average' && '⚡ Focus on Accuracy'}
          {accuracyLevel === 'needs-improvement' && '🎯 Slow Down for Accuracy'}
        </div>
      </div>
      
      {/* Detailed stats (only when active) */}
      {isActive && (
        <div className="detailed-stats">
          <div className="stat-detail">
            <span className="detail-label">Characters/min:</span>
            <span className="detail-value">{Math.round(animatedWpm * 5)}</span>
          </div>
          <div className="stat-detail">
            <span className="detail-label">Keystrokes/min:</span>
            <span className="detail-value">{Math.round(animatedWpm * 5 / (animatedAccuracy / 100))}</span>
          </div>
          <div className="stat-detail">
            <span className="detail-label">Error rate:</span>
            <span className="detail-value">{Math.round(100 - animatedAccuracy)}%</span>
          </div>
        </div>
      )}
      
      {/* Real-time feedback */}
      {isActive && (
        <div className="realtime-feedback">
          {animatedWpm > 0 && (
            <div className="feedback-item">
              {animatedWpm >= 60 ? '🔥' : animatedWpm >= 40 ? '⚡' : '📈'} 
              <span>Current pace: {Math.round(animatedWpm)} WPM</span>
            </div>
          )}
          
          {animatedAccuracy < 90 && (
            <div className="feedback-item warning">
              ⚠️ <span>Focus on accuracy - slow down if needed</span>
            </div>
          )}
          
          {animatedAccuracy >= 95 && animatedWpm >= 50 && (
            <div className="feedback-item success">
              🌟 <span>Excellent performance!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// PropTypes
import PropTypes from 'prop-types';

StatsDisplay.propTypes = {
  wpm: PropTypes.number,
  accuracy: PropTypes.number,
  timeRemaining: PropTypes.number,
  progress: PropTypes.number,
  isActive: PropTypes.bool
};

export default StatsDisplay;