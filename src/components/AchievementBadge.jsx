/**
 * AchievementBadge component - Displays achievement notifications and badges
 * Shows different achievements based on typing performance milestones
 */

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './AchievementBadge.css';

const AchievementBadge = ({ 
  achievement,
  onComplete,
  duration = 4000
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const achievements = {
    // Speed achievements
    speedDemon: {
      title: 'Speed Demon',
      description: 'Reached 80+ WPM!',
      icon: '🚀',
      color: '#ff6b6b',
      gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a52)'
    },
    lightningFast: {
      title: 'Lightning Fast',
      description: 'Reached 100+ WPM!',
      icon: '⚡',
      color: '#feca57',
      gradient: 'linear-gradient(135deg, #feca57, #ff9ff3)'
    },
    typingMaster: {
      title: 'Typing Master',
      description: 'Reached 120+ WPM!',
      icon: '👑',
      color: '#48dbfb',
      gradient: 'linear-gradient(135deg, #48dbfb, #0abde3)'
    },

    // Accuracy achievements
    perfectionist: {
      title: 'Perfectionist',
      description: '100% Accuracy!',
      icon: '🎯',
      color: '#1dd1a1',
      gradient: 'linear-gradient(135deg, #1dd1a1, #10ac84)'
    },
    sharpshooter: {
      title: 'Sharpshooter',
      description: '98%+ Accuracy!',
      icon: '🏹',
      color: '#5f27cd',
      gradient: 'linear-gradient(135deg, #5f27cd, #341f97)'
    },
    accurate: {
      title: 'Accurate',
      description: '95%+ Accuracy!',
      icon: '✨',
      color: '#00d2d3',
      gradient: 'linear-gradient(135deg, #00d2d3, #01a3a4)'
    },

    // Combo achievements
    flawlessVictory: {
      title: 'Flawless Victory',
      description: '80+ WPM & 100% Accuracy!',
      icon: '🏆',
      color: '#ffd700',
      gradient: 'linear-gradient(135deg, #ffd700, #ffb700)'
    },
    unstoppable: {
      title: 'Unstoppable',
      description: '100+ WPM & 98%+ Accuracy!',
      icon: '🔥',
      color: '#ff3838',
      gradient: 'linear-gradient(135deg, #ff3838, #ff2f2f)'
    },

    // Milestone achievements
    firstTest: {
      title: 'Getting Started',
      description: 'Completed your first test!',
      icon: '🌟',
      color: '#3742fa',
      gradient: 'linear-gradient(135deg, #3742fa, #2f3542)'
    },
    consistent: {
      title: 'Consistent',
      description: 'Maintained good performance!',
      icon: '📈',
      color: '#2ed573',
      gradient: 'linear-gradient(135deg, #2ed573, #1e90ff)'
    },
    improvement: {
      title: 'Improving',
      description: 'Beat your previous best!',
      icon: '📊',
      color: '#ff6348',
      gradient: 'linear-gradient(135deg, #ff6348, #ff4757)'
    }
  };

  const currentAchievement = achievements[achievement];

  useEffect(() => {
    if (achievement && currentAchievement) {
      setIsVisible(true);
      setIsAnimating(true);

      // Auto-hide after duration
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
        if (onComplete) {
          onComplete();
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [achievement, currentAchievement, duration, onComplete]);

  const handleBadgeClick = () => {
    setIsVisible(false);
    setIsAnimating(false);
    if (onComplete) {
      onComplete();
    }
  };

  if (!isVisible || !currentAchievement) {
    return null;
  }

  return (
    <div 
      className={`achievement-overlay ${isAnimating ? 'animating' : ''}`}
      onClick={handleBadgeClick}
    >
      <div 
        className="achievement-badge"
        style={{
          background: currentAchievement.gradient,
          borderColor: currentAchievement.color
        }}
      >
        <div className="achievement-icon">
          {currentAchievement.icon}
        </div>
        <div className="achievement-content">
          <h3 className="achievement-title">
            {currentAchievement.title}
          </h3>
          <p className="achievement-description">
            {currentAchievement.description}
          </p>
        </div>
        <div className="achievement-sparkles">
          <span className="sparkle sparkle-1">✨</span>
          <span className="sparkle sparkle-2">⭐</span>
          <span className="sparkle sparkle-3">💫</span>
          <span className="sparkle sparkle-4">🌟</span>
        </div>
      </div>
      <div className="achievement-dismiss">
        <span>Click to dismiss</span>
      </div>
    </div>
  );
};

AchievementBadge.propTypes = {
  achievement: PropTypes.string,
  onComplete: PropTypes.func,
  duration: PropTypes.number
};

AchievementBadge.defaultProps = {
  achievement: null,
  onComplete: null,
  duration: 4000
};

export default AchievementBadge;