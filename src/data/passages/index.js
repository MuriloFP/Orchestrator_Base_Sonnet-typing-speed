/**
 * Passage data exports for typing test
 * Provides centralized access to all difficulty levels
 */

import { beginnerPassages } from './beginner.js';
import { intermediatePassages } from './intermediate.js';
import { advancedPassages } from './advanced.js';

// Export individual difficulty arrays
export { beginnerPassages, intermediatePassages, advancedPassages };

// Combined passages object for easy access
export const allPassages = {
  beginner: beginnerPassages,
  intermediate: intermediatePassages,
  advanced: advancedPassages
};

// Utility function to get random passage by difficulty
export function getRandomPassage(difficulty) {
  const passages = allPassages[difficulty];
  if (!passages || passages.length === 0) {
    throw new Error(`No passages found for difficulty: ${difficulty}`);
  }
  
  const randomIndex = Math.floor(Math.random() * passages.length);
  return passages[randomIndex];
}

// Utility function to get all passages as flat array
export function getAllPassagesFlat() {
  return [
    ...beginnerPassages,
    ...intermediatePassages,
    ...advancedPassages
  ];
}

// Utility function to get passage by ID
export function getPassageById(id) {
  const allFlat = getAllPassagesFlat();
  return allFlat.find(passage => passage.id === id);
}

// Get difficulty levels
export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'];

// Get passage count by difficulty
export function getPassageCount(difficulty) {
  return allPassages[difficulty]?.length || 0;
}

// Get total passage count
export function getTotalPassageCount() {
  return DIFFICULTY_LEVELS.reduce((total, difficulty) => {
    return total + getPassageCount(difficulty);
  }, 0);
}