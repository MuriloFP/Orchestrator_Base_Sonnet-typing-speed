/**
 * Main TypingTest component - orchestrates the entire typing test experience
 * Coordinates between all child components and manages test state
 */

import { useState, useEffect, useRef } from 'react';
import { useTypingTest } from '../hooks/useTypingTest.js';
import { getRandomPassage } from '../data/passages/index.js';
import { shakeElement, safeAnimate } from '../utils/animations.js';
import TextDisplay from './TextDisplay.jsx';
import TypingInput from './TypingInput.jsx';
import StatsDisplay from './StatsDisplay.jsx';
import Timer from './Timer.jsx';
import ProgressBar from './ProgressBar.jsx';
import CelebrationManager from './CelebrationManager.jsx';
import './TypingTest.css';

function TypingTest({ difficulty = 'beginner', onTestComplete, onRestart }) {
  const [currentPassage, setCurrentPassage] = useState(null);
  const [lastErrorCount, setLastErrorCount] = useState(0);
  const typingInputRef = useRef(null);
  
  // Initialize passage when difficulty changes
  useEffect(() => {
    try {
      const passage = getRandomPassage(difficulty);
      setCurrentPassage(passage);
    } catch (error) {
      console.error('Failed to load passage:', error);
      // Fallback passage
      setCurrentPassage({
        id: 'fallback',
        difficulty,
        text: 'The quick brown fox jumps over the lazy dog. This is a fallback passage for typing practice.',
        wordCount: 16,
        averageWordLength: 4.2,
        commonWords: ['the', 'is', 'a', 'for'],
        punctuationDensity: 3,
        metadata: {
          source: 'Fallback',
          category: 'fallback',
          estimatedWPM: 35
        }
      });
    }
  }, [difficulty]);
  
  // Use the main typing test hook
  const {
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
    startTest,
    resetTest,
    handleInput,
    handleKeyDown,
    getTestResults,
    isReady,
    isActive,
    isCompleted,
    canStart,
    timeElapsed
  } = useTypingTest(currentPassage);
  
  // Handle test completion
  useEffect(() => {
    if (isCompleted && onTestComplete) {
      const results = getTestResults();
      if (results) {
        onTestComplete(results);
      }
    }
  }, [isCompleted, onTestComplete, getTestResults]);
  
  // Handle error shake animation
  useEffect(() => {
    if (errors.length > lastErrorCount && typingInputRef.current) {
      safeAnimate(() => shakeElement(typingInputRef.current, 'light'));
    }
    setLastErrorCount(errors.length);
  }, [errors.length, lastErrorCount]);
  
  // Handle restart
  const handleRestart = () => {
    resetTest();
    if (onRestart) {
      onRestart();
    }
  };
  
  // Handle new passage
  const handleNewPassage = () => {
    try {
      const newPassage = getRandomPassage(difficulty);
      setCurrentPassage(newPassage);
      resetTest();
    } catch (error) {
      console.error('Failed to load new passage:', error);
    }
  };
  
  // Don't render until passage is loaded
  if (!currentPassage) {
    return (
      <div className="typing-test loading">
        <p>Loading passage...</p>
      </div>
    );
  }
  
  return (
    <div className="typing-test">
      {/* Test Header */}
      <div className="test-header">
        <h2>Typing Speed Test</h2>
        <div className="test-info">
          <span className="difficulty">Difficulty: {difficulty}</span>
          <span className="passage-info">
            {currentPassage.wordCount} words • {currentPassage.metadata.category}
          </span>
        </div>
      </div>
      
      {/* Stats Display */}
      <StatsDisplay
        wpm={wpm}
        accuracy={accuracy}
        timeRemaining={timeRemaining}
        progress={progress}
        isActive={isActive}
      />
      
      {/* Timer */}
      <Timer
        timeRemaining={timeRemaining}
        totalTime={60}
        isActive={isActive}
      />
      
      {/* Progress Bar */}
      <ProgressBar
        progress={progress}
        timeProgress={timeProgress}
        isActive={isActive}
      />
      
      {/* Text Display */}
      <TextDisplay
        passage={currentPassage.text}
        userInput={userInput}
        currentPosition={currentPosition}
        characterStates={characterStates}
        isActive={isActive}
      />
      
      {/* Typing Input */}
      <div ref={typingInputRef}>
        <TypingInput
          value={userInput}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          isDisabled={!isActive && !isReady}
          autoFocus={isReady || isActive}
          placeholder={isReady ? "Start typing to begin the test..." : ""}
        />
      </div>
      
      {/* Test Controls */}
      <div className="test-controls">
        {isReady && (
          <button 
            className="btn btn-primary"
            onClick={startTest}
            disabled={!canStart}
          >
            Start Test
          </button>
        )}
        
        {isActive && (
          <button 
            className="btn btn-secondary"
            onClick={handleRestart}
          >
            Restart
          </button>
        )}
        
        {isCompleted && (
          <div className="completion-controls">
            <button 
              className="btn btn-primary"
              onClick={handleRestart}
            >
              Try Again
            </button>
            <button 
              className="btn btn-secondary"
              onClick={handleNewPassage}
            >
              New Passage
            </button>
          </div>
        )}
        
        {(isReady || isCompleted) && (
          <button 
            className="btn btn-outline"
            onClick={handleNewPassage}
          >
            Different Passage
          </button>
        )}
      </div>
      
      {/* Test Status Indicator */}
      <div className={`test-status status-${testStatus}`}>
        {isReady && <span>Ready to start</span>}
        {isActive && <span>Test in progress...</span>}
        {isCompleted && (
          <div className="completion-message">
            <span>Test completed!</span>
            <div className="final-stats">
              <span>{wpm} WPM</span>
              <span>{accuracy}% accuracy</span>
              <span>{timeElapsed}s elapsed</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Error Summary (only show if there are errors) */}
      {errors.length > 0 && (
        <div className="error-summary">
          <h4>Errors: {errors.length}</h4>
          <div className="error-list">
            {errors.slice(0, 5).map((error, index) => (
              <div key={index} className="error-item">
                <span className="error-position">Position {error.position}:</span>
                <span className="error-expected">Expected &ldquo;{error.expectedCharacter}&rdquo;</span>
                <span className="error-typed">Typed &ldquo;{error.typedCharacter}&rdquo;</span>
              </div>
            ))}
            {errors.length > 5 && (
              <div className="error-more">
                ...and {errors.length - 5} more errors
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Celebration Manager */}
      <CelebrationManager
        wpm={wpm}
        accuracy={accuracy}
        isTestComplete={isCompleted}
        testResults={isCompleted ? getTestResults() : null}
      />
    </div>
  );
}

// PropTypes
import PropTypes from 'prop-types';

TypingTest.propTypes = {
  difficulty: PropTypes.oneOf(['beginner', 'intermediate', 'advanced']),
  onTestComplete: PropTypes.func,
  onRestart: PropTypes.func
};

export default TypingTest;