import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { joinStudyGroup } from '@/services/studyGroupService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export function JoinGroupDialog() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setLoading(true);
      const group = await joinStudyGroup(inviteCode.toUpperCase(), currentUser.uid);
      toast.success('Successfully joined the study group!');
      setOpen(false);
      navigate(`/study-groups/${group.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to join study group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Join Group</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Study Group</DialogTitle>
          <DialogDescription>
            Enter the invite code to join a study group
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleJoin} className="space-y-4">
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
            className="w-full"
          >
            {loading ? 'Joining...' : 'Join Group'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
