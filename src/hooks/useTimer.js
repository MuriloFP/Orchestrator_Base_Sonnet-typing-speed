/**
 * Timer hook for managing countdown functionality
 * Provides precise timing control for typing tests
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { formatTime } from '../utils/calculations.js';

export function useTimer(initialTime = 60) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState(null);
  
  const intervalRef = useRef(null);
  const pausedTimeRef = useRef(0);
  
  // Start the timer
  const start = useCallback(() => {
    if (isActive && !isPaused) return;
    
    setIsActive(true);
    setIsPaused(false);
    
    if (!startTime) {
      setStartTime(Date.now());
    }
    
    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [isActive, isPaused, startTime]);
  
  // Pause the timer
  const pause = useCallback(() => {
    if (!isActive || isPaused) return;
    
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    pausedTimeRef.current += Date.now() - (startTime || Date.now());
  }, [isActive, isPaused, startTime]);
  
  // Resume the timer
  const resume = useCallback(() => {
    if (!isActive || !isPaused) return;
    
    setIsPaused(false);
    setStartTime(Date.now());
    
    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [isActive, isPaused]);
  
  // Stop the timer
  const stop = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  
  // Reset the timer
  const reset = useCallback((newTime = initialTime) => {
    setTimeRemaining(newTime);
    setIsActive(false);
    setIsPaused(false);
    setStartTime(null);
    pausedTimeRef.current = 0;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [initialTime]);
  
  // Get elapsed time
  const getElapsedTime = useCallback(() => {
    if (!startTime) return 0;
    
    const currentTime = isPaused ? pausedTimeRef.current : 
      (Date.now() - startTime + pausedTimeRef.current);
    
    return Math.floor(currentTime / 1000);
  }, [startTime, isPaused]);
  
  // Get progress percentage
  const getProgress = useCallback(() => {
    return ((initialTime - timeRemaining) / initialTime) * 100;
  }, [initialTime, timeRemaining]);
  
  // Format remaining time
  const formattedTime = formatTime(timeRemaining);
  
  // Format elapsed time
  const formattedElapsed = formatTime(getElapsedTime());
  
  // Check if timer is finished
  const isFinished = timeRemaining === 0 && !isActive;
  
  // Check if timer is running (active and not paused)
  const isRunning = isActive && !isPaused;
  
  // Get urgency level based on remaining time
  const getUrgencyLevel = useCallback(() => {
    const percentage = (timeRemaining / initialTime) * 100;
    if (percentage <= 10) return 'critical';
    if (percentage <= 25) return 'warning';
    return 'normal';
  }, [timeRemaining, initialTime]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Auto-stop when time reaches 0
  useEffect(() => {
    if (timeRemaining === 0 && isActive) {
      stop();
    }
  }, [timeRemaining, isActive, stop]);
  
  return {
    // State
    timeRemaining,
    isActive,
    isPaused,
    isFinished,
    isRunning,
    
    // Formatted values
    formattedTime,
    formattedElapsed,
    
    // Actions
    start,
    pause,
    resume,
    stop,
    reset,
    
    // Computed values
    elapsedTime: getElapsedTime(),
    progress: getProgress(),
    urgencyLevel: getUrgencyLevel(),
    
    // Utility functions
    getElapsedTime,
    getProgress,
    getUrgencyLevel
  };
}

// Hook for simple countdown without pause/resume functionality
export function useSimpleTimer(initialTime = 60, onComplete = null) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);
  
  const start = useCallback(() => {
    if (isActive) return;
    
    setIsActive(true);
    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsActive(false);
          if (onComplete) onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [isActive, onComplete]);
  
  const stop = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  
  const reset = useCallback((newTime = initialTime) => {
    setTimeRemaining(newTime);
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [initialTime]);
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return {
    timeRemaining,
    isActive,
    formattedTime: formatTime(timeRemaining),
    progress: ((initialTime - timeRemaining) / initialTime) * 100,
    start,
    stop,
    reset
  };
}