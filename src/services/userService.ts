import { UserProfile, UserProgress, UserStats } from '@/types/user';
import { db } from '@/config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const USER_PROFILE_KEY = 'user_profile';
const USER_PROGRESS_KEY = 'user_progress';
const USER_STATS_KEY = 'user_stats';

// User Profile Management with Firebase
export const updateUserProfile = async (userId: string, profile: UserProfile): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...profile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    // Also update local storage for offline access
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    // Try to get from Firebase first
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const profile = userDoc.data() as UserProfile;
      // Update local storage
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
      return profile;
    }
    
    // Fallback to local storage
    const profileJson = localStorage.getItem(USER_PROFILE_KEY);
    return profileJson ? JSON.parse(profileJson) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    // Fallback to local storage on error
    const profileJson = localStorage.getItem(USER_PROFILE_KEY);
    return profileJson ? JSON.parse(profileJson) : null;
  }
};

// User Progress Management
export const saveUserProgress = (progress: UserProgress): void => {
  try {
    localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving user progress:', error);
    throw new Error('Failed to save user progress');
  }
};

export const getUserProgress = (): UserProgress | null => {
  try {
    const progressJson = localStorage.getItem(USER_PROGRESS_KEY);
    return progressJson ? JSON.parse(progressJson) : null;
  } catch (error) {
    console.error('Error getting user progress:', error);
    return null;
  }
};

// User Stats Management
export const saveUserStats = (stats: UserStats): void => {
  try {
    localStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving user stats:', error);
    throw new Error('Failed to save user stats');
  }
};

export const getUserStats = (): UserStats | null => {
  try {
    const statsJson = localStorage.getItem(USER_STATS_KEY);
    return statsJson ? JSON.parse(statsJson) : null;
  } catch (error) {
    console.error('Error getting user stats:', error);
    return null;
  }
};

// Progress Update Helpers
export const updateTopicProgress = (
  userId: string,
  topicId: string,
  score: number,
  totalQuestions: number
): void => {
  const progress = getUserProgress();
  if (!progress) {
    return;
  }

  const topicProgress = progress.topics[topicId] || {
    totalAttempts: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    averageScore: 0,
    lastAttempt: 0
  };

  // Update topic progress
  topicProgress.totalAttempts += 1;
  topicProgress.correctAnswers += score;
  topicProgress.totalQuestions += totalQuestions;
  topicProgress.averageScore = (topicProgress.correctAnswers / topicProgress.totalQuestions) * 100;
  topicProgress.lastAttempt = Date.now();

  // Save updated progress
  progress.topics[topicId] = topicProgress;
  saveUserProgress(progress);
};

export const updateMockTestProgress = (score: number): void => {
  const progress = getUserProgress();
  if (!progress) {
    return;
  }

  const mockTests = progress.mockTests;
  mockTests.totalAttempts += 1;
  mockTests.averageScore = ((mockTests.averageScore * (mockTests.totalAttempts - 1)) + score) / mockTests.totalAttempts;
  mockTests.bestScore = Math.max(mockTests.bestScore, score);
  mockTests.lastAttempt = Date.now();

  saveUserProgress(progress);
};

export const updateQuizProgress = (score: number): void => {
  const progress = getUserProgress();
  if (!progress) {
    return;
  }

  const quizzes = progress.quizzes;
  quizzes.totalAttempts += 1;
  quizzes.averageScore = ((quizzes.averageScore * (quizzes.totalAttempts - 1)) + score) / quizzes.totalAttempts;
  quizzes.bestScore = Math.max(quizzes.bestScore, score);
  quizzes.lastAttempt = Date.now();

  saveUserProgress(progress);
};

export const updateFlashcardProgress = (mastered: number, needsReview: number): void => {
  const progress = getUserProgress();
  if (!progress) {
    return;
  }

  const flashcards = progress.flashcards;
  flashcards.totalReviewed += mastered + needsReview;
  flashcards.mastered += mastered;
  flashcards.needsReview = needsReview;
  flashcards.lastReview = Date.now();

  saveUserProgress(progress);
};

// Stats Update Helpers
export const updateUserStats = (studyTime: number): void => {
  const stats = getUserStats();
  if (!stats) {
    return;
  }

  // Update study time
  stats.totalStudyTime += studyTime;

  // Check for daily streak
  const lastActive = getUserProfile()?.lastActive || 0;
  const oneDayInMs = 24 * 60 * 60 * 1000;
  const now = Date.now();

  if (now - lastActive <= oneDayInMs) {
    stats.dailyStreak += 1;
  } else if (now - lastActive > 2 * oneDayInMs) {
    stats.dailyStreak = 1;
  }

  // Update experience and level
  const experienceGained = Math.floor(studyTime / 10); // 1 XP per 10 minutes
  stats.experience += experienceGained;

  // Level up if enough experience (100 XP per level)
  while (stats.experience >= 100) {
    stats.level += 1;
    stats.experience -= 100;
  }

  saveUserStats(stats);
};
