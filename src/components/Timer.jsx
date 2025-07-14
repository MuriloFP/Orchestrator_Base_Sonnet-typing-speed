/**
 * Timer component - displays countdown timer with visual urgency indicators
 * Shows remaining time with color-coded urgency levels
 */

import { useMemo } from 'react';
import './Timer.css';

function Timer({ 
  timeRemaining = 60, 
  totalTime = 60, 
  isActive = false 
}) {
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate urgency level
  const urgencyLevel = useMemo(() => {
    const percentage = (timeRemaining / totalTime) * 100;
    if (percentage <= 10) return 'critical';
    if (percentage <= 25) return 'warning';
    if (percentage <= 50) return 'caution';
    return 'normal';
  }, [timeRemaining, totalTime]);
  
  // Calculate progress percentage
  const progressPercentage = ((totalTime - timeRemaining) / totalTime) * 100;
  
  // Get urgency message
  const getUrgencyMessage = () => {
    switch (urgencyLevel) {
      case 'critical':
        return '🚨 Final seconds!';
      case 'warning':
        return '⚠️ Time running out!';
      case 'caution':
        return '⏰ Halfway through';
      default:
        return '✨ You\'ve got time';
    }
  };
  
  // Get timer icon based on state
  const getTimerIcon = () => {
    if (!isActive) return '⏸️';
    if (urgencyLevel === 'critical') return '🚨';
    if (urgencyLevel === 'warning') return '⚠️';
    return '⏱️';
  };
  
  return (
    <div className={`timer-component ${urgencyLevel} ${isActive ? 'active' : 'inactive'}`}>
      {/* Main timer display */}
      <div className="timer-main">
        <div className="timer-icon">
          {getTimerIcon()}
        </div>
        
        <div className="timer-display">
          <div className={`time-value ${urgencyLevel}`}>
            {formatTime(timeRemaining)}
          </div>
          <div className="time-label">
            {isActive ? 'Remaining' : 'Ready'}
          </div>
        </div>
        
        <div className="timer-status">
          <div className="urgency-message">
            {isActive ? getUrgencyMessage() : '🎯 Ready to start'}
          </div>
        </div>
      </div>
      
      {/* Progress ring/bar */}
      <div className="timer-progress">
        <div className="progress-ring">
          <svg className="progress-ring-svg" width="80" height="80">
            <circle
              className="progress-ring-background"
              cx="40"
              cy="40"
              r="35"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              opacity="0.2"
            />
            <circle
              className={`progress-ring-fill ${urgencyLevel}`}
              cx="40"
              cy="40"
              r="35"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 35}`}
              strokeDashoffset={`${2 * Math.PI * 35 * (1 - progressPercentage / 100)}`}
              transform="rotate(-90 40 40)"
            />
          </svg>
          
          <div className="progress-percentage">
            {Math.round(progressPercentage)}%
          </div>
        </div>
      </div>
      
      {/* Time breakdown */}
      {isActive && (
        <div className="time-breakdown">
          <div className="time-detail">
            <span className="detail-label">Elapsed:</span>
            <span className="detail-value">{formatTime(totalTime - timeRemaining)}</span>
          </div>
          <div className="time-detail">
            <span className="detail-label">Total:</span>
            <span className="detail-value">{formatTime(totalTime)}</span>
          </div>
        </div>
      )}
      
      {/* Urgency animations */}
      {urgencyLevel === 'critical' && isActive && (
        <div className="critical-animation">
          <div className="pulse-ring"></div>
          <div className="pulse-ring delay-1"></div>
          <div className="pulse-ring delay-2"></div>
        </div>
      )}
      
      {/* Motivational messages based on time */}
      {isActive && (
        <div className="timer-motivation">
          {timeRemaining > 45 && (
            <span className="motivation-text">🚀 Great start! Keep the momentum</span>
          )}
          {timeRemaining <= 45 && timeRemaining > 30 && (
            <span className="motivation-text">💪 You&rsquo;re doing great! Stay focused</span>
          )}
          {timeRemaining <= 30 && timeRemaining > 15 && (
            <span className="motivation-text">🔥 Final stretch! Push through</span>
          )}
          {timeRemaining <= 15 && timeRemaining > 5 && (
            <span className="motivation-text">⚡ Almost there! Don&rsquo;t give up</span>
          )}
          {timeRemaining <= 5 && (
            <span className="motivation-text">🏁 Final countdown! Finish strong</span>
          )}
        </div>
      )}
    </div>
  );
}

// PropTypes
import PropTypes from 'prop-types';

Timer.propTypes = {
  timeRemaining: PropTypes.number,
  totalTime: PropTypes.number,
  isActive: PropTypes.bool
};

export default Timer;