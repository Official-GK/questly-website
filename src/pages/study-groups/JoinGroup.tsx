import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { joinStudyGroup } from '@/services/studyGroupService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function JoinGroup() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setLoading(true);
      const group = await joinStudyGroup(inviteCode.toUpperCase(), currentUser.uid);
      toast.success('Successfully joined the study group!');
      navigate(`/study-groups/${group.id}`);
    } catch (error) {
      toast.error('Failed to join study group');
      console.error('Error joining group:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-6">Join Study Group</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Invite Code</label>
          <Input
            required
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Enter 6-digit code"
            className="w-full uppercase"
            maxLength={6}
          />
        </div>

        <Button
          type="submit"
          disabled={loading || inviteCode.length !== 6}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold"
        >
          {loading ? 'Joining...' : 'Join Group'}
        </Button>
      </form>
    </div>
  );
}
