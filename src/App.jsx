/**
 * Main App component - Root component managing application state
 * Handles difficulty selection, test orchestration, and results display
 */

import { useState } from 'react';
import TypingTest from './components/TypingTest.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('difficulty-selection'); // 'difficulty-selection' | 'typing-test' | 'results'
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [theme, setTheme] = useState('light');

  // Handle difficulty selection
  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setCurrentView('typing-test');
  };

  // Handle test completion
  const handleTestComplete = (results) => {
    setTestResults(results);
    setCurrentView('results');
  };

  // Handle test restart
  const handleRestart = () => {
    setTestResults(null);
    setCurrentView('typing-test');
  };

  // Handle new test (back to difficulty selection)
  const handleNewTest = () => {
    setSelectedDifficulty(null);
    setTestResults(null);
    setCurrentView('difficulty-selection');
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`App ${theme}`}>
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-icon">⌨️</span>
            Typing Speed Test
          </h1>
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Difficulty Selection View */}
        {currentView === 'difficulty-selection' && (
          <div className="difficulty-selection">
            <div className="selection-header">
              <h2>Choose Your Difficulty Level</h2>
              <p>Select a difficulty level to begin your typing speed test</p>
            </div>

            <div className="difficulty-options">
              <div 
                className="difficulty-card beginner"
                onClick={() => handleDifficultySelect('beginner')}
              >
                <div className="card-icon">🌱</div>
                <h3>Beginner</h3>
                <p>Simple words and basic punctuation</p>
                <div className="card-stats">
                  <span>Average: 25-35 WPM</span>
                  <span>Common words</span>
                </div>
              </div>

              <div 
                className="difficulty-card intermediate"
                onClick={() => handleDifficultySelect('intermediate')}
              >
                <div className="card-icon">📈</div>
                <h3>Intermediate</h3>
                <p>Moderate vocabulary with mixed punctuation</p>
                <div className="card-stats">
                  <span>Average: 35-50 WPM</span>
                  <span>Varied content</span>
                </div>
              </div>

              <div 
                className="difficulty-card advanced"
                onClick={() => handleDifficultySelect('advanced')}
              >
                <div className="card-icon">🚀</div>
                <h3>Advanced</h3>
                <p>Complex vocabulary and extensive punctuation</p>
                <div className="card-stats">
                  <span>Average: 50+ WPM</span>
                  <span>Technical terms</span>
                </div>
              </div>
            </div>

            <div className="selection-info">
              <h3>Test Information</h3>
              <ul>
                <li>⏱️ Duration: 60 seconds</li>
                <li>📊 Real-time WPM and accuracy tracking</li>
                <li>🎯 Focus on accuracy first, speed will follow</li>
                <li>⌨️ Use all fingers and proper technique</li>
              </ul>
            </div>
          </div>
        )}

        {/* Typing Test View */}
        {currentView === 'typing-test' && selectedDifficulty && (
          <div className="typing-test-view">
            <div className="test-navigation">
              <button 
                className="nav-button back-button"
                onClick={handleNewTest}
              >
                ← Back to Difficulty Selection
              </button>
              <div className="current-difficulty">
                <span>Current: </span>
                <span className={`difficulty-badge ${selectedDifficulty}`}>
                  {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
                </span>
              </div>
            </div>

            <ErrorBoundary>
              <TypingTest
                difficulty={selectedDifficulty}
                onTestComplete={handleTestComplete}
                onRestart={handleRestart}
              />
            </ErrorBoundary>
          </div>
        )}

        {/* Results View */}
        {currentView === 'results' && testResults && (
          <div className="results-view">
            <div className="results-header">
              <h2>🎉 Test Completed!</h2>
              <p>Here are your typing test results</p>
            </div>

            <div className="results-summary">
              <div className="result-card primary">
                <div className="result-value">{testResults.performance.wpm}</div>
                <div className="result-label">Words Per Minute</div>
              </div>

              <div className="result-card secondary">
                <div className="result-value">{testResults.performance.accuracy}%</div>
                <div className="result-label">Accuracy</div>
              </div>

              <div className="result-card tertiary">
                <div className="result-value">{testResults.performance.timeElapsed}s</div>
                <div className="result-label">Time Elapsed</div>
              </div>
            </div>

            <div className="detailed-results">
              <h3>Detailed Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Total Characters:</span>
                  <span className="stat-value">{testResults.performance.totalCharacters}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Correct Characters:</span>
                  <span className="stat-value">{testResults.performance.correctCharacters}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Incorrect Characters:</span>
                  <span className="stat-value">{testResults.performance.incorrectCharacters}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Words:</span>
                  <span className="stat-value">{testResults.performance.totalWords}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Errors Made:</span>
                  <span className="stat-value">{testResults.errors.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Difficulty:</span>
                  <span className="stat-value">{testResults.difficulty}</span>
                </div>
              </div>
            </div>

            <div className="performance-feedback">
              <h3>Performance Analysis</h3>
              <div className="feedback-content">
                {testResults.performance.wpm >= 60 && testResults.performance.accuracy >= 95 && (
                  <div className="feedback-item excellent">
                    🌟 Excellent performance! You&rsquo;re a skilled typist.
                  </div>
                )}
                {testResults.performance.wpm >= 40 && testResults.performance.accuracy >= 90 && testResults.performance.wpm < 60 && (
                  <div className="feedback-item good">
                    👍 Good job! Keep practicing to improve your speed.
                  </div>
                )}
                {testResults.performance.wpm < 40 && testResults.performance.accuracy >= 85 && (
                  <div className="feedback-item average">
                    📈 Focus on building speed while maintaining accuracy.
                  </div>
                )}
                {testResults.performance.accuracy < 85 && (
                  <div className="feedback-item needs-improvement">
                    🎯 Focus on accuracy first. Slow down and build muscle memory.
                  </div>
                )}
              </div>
            </div>

            <div className="results-actions">
              <button 
                className="action-button primary"
                onClick={handleRestart}
              >
                🔄 Try Again
              </button>
              <button 
                className="action-button secondary"
                onClick={() => {
                  setCurrentView('typing-test');
                  setTestResults(null);
                }}
              >
                📝 New Passage
              </button>
              <button 
                className="action-button tertiary"
                onClick={handleNewTest}
              >
                🎯 Change Difficulty
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Built with React + Vite • Focus on accuracy, speed will follow</p>
      </footer>
    </div>
  );
}

export default App;