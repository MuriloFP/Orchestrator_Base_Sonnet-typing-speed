/**
 * TextDisplay component - renders the passage text with character-level highlighting
 * Shows correct, incorrect, and untyped characters with visual feedback
 */

import { useMemo, useEffect, useRef } from 'react';
import { popCharacter, shakeElement, safeAnimate } from '../utils/animations.js';
import './TextDisplay.css';

// Individual character component with state-based styling
function CharacterSpan({ character, status, isCurrent, index, previousStatus }) {
  const charRef = useRef(null);
  const className = `character ${status} ${isCurrent ? 'current' : ''}`;
  
  // Handle special characters for display
  const displayChar = character === ' ' ? '\u00A0' : character; // Non-breaking space
  
  // Animate character when status changes
  useEffect(() => {
    if (charRef.current && previousStatus !== status) {
      if (status === 'correct') {
        safeAnimate(() => popCharacter(charRef.current));
      } else if (status === 'incorrect') {
        safeAnimate(() => shakeElement(charRef.current, 'light'));
      }
    }
  }, [status, previousStatus]);
  
  return (
    <span
      ref={charRef}
      className={className}
      data-index={index}
      data-char={character}
    >
      {displayChar}
      {isCurrent && <span className="cursor animated-cursor">|</span>}
    </span>
  );
}

// Cursor component for when at end of text
function Cursor({ isActive }) {
  return (
    <span className={`cursor end-cursor ${isActive ? 'active' : ''}`}>
      |
    </span>
  );
}

function TextDisplay({
  passage,
  userInput = '',
  currentPosition = 0,
  characterStates = [],
  isActive = false
}) {
  const previousStatesRef = useRef([]);
  
  // Memoize character rendering for performance
  const renderedCharacters = useMemo(() => {
    if (!passage) return [];
    
    const previousStates = previousStatesRef.current;
    const newCharacters = passage.split('').map((char, index) => {
      const status = characterStates[index] || 'untyped';
      const previousStatus = previousStates[index] || 'untyped';
      const isCurrent = index === currentPosition && isActive;
      
      return (
        <CharacterSpan
          key={index}
          character={char}
          status={status}
          previousStatus={previousStatus}
          isCurrent={isCurrent}
          index={index}
        />
      );
    });
    
    // Update previous states for next render
    previousStatesRef.current = [...characterStates];
    
    return newCharacters;
  }, [passage, characterStates, currentPosition, isActive]);
  
  // Calculate display metrics
  const totalCharacters = passage?.length || 0;
  const typedCharacters = userInput.length;
  const correctCharacters = characterStates.filter(state => state === 'correct').length;
  const incorrectCharacters = characterStates.filter(state => state === 'incorrect').length;
  
  if (!passage) {
    return (
      <div className="text-display">
        <div className="text-content loading">
          <p>Loading passage...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="text-display">
      {/* Passage metadata */}
      <div className="passage-info">
        <div className="character-count">
          {typedCharacters} / {totalCharacters} characters
        </div>
        <div className="character-breakdown">
          <span className="correct-count">✓ {correctCharacters}</span>
          <span className="incorrect-count">✗ {incorrectCharacters}</span>
          <span className="remaining-count">⋯ {totalCharacters - typedCharacters}</span>
        </div>
      </div>
      
      {/* Main text content */}
      <div className={`text-content ${isActive ? 'active' : ''}`}>
        <div className="text-passage">
          {renderedCharacters}
          {currentPosition >= totalCharacters && isActive && (
            <Cursor isActive={isActive} />
          )}
        </div>
      </div>
      
      {/* Progress indicators */}
      <div className="text-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(typedCharacters / totalCharacters) * 100}%` }}
          />
          <div 
            className="accuracy-fill"
            style={{ width: `${(correctCharacters / totalCharacters) * 100}%` }}
          />
        </div>
        <div className="progress-labels">
          <span>Progress: {Math.round((typedCharacters / totalCharacters) * 100)}%</span>
          <span>Accuracy: {totalCharacters > 0 ? Math.round((correctCharacters / typedCharacters) * 100) || 0 : 100}%</span>
        </div>
      </div>
      
      {/* Typing hints */}
      {!isActive && (
        <div className="typing-hints">
          <p>💡 Tips:</p>
          <ul>
            <li>Focus on accuracy first, speed will follow</li>
            <li>Keep your fingers on the home row</li>
            <li>Look at the text, not your keyboard</li>
            <li>Maintain a steady rhythm</li>
          </ul>
        </div>
      )}
      
      {/* Current word highlight */}
      {isActive && (
        <div className="current-word-info">
          <span>Current word: </span>
          <span className="current-word">
            {getCurrentWord(passage, currentPosition)}
          </span>
        </div>
      )}
    </div>
  );
}

// Helper function to get the current word being typed
function getCurrentWord(text, position) {
  if (!text || position < 0) return '';
  
  // Find word boundaries around current position
  let start = position;
  let end = position;
  
  // Find start of current word
  while (start > 0 && text[start - 1] !== ' ') {
    start--;
  }
  
  // Find end of current word
  while (end < text.length && text[end] !== ' ') {
    end++;
  }
  
  return text.substring(start, end);
}

// PropTypes
import PropTypes from 'prop-types';

CharacterSpan.propTypes = {
  character: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['correct', 'incorrect', 'untyped']).isRequired,
  isCurrent: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  previousStatus: PropTypes.oneOf(['correct', 'incorrect', 'untyped'])
};

Cursor.propTypes = {
  isActive: PropTypes.bool.isRequired
};

TextDisplay.propTypes = {
  passage: PropTypes.string,
  userInput: PropTypes.string,
  currentPosition: PropTypes.number,
  characterStates: PropTypes.arrayOf(PropTypes.oneOf(['correct', 'incorrect', 'untyped'])),
  isActive: PropTypes.bool
};

export default TextDisplay;