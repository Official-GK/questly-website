import { FlashcardSet } from '@/types/flashcard';

const FLASHCARD_SETS_KEY = 'flashcard_sets';

export interface FlashcardProgress {
  setId: string;
  mastered: number;
  needsReview: number;
  lastReview: number;
  totalReviews: number;
}

// Save flashcard set
export const saveFlashcardSet = (set: FlashcardSet): void => {
  try {
    const existingSets = getFlashcardSets();
    existingSets.push(set);
    localStorage.setItem(FLASHCARD_SETS_KEY, JSON.stringify(existingSets));
  } catch (error) {
    console.error('Error saving flashcard set:', error);
    throw new Error('Failed to save flashcard set');
  }
};

// Get all flashcard sets
export const getFlashcardSets = (): FlashcardSet[] => {
  try {
    const setsJson = localStorage.getItem(FLASHCARD_SETS_KEY);
    return setsJson ? JSON.parse(setsJson) : [];
  } catch (error) {
    console.error('Error getting flashcard sets:', error);
    return [];
  }
};

// Get a specific flashcard set
export const getFlashcardSet = (setId: string): FlashcardSet | null => {
  try {
    const sets = getFlashcardSets();
    return sets.find(set => set.id === setId) || null;
  } catch (error) {
    console.error('Error getting flashcard set:', error);
    return null;
  }
};

// Update flashcard progress
export const updateProgress = (
  userId: string,
  setId: string,
  mastered: number,
  needsReview: number
): void => {
  try {
    const progress: FlashcardProgress = {
      setId,
      mastered,
      needsReview,
      lastReview: Date.now(),
      totalReviews: mastered + needsReview
    };

    // Save to user's progress
    const progressKey = `flashcard_progress_${userId}`;
    const existingProgress = localStorage.getItem(progressKey);
    const allProgress = existingProgress ? JSON.parse(existingProgress) : {};
    
    allProgress[setId] = progress;
    localStorage.setItem(progressKey, JSON.stringify(allProgress));
  } catch (error) {
    console.error('Error updating flashcard progress:', error);
    throw new Error('Failed to update flashcard progress');
  }
};

// Get user's progress for a specific set
export const getProgress = (
  userId: string,
  setId: string
): FlashcardProgress | null => {
  try {
    const progressKey = `flashcard_progress_${userId}`;
    const existingProgress = localStorage.getItem(progressKey);
    if (!existingProgress) return null;

    const allProgress = JSON.parse(existingProgress);
    return allProgress[setId] || null;
  } catch (error) {
    console.error('Error getting flashcard progress:', error);
    return null;
  }
};

// Calculate study time based on progress
export const calculateStudyTime = (progress: FlashcardProgress): number => {
  // Assume average of 30 seconds per card review
  const timePerCard = 30; // seconds
  return Math.ceil((progress.mastered + progress.needsReview) * timePerCard / 60); // Convert to minutes
};
