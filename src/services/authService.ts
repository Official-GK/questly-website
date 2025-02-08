import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut,
  User
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { createUserProfile } from './databaseService';

// Validation functions
const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return null;
};

const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

const handleAuthError = (error: any, context?: string): string => {
  console.error('Auth error:', error);
  
  switch (error.code) {
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/email-already-in-use':
      return 'Email already registered';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/operation-not-allowed':
      return 'Operation not allowed';
    case 'auth/user-not-found':
      return 'User not found';
    case 'auth/wrong-password':
      return 'Incorrect password';
    default:
      return error.message || 'An error occurred during authentication';
  }
};

export const registerWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    // Validate inputs
    const passwordError = validatePassword(password);
    if (passwordError) {
      throw new Error(passwordError);
    }

    const emailError = validateEmail(email);
    if (emailError) {
      throw new Error(emailError);
    }

    // Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create initial profile
    await createUserProfile(userCredential.user.uid, {
      email: userCredential.user.email || '',
      name: email.split('@')[0],
      createdAt: new Date().toISOString(),
      role: 'Learner',
      level: 1,
      xp: {
        current: 0,
        nextLevel: 1000,
      },
      stats: {
        coursesCompleted: 0,
        quizzesTaken: 0,
        averageScore: 0,
        streak: 0,
      }
    });

    return userCredential.user;
  } catch (error: any) {
    throw new Error(handleAuthError(error));
  }
};

export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Email login error:', error);
    throw new Error(handleAuthError(error, 'logging in with email'));
  }
};

export const loginWithGoogle = async (): Promise<User | null> => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: any) {
    console.error('Google login error:', error);
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign in was cancelled. Please try again.');
    }
    throw new Error(handleAuthError(error));
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    handleAuthError(error, 'logging out');
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
