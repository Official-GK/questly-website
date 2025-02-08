import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, getRedirectResult } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { getUserProfile, updatePremiumStatus, createUserProfile } from '@/services/databaseService';
import { UserProfile } from '@/types/user';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  updateUserPremium: (isPremium: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  updateUserPremium: async () => false,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const handleRedirectResult = async () => {
      try {
        console.log('Checking redirect result...');
        const result = await getRedirectResult(auth);
        console.log('Redirect result:', result);
        
        if (result?.user && isMounted) {
          console.log('User from redirect:', result.user);
          await createUserProfile(result.user.uid, {
            id: result.user.uid,
            email: result.user.email || '',
            name: result.user.displayName || '',
            profileImage: result.user.photoURL || '',
            createdAt: new Date().toISOString(),
            isPremium: false
          });
          console.log('User profile created/updated');
          setCurrentUser(result.user);
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
      }
    };

    // Handle redirect result first
    handleRedirectResult();

    // Then set up auth state listener
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('Auth state changed:', user);
      if (!isMounted) return;

      setCurrentUser(user);
      
      if (user) {
        try {
          console.log('Fetching user profile...');
          const profile = await getUserProfile(user.uid);
          console.log('User profile:', profile);
          
          if (!isMounted) return;
          setUserProfile(profile);
          
          if (!profile) {
            console.log('Creating new user profile...');
            await createUserProfile(user.uid, {
              id: user.uid,
              email: user.email || '',
              name: user.displayName || '',
              profileImage: user.photoURL || '',
              createdAt: new Date().toISOString(),
              isPremium: false
            });
            const newProfile = await getUserProfile(user.uid);
            console.log('New profile created:', newProfile);
            if (!isMounted) return;
            setUserProfile(newProfile);
          }
        } catch (error) {
          console.error('Error fetching/creating user profile:', error);
        }
      } else {
        if (!isMounted) return;
        setUserProfile(null);
      }
      
      if (!isMounted) return;
      setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const updateUserPremium = async (isPremium: boolean) => {
    if (!currentUser) return false;
    
    const success = await updatePremiumStatus(currentUser.uid, isPremium);
    if (success && userProfile) {
      setUserProfile({ ...userProfile, isPremium });
    }
    return success;
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    updateUserPremium,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
