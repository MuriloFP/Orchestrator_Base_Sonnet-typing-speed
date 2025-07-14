/**
 * Keyboard input hook for handling typing test input
 * Manages keyboard events, input validation, and special key handling
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export function useKeyboardInput(onInput, onKeyDown, isActive = true) {
  const [inputValue, setInputValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef(null);
  
  // Handle input changes
  const handleInputChange = useCallback((event) => {
    if (!isActive || isComposing) return;
    
    const newValue = event.target.value;
    setInputValue(newValue);
    
    if (onInput) {
      onInput(newValue);
    }
  }, [isActive, isComposing, onInput]);
  
  // Handle key down events
  const handleKeyDown = useCallback((event) => {
    if (!isActive) return;
    
    // Call external key handler
    if (onKeyDown) {
      onKeyDown(event);
    }
    
    // Handle special keys
    switch (event.key) {
      case 'Tab':
        event.preventDefault();
        break;
      case 'Enter':
        event.preventDefault();
        break;
      case 'Escape':
        // Let the external handler manage escape
        break;
      default:
        // Allow normal typing
        break;
    }
    
    // Prevent browser shortcuts during active typing
    if (event.ctrlKey || event.metaKey) {
      // Allow common shortcuts but prevent others
      const allowedKeys = ['c', 'v', 'x', 'z', 'y', 'a'];
      if (!allowedKeys.includes(event.key.toLowerCase())) {
        event.preventDefault();
      }
    }
  }, [isActive, onKeyDown]);
  
  // Handle composition events (for IME input)
  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);
  
  const handleCompositionEnd = useCallback((event) => {
    setIsComposing(false);
    // Process the composed input
    if (isActive && onInput) {
      onInput(event.target.value);
    }
  }, [isActive, onInput]);
  
  // Focus management
  const focus = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const blur = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
  }, []);
  
  // Clear input
  const clearInput = useCallback(() => {
    setInputValue('');
    if (onInput) {
      onInput('');
    }
  }, [onInput]);
  
  // Set input value programmatically
  const setValue = useCallback((value) => {
    setInputValue(value);
    if (onInput) {
      onInput(value);
    }
  }, [onInput]);
  
  // Auto-focus when active
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);
  
  // Prevent losing focus during active typing
  const handleBlur = useCallback(() => {
    if (isActive) {
      // Small delay to allow for intentional focus changes
      setTimeout(() => {
        if (isActive && inputRef.current) {
          inputRef.current.focus();
        }
      }, 10);
    }
  }, [isActive]);
  
  return {
    // State
    inputValue,
    isComposing,
    
    // Ref for the input element
    inputRef,
    
    // Event handlers
    handleInputChange,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
    handleBlur,
    
    // Actions
    focus,
    blur,
    clearInput,
    setValue,
    
    // Input props (spread these onto your input element)
    inputProps: {
      ref: inputRef,
      value: inputValue,
      onChange: handleInputChange,
      onKeyDown: handleKeyDown,
      onCompositionStart: handleCompositionStart,
      onCompositionEnd: handleCompositionEnd,
      onBlur: handleBlur,
      disabled: !isActive,
      autoFocus: isActive,
      autoComplete: 'off',
      autoCorrect: 'off',
      autoCapitalize: 'off',
      spellCheck: false
    }
  };
}

// Hook for capturing global keyboard events
export function useGlobalKeyboard(onKeyDown, isActive = true) {
  useEffect(() => {
    if (!isActive || !onKeyDown) return;
    
    const handleGlobalKeyDown = (event) => {
      onKeyDown(event);
    };
    
    document.addEventListener('keydown', handleGlobalKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [onKeyDown, isActive]);
}

// Hook for preventing unwanted keyboard shortcuts
export function useKeyboardShortcutPrevention(isActive = true) {
  useEffect(() => {
    if (!isActive) return;
    
    const preventShortcuts = (event) => {
      // Prevent common browser shortcuts that might interfere
      if (event.ctrlKey || event.metaKey) {
        const preventedKeys = [
          'r', // Refresh
          'f', // Find
          'g', // Find next
          'h', // History
          'j', // Downloads
          'k', // Search
          'l', // Address bar
          'n', // New window
          'p', // Print
          'q', // Quit
          's', // Save
          't', // New tab
          'u', // View source
          'w', // Close tab
          'd', // Bookmark
          'e', // Search
          'i', // Developer tools
          'o', // Open file
          'shift+i', // Developer tools
          'shift+j', // Console
          'shift+c', // Inspect element
        ];
        
        const key = event.shiftKey ? `shift+${event.key.toLowerCase()}` : event.key.toLowerCase();
        
        if (preventedKeys.includes(key)) {
          event.preventDefault();
        }
      }
      
      // Prevent F keys that might cause issues
      if (event.key.startsWith('F') && event.key.length <= 3) {
        const fKeyNumber = parseInt(event.key.substring(1));
        if (fKeyNumber >= 1 && fKeyNumber <= 12) {
          event.preventDefault();
        }
      }
    };
    
    document.addEventListener('keydown', preventShortcuts);
    
    return () => {
      document.removeEventListener('keydown', preventShortcuts);
    };
  }, [isActive]);
}

// Hook for tracking typing patterns and statistics
export function useTypingPatterns() {
  const [keystrokes, setKeystrokes] = useState([]);
  const [typingSpeed, setTypingSpeed] = useState([]);
  const lastKeystrokeTime = useRef(null);
  
  const recordKeystroke = useCallback((key, isCorrect = true) => {
    const now = Date.now();
    const timeSinceLastKey = lastKeystrokeTime.current ? 
      now - lastKeystrokeTime.current : 0;
    
    const keystroke = {
      key,
      timestamp: now,
      isCorrect,
      timeSinceLastKey
    };
    
    setKeystrokes(prev => [...prev.slice(-99), keystroke]); // Keep last 100 keystrokes
    
    // Calculate instantaneous typing speed
    if (timeSinceLastKey > 0 && timeSinceLastKey < 2000) { // Ignore pauses > 2 seconds
      const instantSpeed = 60000 / timeSinceLastKey; // Keys per minute
      setTypingSpeed(prev => [...prev.slice(-19), instantSpeed]); // Keep last 20 speeds
    }
    
    lastKeystrokeTime.current = now;
  }, []);
  
  const getAverageSpeed = useCallback(() => {
    if (typingSpeed.length === 0) return 0;
    return typingSpeed.reduce((sum, speed) => sum + speed, 0) / typingSpeed.length;
  }, [typingSpeed]);
  
  const getTypingRhythm = useCallback(() => {
    if (keystrokes.length < 2) return 'steady';
    
    const intervals = keystrokes.slice(-10).map(k => k.timeSinceLastKey).filter(t => t > 0);
    if (intervals.length < 2) return 'steady';
    
    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
    const standardDeviation = Math.sqrt(variance);
    
    const coefficient = standardDeviation / avgInterval;
    
    if (coefficient < 0.3) return 'steady';
    if (coefficient < 0.6) return 'variable';
    return 'erratic';
  }, [keystrokes]);
  
  const reset = useCallback(() => {
    setKeystrokes([]);
    setTypingSpeed([]);
    lastKeystrokeTime.current = null;
  }, []);
  
  return {
    keystrokes,
    typingSpeed,
    recordKeystroke,
    getAverageSpeed,
    getTypingRhythm,
    reset,
    averageSpeed: getAverageSpeed(),
    rhythm: getTypingRhythm()
  };
}