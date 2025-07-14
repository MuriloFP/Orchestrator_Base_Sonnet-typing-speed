/**
 * Animation utilities and system foundation
 * Provides reusable animation functions, easing curves, and performance-optimized helpers
 */

// Animation easing functions
export const easings = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  spring: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
};

// Animation durations
export const durations = {
  instant: '0ms',
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
  slower: '500ms',
  slowest: '750ms'
};

// Performance-optimized animation helper
export const animate = (element, keyframes, options = {}) => {
  if (!element || typeof element.animate !== 'function') {
    return Promise.resolve();
  }

  const defaultOptions = {
    duration: 250,
    easing: easings.easeOut,
    fill: 'forwards'
  };

  const animation = element.animate(keyframes, { ...defaultOptions, ...options });
  
  return new Promise((resolve) => {
    animation.addEventListener('finish', resolve);
    animation.addEventListener('cancel', resolve);
  });
};

// Stagger animation helper for multiple elements
export const staggerAnimate = (elements, keyframes, options = {}) => {
  const { staggerDelay = 50, ...animationOptions } = options;
  
  return Promise.all(
    Array.from(elements).map((element, index) => {
      const delay = index * staggerDelay;
      return new Promise((resolve) => {
        setTimeout(() => {
          animate(element, keyframes, animationOptions).then(resolve);
        }, delay);
      });
    })
  );
};

// Counter animation utility
export const animateCounter = (element, from, to, duration = 1000, formatter = (val) => Math.round(val)) => {
  if (!element) return Promise.resolve();

  const startTime = performance.now();
  const difference = to - from;

  const updateCounter = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Use easeOut curve for smooth deceleration
    const easeOutProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = from + (difference * easeOutProgress);
    
    element.textContent = formatter(currentValue);
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  };

  return new Promise((resolve) => {
    requestAnimationFrame(updateCounter);
    setTimeout(resolve, duration);
  });
};

// Shake animation for errors
export const shakeElement = (element, intensity = 'medium') => {
  if (!element) return Promise.resolve();

  const intensityMap = {
    light: { distance: 2, duration: 300 },
    medium: { distance: 4, duration: 400 },
    strong: { distance: 6, duration: 500 }
  };

  const { distance, duration } = intensityMap[intensity] || intensityMap.medium;

  const keyframes = [
    { transform: 'translateX(0)' },
    { transform: `translateX(-${distance}px)` },
    { transform: `translateX(${distance}px)` },
    { transform: `translateX(-${distance}px)` },
    { transform: `translateX(${distance}px)` },
    { transform: 'translateX(0)' }
  ];

  return animate(element, keyframes, {
    duration,
    easing: easings.easeInOut
  });
};

// Pulse animation for highlights
export const pulseElement = (element, scale = 1.05, duration = 600) => {
  if (!element) return Promise.resolve();

  const keyframes = [
    { transform: 'scale(1)', opacity: 1 },
    { transform: `scale(${scale})`, opacity: 0.8 },
    { transform: 'scale(1)', opacity: 1 }
  ];

  return animate(element, keyframes, {
    duration,
    easing: easings.easeInOut
  });
};

// Bounce animation for success feedback
export const bounceElement = (element, height = 10, duration = 600) => {
  if (!element) return Promise.resolve();

  const keyframes = [
    { transform: 'translateY(0)' },
    { transform: `translateY(-${height}px)` },
    { transform: 'translateY(0)' },
    { transform: `translateY(-${height/2}px)` },
    { transform: 'translateY(0)' }
  ];

  return animate(element, keyframes, {
    duration,
    easing: easings.bounce
  });
};

// Fade in animation with optional slide
export const fadeIn = (element, direction = 'up', distance = 20, duration = 400) => {
  if (!element) return Promise.resolve();

  const directionMap = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 }
  };

  const { x, y } = directionMap[direction] || directionMap.up;

  const keyframes = [
    { 
      opacity: 0, 
      transform: `translate(${x}px, ${y}px) scale(0.95)` 
    },
    { 
      opacity: 1, 
      transform: 'translate(0, 0) scale(1)' 
    }
  ];

  return animate(element, keyframes, {
    duration,
    easing: easings.easeOut
  });
};

// Fade out animation
export const fadeOut = (element, direction = 'up', distance = 20, duration = 300) => {
  if (!element) return Promise.resolve();

  const directionMap = {
    up: { x: 0, y: -distance },
    down: { x: 0, y: distance },
    left: { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
    none: { x: 0, y: 0 }
  };

  const { x, y } = directionMap[direction] || directionMap.up;

  const keyframes = [
    { 
      opacity: 1, 
      transform: 'translate(0, 0) scale(1)' 
    },
    { 
      opacity: 0, 
      transform: `translate(${x}px, ${y}px) scale(0.95)` 
    }
  ];

  return animate(element, keyframes, {
    duration,
    easing: easings.easeIn
  });
};

// Scale animation for emphasis
export const scaleElement = (element, fromScale = 0.8, toScale = 1, duration = 300) => {
  if (!element) return Promise.resolve();

  const keyframes = [
    { transform: `scale(${fromScale})`, opacity: 0.8 },
    { transform: `scale(${toScale})`, opacity: 1 }
  ];

  return animate(element, keyframes, {
    duration,
    easing: easings.spring
  });
};

// Typing cursor animation
export const animateTypingCursor = (element) => {
  if (!element) return;

  const keyframes = [
    { opacity: 1 },
    { opacity: 0 }
  ];

  const animation = element.animate(keyframes, {
    duration: 1000,
    iterations: Infinity,
    easing: easings.easeInOut
  });

  return () => animation.cancel();
};

// Character pop animation for typing feedback
export const popCharacter = (element, delay = 0) => {
  if (!element) return Promise.resolve();

  return new Promise((resolve) => {
    setTimeout(() => {
      const keyframes = [
        { transform: 'scale(0.8)', opacity: 0.6 },
        { transform: 'scale(1.1)', opacity: 1 },
        { transform: 'scale(1)', opacity: 1 }
      ];

      animate(element, keyframes, {
        duration: 200,
        easing: easings.bounce
      }).then(resolve);
    }, delay);
  });
};

// Celebration burst animation
export const celebrationBurst = (element, particles = 12) => {
  if (!element) return Promise.resolve();

  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const particleElements = [];

  for (let i = 0; i < particles; i++) {
    const particle = document.createElement('div');
    particle.className = 'celebration-particle';
    particle.style.cssText = `
      position: fixed;
      width: 6px;
      height: 6px;
      background: hsl(${Math.random() * 360}, 70%, 60%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      left: ${centerX}px;
      top: ${centerY}px;
    `;
    
    document.body.appendChild(particle);
    particleElements.push(particle);

    const angle = (i / particles) * Math.PI * 2;
    const distance = 50 + Math.random() * 50;
    const endX = centerX + Math.cos(angle) * distance;
    const endY = centerY + Math.sin(angle) * distance;

    const keyframes = [
      { 
        transform: 'translate(0, 0) scale(0)',
        opacity: 1
      },
      { 
        transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(1)`,
        opacity: 1,
        offset: 0.7
      },
      { 
        transform: `translate(${endX - centerX}px, ${endY - centerY + 20}px) scale(0)`,
        opacity: 0
      }
    ];

    animate(particle, keyframes, {
      duration: 800 + Math.random() * 400,
      easing: easings.easeOut
    }).then(() => {
      particle.remove();
    });
  }

  return Promise.resolve();
};

// Reduced motion check
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Safe animation wrapper that respects reduced motion preferences
export const safeAnimate = (animationFn, fallbackFn = null) => {
  if (prefersReducedMotion()) {
    return fallbackFn ? fallbackFn() : Promise.resolve();
  }
  return animationFn();
};

// Performance monitoring
export const withPerformanceMonitoring = (animationFn, name = 'animation') => {
  return (...args) => {
    const startTime = performance.now();
    
    const result = animationFn(...args);
    
    if (result && typeof result.then === 'function') {
      return result.then((value) => {
        const endTime = performance.now();
        if (endTime - startTime > 16.67) { // More than one frame at 60fps
          console.warn(`Animation "${name}" took ${endTime - startTime}ms`);
        }
        return value;
      });
    }
    
    const endTime = performance.now();
    if (endTime - startTime > 16.67) {
      console.warn(`Animation "${name}" took ${endTime - startTime}ms`);
    }
    
    return result;
  };
};

// Animation queue for managing multiple animations
export class AnimationQueue {
  constructor() {
    this.queue = [];
    this.running = false;
  }

  add(animationFn) {
    this.queue.push(animationFn);
    if (!this.running) {
      this.process();
    }
  }

  async process() {
    this.running = true;
    
    while (this.queue.length > 0) {
      const animationFn = this.queue.shift();
      try {
        await animationFn();
      } catch (error) {
        console.error('Animation error:', error);
      }
    }
    
    this.running = false;
  }

  clear() {
    this.queue = [];
  }
}

// Global animation queue instance
export const globalAnimationQueue = new AnimationQueue();