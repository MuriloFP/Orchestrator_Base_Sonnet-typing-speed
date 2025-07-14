/**
 * ProgressBar component - visual progress indicator for typing test
 * Shows both typing progress and time progress with smooth animations
 */

import { useState, useEffect } from 'react';
import './ProgressBar.css';

function ProgressBar({ 
  progress = 0, 
  timeProgress = 0, 
  isActive = false 
}) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [animatedTimeProgress, setAnimatedTimeProgress] = useState(0);
  
  // Smooth progress animation
  useEffect(() => {
    const difference = progress - animatedProgress;
    if (Math.abs(difference) < 0.1) {
      setAnimatedProgress(progress);
      return;
    }
    
    const animationFrame = requestAnimationFrame(() => {
      setAnimatedProgress(prev => prev + difference * 0.15);
    });
    
    return () => cancelAnimationFrame(animationFrame);
  }, [progress, animatedProgress]);
  
  // Smooth time progress animation
  useEffect(() => {
    const difference = timeProgress - animatedTimeProgress;
    if (Math.abs(difference) < 0.1) {
      setAnimatedTimeProgress(timeProgress);
      return;
    }
    
    const animationFrame = requestAnimationFrame(() => {
      setAnimatedTimeProgress(prev => prev + difference * 0.15);
    });
    
    return () => cancelAnimationFrame(animationFrame);
  }, [timeProgress, animatedTimeProgress]);
  
  // Get progress level for styling
  const getProgressLevel = (progressValue) => {
    if (progressValue >= 90) return 'excellent';
    if (progressValue >= 75) return 'good';
    if (progressValue >= 50) return 'average';
    if (progressValue >= 25) return 'started';
    return 'beginning';
  };
  
  const progressLevel = getProgressLevel(animatedProgress);
  
  // Get motivational message based on progress
  const getProgressMessage = () => {
    if (animatedProgress >= 95) return '🎉 Almost finished!';
    if (animatedProgress >= 75) return '🚀 Great progress!';
    if (animatedProgress >= 50) return '💪 Halfway there!';
    if (animatedProgress >= 25) return '📈 Getting started!';
    return '🌟 Begin typing...';
  };
  
  return (
    <div className={`progress-bar-component ${isActive ? 'active' : 'inactive'}`}>
      {/* Progress header */}
      <div className="progress-header">
        <div className="progress-title">
          <span className="progress-icon">📊</span>
          <span className="progress-label">Progress</span>
        </div>
        
        <div className="progress-values">
          <span className="typing-progress">
            Typing: {Math.round(animatedProgress)}%
          </span>
          <span className="time-progress">
            Time: {Math.round(animatedTimeProgress)}%
          </span>
        </div>
      </div>
      
      {/* Main progress bars */}
      <div className="progress-bars">
        {/* Typing progress bar */}
        <div className="progress-bar-container typing-progress-container">
          <div className="progress-bar-label">
            <span>Typing Progress</span>
            <span className="progress-percentage">{Math.round(animatedProgress)}%</span>
          </div>
          
          <div className="progress-bar-track">
            <div 
              className={`progress-bar-fill typing-fill ${progressLevel}`}
              style={{ 
                width: `${Math.min(animatedProgress, 100)}%`,
                transition: 'width 0.3s ease-out'
              }}
            >
              <div className="progress-bar-shine"></div>
            </div>
            
            {/* Progress markers */}
            <div className="progress-markers">
              {[25, 50, 75, 100].map(marker => (
                <div 
                  key={marker}
                  className={`progress-marker ${animatedProgress >= marker ? 'reached' : ''}`}
                  style={{ left: `${marker}%` }}
                >
                  <div className="marker-line"></div>
                  <div className="marker-label">{marker}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Time progress bar */}
        <div className="progress-bar-container time-progress-container">
          <div className="progress-bar-label">
            <span>Time Progress</span>
            <span className="progress-percentage">{Math.round(animatedTimeProgress)}%</span>
          </div>
          
          <div className="progress-bar-track">
            <div 
              className="progress-bar-fill time-fill"
              style={{ 
                width: `${Math.min(animatedTimeProgress, 100)}%`,
                transition: 'width 0.3s ease-out'
              }}
            >
              <div className="progress-bar-shine"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress comparison */}
      <div className="progress-comparison">
        <div className="comparison-item">
          <span className="comparison-label">Pace:</span>
          <span className={`comparison-value ${
            animatedProgress > animatedTimeProgress ? 'ahead' : 
            animatedProgress < animatedTimeProgress ? 'behind' : 'ontrack'
          }`}>
            {animatedProgress > animatedTimeProgress + 5 ? '🚀 Ahead of time!' :
             animatedProgress < animatedTimeProgress - 5 ? '⏰ Behind schedule' :
             '✅ On track'}
          </span>
        </div>
        
        <div className="comparison-item">
          <span className="comparison-label">Status:</span>
          <span className={`comparison-value ${progressLevel}`}>
            {getProgressMessage()}
          </span>
        </div>
      </div>
      
      {/* Detailed progress info */}
      {isActive && (
        <div className="progress-details">
          <div className="detail-item">
            <span className="detail-icon">⚡</span>
            <span className="detail-text">
              {animatedProgress > animatedTimeProgress ? 
                'You\'re typing faster than expected!' :
                'Maintain your current pace'}
            </span>
          </div>
          
          {animatedProgress >= 25 && (
            <div className="detail-item">
              <span className="detail-icon">🎯</span>
              <span className="detail-text">
                {100 - animatedProgress > 0 ? 
                  `${Math.round(100 - animatedProgress)}% remaining` :
                  'Test completed!'}
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Progress milestones */}
      {isActive && (
        <div className="progress-milestones">
          {[
            { threshold: 25, message: '🌟 Quarter way through!', icon: '🎯' },
            { threshold: 50, message: '🔥 Halfway milestone!', icon: '💪' },
            { threshold: 75, message: '🚀 Three quarters done!', icon: '⚡' },
            { threshold: 90, message: '🎉 Almost finished!', icon: '🏁' },
            { threshold: 100, message: '✅ Test completed!', icon: '🎊' }
          ].map(milestone => (
            animatedProgress >= milestone.threshold && animatedProgress < milestone.threshold + 1 && (
              <div key={milestone.threshold} className="milestone-notification">
                <span className="milestone-icon">{milestone.icon}</span>
                <span className="milestone-message">{milestone.message}</span>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}

// PropTypes
import PropTypes from 'prop-types';

ProgressBar.propTypes = {
  progress: PropTypes.number,
  timeProgress: PropTypes.number,
  isActive: PropTypes.bool
};

export default ProgressBar;