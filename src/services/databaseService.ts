import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
  enableMultiTabIndexedDbPersistence,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { UserProfile, UserProgress, UserStats } from '@/types/user';
import { FlashcardSet } from '@/types/flashcard';
import { QuizAttempt } from '@/types/quiz';

// Initialize Firestore connection
let firestoreInitialized = false;

// Wait for Firestore to be ready
const waitForFirestore = async () => {
  if (firestoreInitialized) return true;

  try {
    // Try to access Firestore
    const testRef = doc(db, '_test', 'connection');
    await setDoc(testRef, { timestamp: new Date().toISOString() });
    firestoreInitialized = true;
    console.log('Firestore connection established');
    return true;
  } catch (error) {
    console.error('Error connecting to Firestore:', error);
    throw error;
  }
};

// Helper function to handle Firestore errors
const handleFirestoreError = (error: any, operation: string) => {
  console.error(`Error in ${operation}:`, error);
  if (error.code === 'unavailable') {
    throw new Error('Unable to connect to the server. Please check your internet connection.');
  }
  throw new Error(error.message || 'An error occurred while accessing the database');
};

// User Services
export const createUserProfile = async (userId: string, profile: Partial<UserProfile>) => {
  try {
    await waitForFirestore();
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create new profile
      await setDoc(userRef, {
        ...profile,
        id: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isPremium: false,
        role: profile.role || 'Learner',
        level: profile.level || 1,
        xp: profile.xp || {
          current: 0,
          nextLevel: 1000,
        },
        stats: profile.stats || {
          coursesCompleted: 0,
          quizzesTaken: 0,
          averageScore: 0,
          streak: 0,
        }
      });
    } else {
      // Update existing profile
      await updateDoc(userRef, {
        ...profile,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error: any) {
    handleFirestoreError(error, 'creating user profile');
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    await waitForFirestore();
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error: any) {
    handleFirestoreError(error, 'getting user profile');
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error: any) {
    handleFirestoreError(error, 'updating user profile');
  }
};

// Progress Services
export const updateUserProgress = async (userId: string, progress: UserProgress) => {
  try {
    const progressRef = doc(db, 'progress', userId);
    await setDoc(progressRef, {
      ...progress,
      updatedAt: Timestamp.now()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, 'updating user progress');
  }
};

export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  try {
    const docRef = doc(db, 'progress', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as UserProgress : null;
  } catch (error) {
    return handleFirestoreError(error, 'getting user progress');
  }
};

// Flashcard Services
export const saveFlashcardSet = async (userId: string, set: FlashcardSet) => {
  try {
    const setRef = doc(db, 'flashcardSets', set.id);
    await setDoc(setRef, {
      ...set,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, 'saving flashcard set');
  }
};

export const getUserFlashcardSets = async (userId: string): Promise<FlashcardSet[]> => {
  try {
    const q = query(
      collection(db, 'flashcardSets'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as FlashcardSet);
  } catch (error) {
    return handleFirestoreError(error, 'getting user flashcard sets');
  }
};

// Quiz Services
export const saveQuizAttempt = async (userId: string, attempt: QuizAttempt) => {
  try {
    const attemptRef = doc(collection(db, 'quizAttempts'));
    await setDoc(attemptRef, {
      ...attempt,
      userId,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, 'saving quiz attempt');
  }
};

export const getUserQuizAttempts = async (userId: string): Promise<QuizAttempt[]> => {
  try {
    const q = query(
      collection(db, 'quizAttempts'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as QuizAttempt);
  } catch (error) {
    return handleFirestoreError(error, 'getting user quiz attempts');
  }
};

// Stats Services
export const updateUserStats = async (userId: string, stats: UserStats) => {
  try {
    const statsRef = doc(db, 'stats', userId);
    await setDoc(statsRef, {
      ...stats,
      updatedAt: Timestamp.now()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, 'updating user stats');
  }
};

export const getUserStats = async (userId: string): Promise<UserStats | null> => {
  try {
    const docRef = doc(db, 'stats', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as UserStats : null;
  } catch (error) {
    return handleFirestoreError(error, 'getting user stats');
  }
};

// Premium Services
export async function updatePremiumStatus(userId: string, isPremium: boolean) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { isPremium });
    return true;
  } catch (error) {
    handleFirestoreError(error, 'updating premium status');
    return false;
  }
}

export async function setAllUsersPremium() {
  try {
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    
    const updatePromises = usersSnapshot.docs.map(doc => 
      updateDoc(doc.ref, { isPremium: true })
    );
    
    await Promise.all(updatePromises);
    return true;
  } catch (error) {
    handleFirestoreError(error, 'setting all users premium');
    return false;
  }
}
