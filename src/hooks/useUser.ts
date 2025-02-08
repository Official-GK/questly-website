import { useState, useEffect } from 'react';
import { UserProfile, UserProgress, UserStats } from '@/types/user';
import {
  getUserProfile,
  getUserProgress,
  getUserStats,
  saveUserProfile,
  saveUserProgress,
  saveUserStats,
  updateUserStats
} from '@/services/userService';

export function useUser() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = () => {
      const userProfile = getUserProfile();
      const userProgress = getUserProgress();
      const userStats = getUserStats();

      setProfile(userProfile);
      setProgress(userProgress);
      setStats(userStats);
      setLoading(false);
    };

    loadUserData();
  }, []);

  // Update last active time
  useEffect(() => {
    if (profile) {
      const updateLastActive = () => {
        const updatedProfile = {
          ...profile,
          lastActive: Date.now()
        };
        saveUserProfile(updatedProfile);
        setProfile(updatedProfile);
      };

      // Update on mount and every 5 minutes
      updateLastActive();
      const interval = setInterval(updateLastActive, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [profile]);

  // Create initial profile if none exists
  const createProfile = (email: string, name: string) => {
    const newProfile: UserProfile = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: Date.now(),
      lastActive: Date.now(),
      preferences: {
        darkMode: false,
        emailNotifications: true
      }
    };

    const newProgress: UserProgress = {
      userId: newProfile.id,
      topics: {},
      mockTests: {
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        lastAttempt: 0
      },
      quizzes: {
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        lastAttempt: 0
      },
      flashcards: {
        totalReviewed: 0,
        mastered: 0,
        needsReview: 0,
        lastReview: 0
      }
    };

    const newStats: UserStats = {
      dailyStreak: 1,
      totalStudyTime: 0,
      topicsExplored: 0,
      achievements: [],
      level: 1,
      experience: 0
    };

    saveUserProfile(newProfile);
    saveUserProgress(newProgress);
    saveUserStats(newStats);

    setProfile(newProfile);
    setProgress(newProgress);
    setStats(newStats);
  };

  // Update study time and stats
  const updateStudySession = (minutes: number) => {
    if (stats) {
      updateUserStats(minutes);
      const updatedStats = getUserStats();
      setStats(updatedStats);
    }
  };

  // Update user preferences
  const updatePreferences = (preferences: UserProfile['preferences']) => {
    if (profile) {
      const updatedProfile = {
        ...profile,
        preferences: {
          ...profile.preferences,
          ...preferences
        }
      };
      saveUserProfile(updatedProfile);
      setProfile(updatedProfile);
    }
  };

  return {
    profile,
    progress,
    stats,
    loading,
    createProfile,
    updateStudySession,
    updatePreferences
  };
}
