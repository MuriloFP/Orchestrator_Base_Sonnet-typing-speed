/**
 * ConfettiEffect component - Creates celebratory confetti animations
 * Triggers on high performance achievements and milestones
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { prefersReducedMotion } from '../utils/animations.js';
import './ConfettiEffect.css';

const ConfettiEffect = ({
  trigger,
  intensity,
  colors,
  duration,
  particleCount,
  onComplete
}) => {
  const containerRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const particlesRef = useRef([]);

  const intensitySettings = useMemo(() => ({
    light: { count: 30, spread: 60, velocity: 3 },
    medium: { count: 50, spread: 80, velocity: 5 },
    heavy: { count: 80, spread: 100, velocity: 7 },
    extreme: { count: 120, spread: 120, velocity: 10 }
  }), []);

  const createParticle = useCallback((x, y, color, settings) => {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';
    
    const size = Math.random() * 8 + 4;
    const shape = Math.random() > 0.5 ? 'square' : 'circle';
    
    particle.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      border-radius: ${shape === 'circle' ? '50%' : '0'};
      pointer-events: none;
      z-index: 10000;
      left: ${x}px;
      top: ${y}px;
      transform-origin: center;
    `;

    document.body.appendChild(particle);
    
    // Calculate random trajectory
    const angle = (Math.random() - 0.5) * (settings.spread * Math.PI / 180);
    const velocity = settings.velocity * (0.5 + Math.random() * 0.5);
    const gravity = 0.5;
    const friction = 0.99;
    const rotationSpeed = (Math.random() - 0.5) * 720; // degrees per second

    let vx = Math.sin(angle) * velocity;
    let vy = -Math.cos(angle) * velocity;
    let currentX = x;
    let currentY = y;
    let rotation = 0;
    let opacity = 1;

    const animateParticle = () => {
      // Apply physics
      vy += gravity;
      vx *= friction;
      vy *= friction;
      
      currentX += vx;
      currentY += vy;
      rotation += rotationSpeed / 60; // Assuming 60fps
      
      // Fade out over time
      opacity -= 1 / (duration / 16.67); // Assuming 60fps
      
      particle.style.transform = `translate(${currentX - x}px, ${currentY - y}px) rotate(${rotation}deg)`;
      particle.style.opacity = Math.max(0, opacity);
      
      if (opacity > 0 && currentY < window.innerHeight + 100) {
        requestAnimationFrame(animateParticle);
      } else {
        particle.remove();
        const index = particlesRef.current.indexOf(particle);
        if (index > -1) {
          particlesRef.current.splice(index, 1);
        }
      }
    };

    requestAnimationFrame(animateParticle);
    return particle;
  }, [duration]);

  const createConfettiBurst = useCallback((centerX, centerY) => {
    const settings = intensitySettings[intensity] || intensitySettings.medium;
    const count = Math.min(settings.count, particleCount);
    
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const offsetX = (Math.random() - 0.5) * 100;
      const offsetY = (Math.random() - 0.5) * 50;
      
      const particle = createParticle(
        centerX + offsetX,
        centerY + offsetY,
        color,
        settings
      );
      
      particlesRef.current.push(particle);
    }
  }, [intensity, particleCount, colors, createParticle, intensitySettings]);

  const triggerConfetti = useCallback(() => {
    if (prefersReducedMotion()) {
      // Simple flash effect for reduced motion
      if (containerRef.current) {
        containerRef.current.style.background = 'rgba(255, 215, 0, 0.3)';
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.background = 'transparent';
          }
        }, 200);
      }
      return;
    }

    setIsActive(true);
    
    // Create multiple bursts from different positions
    const positions = [
      { x: window.innerWidth * 0.2, y: window.innerHeight * 0.3 },
      { x: window.innerWidth * 0.8, y: window.innerHeight * 0.3 },
      { x: window.innerWidth * 0.5, y: window.innerHeight * 0.2 },
    ];

    positions.forEach((pos, index) => {
      setTimeout(() => {
        createConfettiBurst(pos.x, pos.y);
      }, index * 200);
    });

    // Clean up after duration
    setTimeout(() => {
      setIsActive(false);
      particlesRef.current.forEach(particle => {
        if (particle.parentNode) {
          particle.remove();
        }
      });
      particlesRef.current = [];
      
      if (onComplete) {
        onComplete();
      }
    }, duration);
  }, [duration, onComplete, createConfettiBurst]);

  useEffect(() => {
    if (trigger) {
      triggerConfetti();
    }
  }, [trigger, triggerConfetti]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      particlesRef.current.forEach(particle => {
        if (particle.parentNode) {
          particle.remove();
        }
      });
      particlesRef.current = [];
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`confetti-container ${isActive ? 'active' : ''}`}
      aria-hidden="true"
    />
  );
};

ConfettiEffect.propTypes = {
  trigger: PropTypes.bool,
  intensity: PropTypes.oneOf(['light', 'medium', 'heavy', 'extreme']),
  colors: PropTypes.arrayOf(PropTypes.string),
  duration: PropTypes.number,
  particleCount: PropTypes.number,
  onComplete: PropTypes.func
};

ConfettiEffect.defaultProps = {
  trigger: false,
  intensity: 'medium',
  colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'],
  duration: 3000,
  particleCount: 50,
  onComplete: null
};

export default ConfettiEffect;