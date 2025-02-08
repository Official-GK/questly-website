import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SubscriptionCancel() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Subscription Cancelled",
      description: "Your subscription was not completed. You can try again anytime.",
      variant: "destructive",
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neon-purple to-black p-8 flex items-center justify-center">
      <div className="text-center">
        <XCircle className="w-24 h-24 text-red-500 mx-auto mb-8" />
        <h1 className="text-4xl font-bold text-white mb-4">
          Subscription Cancelled
        </h1>
        <p className="text-white/60 text-lg mb-8">
          Your subscription was not completed. You can try again anytime.
        </p>
        <Button
          onClick={() => navigate('/subscription')}
          className="bg-neon-green hover:bg-neon-green/90 text-black"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
