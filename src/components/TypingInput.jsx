/**
 * TypingInput component - handles user keyboard input for typing test
 * Invisible input field that captures keystrokes and manages focus
 */

import { useRef, useEffect } from 'react';
import { useKeyboardInput } from '../hooks/useKeyboardInput.js';
import './TypingInput.css';

function TypingInput({ 
  value = '', 
  onChange, 
  onKeyDown, 
  isDisabled = false, 
  autoFocus = false,
  placeholder = ''
}) {
  const containerRef = useRef(null);
  
  // Use the keyboard input hook
  const {
    inputProps,
    focus,
    blur
  } = useKeyboardInput(onChange, onKeyDown, !isDisabled);
  
  // Handle container click to focus input
  const handleContainerClick = () => {
    if (!isDisabled) {
      focus();
    }
  };
  
  // Auto-focus when enabled
  useEffect(() => {
    if (autoFocus && !isDisabled) {
      focus();
    }
  }, [autoFocus, isDisabled, focus]);
  
  // Blur when disabled
  useEffect(() => {
    if (isDisabled) {
      blur();
    }
  }, [isDisabled, blur]);
  
  return (
    <div 
      className={`typing-input-container ${isDisabled ? 'disabled' : 'active'}`}
      onClick={handleContainerClick}
      ref={containerRef}
    >
      {/* Invisible input field */}
      <input
        {...inputProps}
        type="text"
        className="typing-input"
        placeholder={placeholder}
        style={{
          position: 'absolute',
          left: '-9999px',
          opacity: 0,
          pointerEvents: 'none'
        }}
      />
      
      {/* Visual input area */}
      <div className={`input-display ${!isDisabled ? 'focused' : ''}`}>
        {!isDisabled ? (
          <div className="input-prompt">
            <span className="input-icon">⌨️</span>
            <span className="input-text">
              {placeholder || 'Click here and start typing...'}
            </span>
            <span className="cursor-blink">|</span>
          </div>
        ) : (
          <div className="input-disabled">
            <span className="disabled-icon">⏸️</span>
            <span className="disabled-text">Test not active</span>
          </div>
        )}
      </div>
      
      {/* Input feedback */}
      <div className="input-feedback">
        {value.length > 0 && (
          <div className="character-count">
            {value.length} characters typed
          </div>
        )}
        
        {!isDisabled && (
          <div className="input-hints">
            <span>Press Escape to stop • Focus on accuracy</span>
          </div>
        )}
      </div>
    </div>
  );
}

// PropTypes
import PropTypes from 'prop-types';

TypingInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  isDisabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  placeholder: PropTypes.string
};

export default TypingInput;