import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { StudyGroup, leaveStudyGroup, updateStudyGroupStatus } from '@/services/studyGroupService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Crown, LogOut, Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';
import { GroupChat } from '@/components/study-groups/GroupChat';

const GroupDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!groupId) {
      toast.error('Invalid group ID');
      navigate('/dashboard');
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'studyGroups', groupId),
      (doc) => {
        if (doc.exists()) {
          try {
            const data = doc.data();
            setGroup({ ...data, id: doc.id } as StudyGroup);
          } catch (error) {
            console.error('Error parsing group data:', error);
            toast.error('Error loading group data');
          }
        } else {
          toast.error('Study group not found');
          navigate('/dashboard');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching group:', error);
        toast.error('Error loading group');
        setLoading(false);
        navigate('/dashboard');
      }
    );

    return () => unsubscribe();
  }, [groupId, navigate]);

  const handleCopyInviteCode = async () => {
    if (!group) return;
    
    try {
      // Check if the clipboard API is available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(group.inviteCode);
        toast.success('Invite code copied to clipboard!');
      } else {
        // Fallback for devices without clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = group.inviteCode;
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
          document.execCommand('copy');
          toast.success('Invite code copied to clipboard!');
        } catch (err) {
          toast.error('Unable to copy invite code. Please copy it manually.');
          console.error('Fallback clipboard copy failed:', err);
        }
        
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.error('Clipboard error:', error);
      toast.error('Unable to copy invite code. Please copy it manually.');
    }
  };

  const handleLeaveGroup = async () => {
    if (!group || !currentUser) return;
    
    try {
      await leaveStudyGroup(group.id, currentUser.uid);
      toast.success('Left study group successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to leave group');
    }
  };

  const toggleLiveStatus = async () => {
    if (!group) return;
    
    try {
      await updateStudyGroupStatus(group.id, !group.isLive);
      toast.success(group.isLive ? 'Study session ended' : 'Study session started');
    } catch (error) {
      toast.error('Failed to update study session status');
    }
  };

  if (loading) {
    return (
      <div className="container py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="animate-pulse h-8 w-48 bg-muted rounded"></div>
            <div className="animate-pulse h-4 w-96 bg-muted rounded"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="animate-pulse h-10 w-32 bg-muted rounded"></div>
            <div className="animate-pulse h-10 w-32 bg-muted rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="p-6 h-[600px]">
            <ScrollArea className="h-full">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-muted rounded w-24"></div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-32"></div>
                      <div className="h-3 bg-muted rounded w-48"></div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
          <div className="lg:col-span-3">
            <div className="animate-pulse h-[600px] bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!group || !currentUser) {
    return <div className="container py-8">Group not found</div>;
  }

  const isCreator = group.createdBy === currentUser.uid;

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">{group.name}</h1>
            {group.isLive && (
              <Badge variant="default" className="bg-primary text-primary-foreground px-3 py-1">
                Live Session
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{group.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={toggleLiveStatus}
            className="gap-2"
          >
            {group.isLive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {group.isLive ? 'End Session' : 'Start Session'}
          </Button>
          <Button
            onClick={handleCopyInviteCode}
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            Invite Members
          </Button>
          {!isCreator && (
            <Button
              variant="destructive"
              onClick={handleLeaveGroup}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Leave Group
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Members List */}
        <Card className="p-6 h-[600px]">
          <ScrollArea className="h-full">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Members</h2>
          </div>
          <div className="space-y-4">
            {group.members?.map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
                  {member.displayName?.[0] || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate flex items-center gap-2">
                    {member.displayName || 'Anonymous'}
                    {member.id === group.createdBy && (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">{member.email}</div>
                </div>
              </div>
            ))}
          </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          <GroupChat groupId={group.id} />
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
