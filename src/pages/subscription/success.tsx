import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getSubscriptionStatus } from '@/api/stripe';

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { user, refreshUser } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifySubscription = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        if (!sessionId) {
          throw new Error('No session ID found');
        }

        const isSuccess = await getSubscriptionStatus(sessionId);
        if (!isSuccess) {
          throw new Error('Payment verification failed');
        }

        // Refresh the user's profile to get updated subscription status
        if (refreshUser) {
          await refreshUser();
        }

        toast({
          title: "Subscription Successful!",
          description: "Thank you for subscribing. Your account has been upgraded.",
        });

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } catch (error) {
        console.error('Subscription verification error:', error);
        toast({
          title: "Verification Failed",
          description: "There was an issue verifying your subscription. Please contact support.",
          variant: "destructive",
        });
        setTimeout(() => {
          navigate('/subscription');
        }, 3000);
      } finally {
        setIsVerifying(false);
      }
    };

    verifySubscription();
  }, [navigate, toast, searchParams, refreshUser]);

  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto text-center">
        {isVerifying ? (
          <>
            <Loader2 className="w-16 h-16 text-primary mx-auto mb-6 animate-spin" />
            <h1 className="text-2xl font-bold mb-2">
              Verifying Your Subscription
            </h1>
            <p className="text-muted-foreground">
              Please wait while we verify your payment...
            </p>
          </>
        ) : (
          <>
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6 animate-bounce" />
            <h1 className="text-2xl font-bold mb-2">
              Subscription Successful!
            </h1>
            <p className="text-muted-foreground mb-6">
              Thank you for subscribing. You will be redirected to the dashboard shortly.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
