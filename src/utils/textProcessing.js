/**
 * Text processing utilities for typing test functionality
 * Handles word analysis, character validation, and text metrics
 */

/**
 * Split text into individual characters while preserving spaces and punctuation
 * @param {string} text - Input text to process
 * @returns {string[]} Array of individual characters
 */
export function splitIntoCharacters(text) {
  return text.split('');
}

/**
 * Split text into words, handling punctuation and spaces
 * @param {string} text - Input text to process
 * @returns {string[]} Array of words
 */
export function splitIntoWords(text) {
  return text.trim().split(/\s+/).filter(word => word.length > 0);
}

/**
 * Count total words in text
 * @param {string} text - Input text
 * @returns {number} Word count
 */
export function countWords(text) {
  return splitIntoWords(text).length;
}

/**
 * Calculate average word length
 * @param {string} text - Input text
 * @returns {number} Average word length
 */
export function calculateAverageWordLength(text) {
  const words = splitIntoWords(text);
  if (words.length === 0) return 0;
  
  const totalLength = words.reduce((sum, word) => {
    // Remove punctuation for word length calculation
    const cleanWord = word.replace(/[^\w]/g, '');
    return sum + cleanWord.length;
  }, 0);
  
  return Math.round((totalLength / words.length) * 10) / 10; // Round to 1 decimal
}

/**
 * Calculate punctuation density (percentage of punctuation characters)
 * @param {string} text - Input text
 * @returns {number} Punctuation density as percentage
 */
export function calculatePunctuationDensity(text) {
  if (text.length === 0) return 0;
  
  const punctuationCount = (text.match(/[^\w\s]/g) || []).length;
  return Math.round((punctuationCount / text.length) * 100);
}

/**
 * Get most common words from text
 * @param {string} text - Input text
 * @param {number} limit - Maximum number of words to return
 * @returns {string[]} Array of most common words
 */
export function getCommonWords(text, limit = 10) {
  const words = splitIntoWords(text.toLowerCase());
  const wordCount = {};
  
  // Count word frequencies
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '');
    if (cleanWord.length > 0) {
      wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
    }
  });
  
  // Sort by frequency and return top words
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([word]) => word);
}

/**
 * Validate character input against expected character
 * @param {string} typed - Character typed by user
 * @param {string} expected - Expected character
 * @returns {object} Validation result with status and details
 */
export function validateCharacter(typed, expected) {
  return {
    isCorrect: typed === expected,
    typed,
    expected,
    isSpace: expected === ' ',
    isPunctuation: /[^\w\s]/.test(expected),
    isAlphanumeric: /[a-zA-Z0-9]/.test(expected)
  };
}

/**
 * Analyze typing errors in user input
 * @param {string} userInput - User's typed input
 * @param {string} expectedText - Expected text
 * @returns {object} Error analysis with details
 */
export function analyzeErrors(userInput, expectedText) {
  const errors = [];
  const maxLength = Math.max(userInput.length, expectedText.length);
  
  for (let i = 0; i < maxLength; i++) {
    const typed = userInput[i] || '';
    const expected = expectedText[i] || '';
    
    if (typed !== expected) {
      errors.push({
        position: i,
        typed,
        expected,
        type: getErrorType(typed, expected)
      });
    }
  }
  
  return {
    errors,
    totalErrors: errors.length,
    errorRate: expectedText.length > 0 ? (errors.length / expectedText.length) * 100 : 0
  };
}

/**
 * Determine the type of typing error
 * @param {string} typed - Character typed
 * @param {string} expected - Expected character
 * @returns {string} Error type
 */
function getErrorType(typed, expected) {
  if (typed === '' && expected !== '') return 'omission';
  if (typed !== '' && expected === '') return 'insertion';
  if (typed !== expected) return 'substitution';
  return 'none';
}

/**
 * Calculate text difficulty score based on various factors
 * @param {string} text - Input text to analyze
 * @returns {object} Difficulty analysis
 */
export function calculateTextDifficulty(text) {
  const wordCount = countWords(text);
  const avgWordLength = calculateAverageWordLength(text);
  const punctuationDensity = calculatePunctuationDensity(text);
  const uniqueWords = new Set(splitIntoWords(text.toLowerCase())).size;
  const vocabularyDiversity = wordCount > 0 ? uniqueWords / wordCount : 0;
  
  // Calculate difficulty score (0-100)
  let difficultyScore = 0;
  
  // Word length factor (longer words = harder)
  difficultyScore += Math.min(avgWordLength * 8, 40);
  
  // Punctuation factor (more punctuation = harder)
  difficultyScore += Math.min(punctuationDensity * 0.5, 20);
  
  // Vocabulary diversity factor (more unique words = harder)
  difficultyScore += Math.min(vocabularyDiversity * 40, 40);
  
  return {
    score: Math.round(difficultyScore),
    level: getDifficultyLevel(difficultyScore),
    factors: {
      avgWordLength,
      punctuationDensity,
      vocabularyDiversity: Math.round(vocabularyDiversity * 100),
      wordCount
    }
  };
}

/**
 * Get difficulty level based on score
 * @param {number} score - Difficulty score
 * @returns {string} Difficulty level
 */
function getDifficultyLevel(score) {
  if (score < 30) return 'beginner';
  if (score < 60) return 'intermediate';
  return 'advanced';
}

/**
 * Normalize text for consistent processing
 * @param {string} text - Input text
 * @returns {string} Normalized text
 */
export function normalizeText(text) {
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim(); // Remove leading/trailing whitespace
}

/**
 * Get character position info for cursor placement
 * @param {string} text - Full text
 * @param {number} position - Character position
 * @returns {object} Position information
 */
export function getCharacterPosition(text, position) {
  const beforeText = text.substring(0, position);
  const currentChar = text[position] || '';
  const afterText = text.substring(position + 1);
  
  return {
    before: beforeText,
    current: currentChar,
    after: afterText,
    isEnd: position >= text.length,
    lineBreaks: (beforeText.match(/\n/g) || []).length
  };
}