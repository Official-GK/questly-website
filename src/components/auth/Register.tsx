import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { registerWithEmail, loginWithGoogle } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

interface RegisterProps {
  onComplete: (email: string) => void;
}

export default function Register({ onComplete }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate: any = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      await registerWithEmail(email, password);
      onComplete(email);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      const result = await loginWithGoogle();
      if (result?.user?.email) {
        onComplete(result.user.email);
      } else {
        throw new Error('No email found from Google login');
      }
    } catch (error: any) {
      console.error('Google registration error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create account with Google.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neon-purple to-black p-8">
      <div className="max-w-md mx-auto">
        <Card className="p-6 bg-black/40 border-emerald-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/40 border-emerald-500/20 text-white"
                required
              />
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/40 border-emerald-500/20 text-white"
                required
              />
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-black/40 border-emerald-500/20 text-white"
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 text-black hover:bg-emerald-600"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-emerald-500/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleGoogleRegister}
              disabled={loading}
              className="w-full mt-4 bg-white text-black hover:bg-gray-100"
            >
              Continue with Google
            </Button>
          </div>
          
          <p className="mt-4 text-center text-zinc-400">
            Already have an account?{' '}
            <Button
              variant="link"
              className="text-emerald-500 hover:text-emerald-400"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </p>
        </Card>
      </div>
    </div>
  );
}
