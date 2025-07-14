/**
 * Utility functions for typing test calculations
 * Based on standard typing test metrics and algorithms
 */

/**
 * Calculate Words Per Minute (WPM)
 * Standard: 5 characters = 1 word
 * @param {number} correctCharacters - Number of correctly typed characters
 * @param {number} timeElapsedSeconds - Time elapsed in seconds
 * @returns {number} WPM rounded to nearest integer
 */
export function calculateWPM(correctCharacters, timeElapsedSeconds) {
  if (timeElapsedSeconds === 0) return 0;
  
  const wordsTyped = correctCharacters / 5; // Standard: 5 characters = 1 word
  const minutes = timeElapsedSeconds / 60;
  return Math.round(wordsTyped / minutes);
}

/**
 * Calculate typing accuracy percentage
 * @param {number} correctCharacters - Number of correctly typed characters
 * @param {number} totalCharacters - Total number of characters typed
 * @returns {number} Accuracy percentage rounded to nearest integer
 */
export function calculateAccuracy(correctCharacters, totalCharacters) {
  if (totalCharacters === 0) return 100;
  return Math.round((correctCharacters / totalCharacters) * 100);
}

/**
 * Calculate progress through the passage
 * @param {number} currentPosition - Current typing position
 * @param {number} totalLength - Total length of the passage
 * @returns {number} Progress percentage (0-100)
 */
export function calculateProgress(currentPosition, totalLength) {
  if (totalLength === 0) return 0;
  return Math.min((currentPosition / totalLength) * 100, 100);
}

/**
 * Calculate net WPM (accounting for errors)
 * @param {number} grossWPM - Gross WPM (without error penalty)
 * @param {number} errors - Number of errors made
 * @param {number} timeElapsedMinutes - Time elapsed in minutes
 * @returns {number} Net WPM
 */
export function calculateNetWPM(grossWPM, errors, timeElapsedMinutes) {
  if (timeElapsedMinutes === 0) return 0;
  const errorPenalty = errors / timeElapsedMinutes;
  return Math.max(0, Math.round(grossWPM - errorPenalty));
}

/**
 * Calculate typing consistency score
 * @param {number[]} wpmHistory - Array of WPM values over time
 * @returns {number} Consistency score (0-100)
 */
export function calculateConsistency(wpmHistory) {
  if (wpmHistory.length < 2) return 100;
  
  const mean = wpmHistory.reduce((sum, wpm) => sum + wpm, 0) / wpmHistory.length;
  const variance = wpmHistory.reduce((sum, wpm) => sum + Math.pow(wpm - mean, 2), 0) / wpmHistory.length;
  const standardDeviation = Math.sqrt(variance);
  
  // Convert to consistency score (lower deviation = higher consistency)
  const consistencyScore = Math.max(0, 100 - (standardDeviation / mean) * 100);
  return Math.round(consistencyScore);
}

/**
 * Format time in MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Calculate error rate per minute
 * @param {number} errors - Total number of errors
 * @param {number} timeElapsedMinutes - Time elapsed in minutes
 * @returns {number} Errors per minute
 */
export function calculateErrorRate(errors, timeElapsedMinutes) {
  if (timeElapsedMinutes === 0) return 0;
  return Math.round(errors / timeElapsedMinutes);
}