/**
 * Main typing test hook for managing test state and logic
 * Coordinates all aspects of the typing test including timing, input, and calculations
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { calculateWPM, calculateAccuracy, calculateProgress } from '../utils/calculations.js';
import { validateCharacter } from '../utils/textProcessing.js';

const TEST_DURATION = 60; // 60 seconds as specified

export function useTypingTest(passage) {
  // Core test state
  const [testStatus, setTestStatus] = useState('ready'); // 'ready' | 'active' | 'completed'
  const [userInput, setUserInput] = useState('');
  const [currentPosition, setCurrentPosition] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(TEST_DURATION);
  
  // Performance metrics
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState([]);
  const [wpmHistory, setWpmHistory] = useState([]);
  
  // Refs for intervals and calculations
  const timerRef = useRef(null);
  const wpmUpdateRef = useRef(null);
  const lastUpdateTime = useRef(null);
  
  // Character validation state
  const [characterStates, setCharacterStates] = useState([]);
  
  // Initialize character states when passage changes
  useEffect(() => {
    if (passage?.text) {
      const states = passage.text.split('').map(() => 'untyped');
      setCharacterStates(states);
    }
  }, [passage]);
  
  // Complete the test
  const completeTest = useCallback(() => {
    setTestStatus('completed');
    
    // Clear intervals
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (wpmUpdateRef.current) {
      clearInterval(wpmUpdateRef.current);
      wpmUpdateRef.current = null;
    }
  }, []);

  // Update real-time statistics
  const updateRealTimeStats = useCallback((inputLength = userInput.length, correctChars = null) => {
    if (!startTime || testStatus !== 'active') return;
    
    const now = Date.now();
    const timeElapsed = (now - startTime) / 1000; // seconds
    
    // Calculate correct characters if not provided
    if (correctChars === null) {
      correctChars = characterStates.filter(state => state === 'correct').length;
    }
    
    // Calculate WPM
    const currentWpm = calculateWPM(correctChars, timeElapsed);
    setWpm(currentWpm);
    
    // Calculate accuracy
    const currentAccuracy = calculateAccuracy(correctChars, inputLength);
    setAccuracy(currentAccuracy);
    
    // Update WPM history every second
    if (now - lastUpdateTime.current >= 1000) {
      setWpmHistory(prev => [...prev, {
        timestamp: now,
        wpm: currentWpm,
        accuracy: currentAccuracy,
        position: inputLength
      }]);
      lastUpdateTime.current = now;
    }
  }, [startTime, testStatus, userInput.length, characterStates]);

  // Start the typing test
  const startTest = useCallback(() => {
    if (testStatus !== 'ready') return;
    
    const now = Date.now();
    setTestStatus('active');
    setStartTime(now);
    setTimeRemaining(TEST_DURATION);
    lastUpdateTime.current = now;
    
    // Start timer countdown
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          completeTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Start WPM updates every 100ms during active typing
    wpmUpdateRef.current = setInterval(() => {
      updateRealTimeStats();
    }, 100);
  }, [testStatus, completeTest, updateRealTimeStats]);
  
  // Reset the test
  const resetTest = useCallback(() => {
    setTestStatus('ready');
    setUserInput('');
    setCurrentPosition(0);
    setStartTime(null);
    setTimeRemaining(TEST_DURATION);
    setWpm(0);
    setAccuracy(100);
    setErrors([]);
    setWpmHistory([]);
    
    // Reset character states
    if (passage?.text) {
      const states = passage.text.split('').map(() => 'untyped');
      setCharacterStates(states);
    }
    
    // Clear intervals
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (wpmUpdateRef.current) {
      clearInterval(wpmUpdateRef.current);
      wpmUpdateRef.current = null;
    }
  }, [passage]);
  
  // Handle user input
  const handleInput = useCallback((newInput) => {
    if (testStatus !== 'active' || !passage?.text) return;
    
    // Start test automatically on first input
    if (testStatus === 'ready') {
      startTest();
    }
    
    setUserInput(newInput);
    
    // Update character states and position
    const newCharacterStates = [...characterStates];
    const newErrors = [...errors];
    let correctCount = 0;
    
    for (let i = 0; i < Math.max(newInput.length, currentPosition); i++) {
      const typed = newInput[i] || '';
      const expected = passage.text[i] || '';
      
      if (i < newInput.length) {
        const validation = validateCharacter(typed, expected);
        
        if (validation.isCorrect) {
          newCharacterStates[i] = 'correct';
          correctCount++;
        } else {
          newCharacterStates[i] = 'incorrect';
          
          // Track error if not already recorded for this position
          const existingError = newErrors.find(error => error.position === i);
          if (!existingError) {
            newErrors.push({
              position: i,
              expectedCharacter: expected,
              typedCharacter: typed,
              timestamp: Date.now(),
              corrected: false
            });
          }
        }
      } else if (i < passage.text.length) {
        // Character was deleted, reset to untyped
        newCharacterStates[i] = 'untyped';
      }
    }
    
    setCharacterStates(newCharacterStates);
    setCurrentPosition(newInput.length);
    setErrors(newErrors);
    
    // Update real-time stats
    updateRealTimeStats(newInput.length, correctCount, newErrors.length);
    
    // Check if test is complete (all characters typed correctly)
    if (newInput.length >= passage.text.length && correctCount === passage.text.length) {
      completeTest();
    }
  }, [testStatus, passage, characterStates, errors, currentPosition, startTest, completeTest, updateRealTimeStats]);
  
  // Handle keyboard events
  const handleKeyDown = useCallback((event) => {
    if (testStatus === 'ready' && event.key !== 'Tab' && event.key !== 'Escape') {
      startTest();
    }
    
    if (event.key === 'Escape') {
      if (testStatus === 'active') {
        completeTest();
      } else if (testStatus === 'completed') {
        resetTest();
      }
    }
    
    // Prevent certain browser shortcuts during test
    if (testStatus === 'active') {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
      }
    }
  }, [testStatus, startTest, completeTest, resetTest]);
  
  // Calculate progress
  const progress = passage?.text ? calculateProgress(currentPosition, passage.text.length) : 0;
  
  // Calculate time progress
  const timeProgress = ((TEST_DURATION - timeRemaining) / TEST_DURATION) * 100;
  
  // Generate test results
  const getTestResults = useCallback(() => {
    if (!passage || !startTime) return null;
    
    const timeElapsed = testStatus === 'completed' ? 
      (TEST_DURATION - timeRemaining) : 
      (Date.now() - startTime) / 1000;
    
    const correctCharacters = characterStates.filter(state => state === 'correct').length;
    const totalCharacters = userInput.length;
    const incorrectCharacters = totalCharacters - correctCharacters;
    
    return {
      id: `test-${Date.now()}`,
      timestamp: Date.now(),
      difficulty: passage.difficulty,
      passage,
      performance: {
        wpm,
        accuracy,
        timeElapsed: Math.round(timeElapsed),
        totalCharacters,
        correctCharacters,
        incorrectCharacters,
        totalWords: Math.ceil(correctCharacters / 5)
      },
      errors,
      wpmHistory
    };
  }, [passage, startTime, testStatus, timeRemaining, characterStates, userInput.length, wpm, accuracy, errors, wpmHistory]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (wpmUpdateRef.current) clearInterval(wpmUpdateRef.current);
    };
  }, []);
  
  return {
    // State
    testStatus,
    userInput,
    currentPosition,
    timeRemaining,
    wpm,
    accuracy,
    errors,
    characterStates,
    progress,
    timeProgress,
    
    // Actions
    startTest,
    resetTest,
    handleInput,
    handleKeyDown,
    getTestResults,
    
    // Computed values
    isReady: testStatus === 'ready',
    isActive: testStatus === 'active',
    isCompleted: testStatus === 'completed',
    canStart: testStatus === 'ready' && passage?.text,
    timeElapsed: startTime ? Math.round((Date.now() - startTime) / 1000) : 0
  };
}