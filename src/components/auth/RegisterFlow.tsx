import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Register from './Register';
import { ProfileSetupForm } from '../profile/ProfileSetupForm';
import { UserProfile } from '@/types/user';
import { createUserProfile } from '@/services/databaseService';
import { auth } from '@/config/firebase';

export default function RegisterFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');

  const handleRegistrationComplete = async (userEmail: string) => {
    setEmail(userEmail);
    setStep(2);
  };

  const handleProfileComplete = async (profileData: Partial<UserProfile>) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user found');

      // Create user profile with all the data
      await createUserProfile(user.uid, {
        ...profileData,
        email: email,
        createdAt: new Date().toISOString(),
      });

      // Navigate to profile page
      navigate('/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {step === 1 ? (
        <Register onComplete={handleRegistrationComplete} />
      ) : (
        <ProfileSetupForm onComplete={handleProfileComplete} />
      )}
    </div>
  );
}
