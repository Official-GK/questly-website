import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import WebRTCService from '@/services/webRTCService';
import { ChatMessage, sendMessage, subscribeToMessages } from '@/services/chatService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mic, MicOff, MessageSquare, Users } from 'lucide-react';

interface StudyGroupRoomProps {
  groupId: string;
  groupName: string;
}

export function StudyGroupRoom({ groupId, groupName }: StudyGroupRoomProps) {
  const { currentUser, userProfile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const webRTCServiceRef = useRef<WebRTCService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser) return;

    const initializeAudio = async () => {
      try {
        // First check if audio is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Audio is not supported in this browser');
        }

        console.log('Initializing WebRTC service...');
        webRTCServiceRef.current = new WebRTCService(
          currentUser.uid,
          (userId) => {
            console.log('Participant joined:', userId);
            setParticipants(prev => [...prev, userId]);
          },
          (userId) => {
            console.log('Participant left:', userId);
            setParticipants(prev => prev.filter(id => id !== userId));
          }
        );

        // Try to join room immediately
        await webRTCServiceRef.current.joinRoom(groupId);
        console.log('Successfully joined room');

        // Set up automatic reconnection
        const reconnectionInterval = setInterval(async () => {
          if (webRTCServiceRef.current && !webRTCServiceRef.current.isConnected()) {
            console.log('Connection lost, attempting to reconnect...');
            try {
              await webRTCServiceRef.current.joinRoom(groupId);
              console.log('Reconnected successfully');
            } catch (error) {
              console.error('Reconnection failed:', error);
            }
          }
        }, 5000); // Check every 5 seconds

        // Clean up interval on unmount
        return () => {
          clearInterval(reconnectionInterval);
        };

      } catch (error) {
        console.error('Error initializing audio:', error);
        let errorMessage = 'An error occurred while setting up audio chat.';

        if (error instanceof Error) {
          switch (error.name) {
            case 'NotAllowedError':
              errorMessage = 'Please allow microphone access to use audio chat.';
              break;
            case 'NotFoundError':
              errorMessage = 'No microphone found. Please connect a microphone.';
              break;
            case 'NotReadableError':
              errorMessage = 'Your microphone is busy or not responding.';
              break;
            default:
              errorMessage = `Error: ${error.message}`;
          }
        }

        alert(errorMessage + '\nPlease refresh the page to try again.');
        setIsMuted(true); // Default to muted state on error
      }
    };

    initializeAudio();

    // Subscribe to messages
    const unsubscribe = subscribeToMessages(groupId, (newMessages) => {
      setMessages(newMessages);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });

    return () => {
      unsubscribe();
      webRTCServiceRef.current?.leaveRoom();
    };
  }, [groupId, currentUser]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newMessage.trim()) return;

    try {
      await sendMessage(
        groupId,
        currentUser.uid,
        currentUser.displayName || 'Anonymous',
        currentUser.photoURL || undefined,
        newMessage.trim()
      );
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleMute = async () => {
    if (!webRTCServiceRef.current) return;

    setIsLoading(true);
    try {
      const isNowMuted = !webRTCServiceRef.current.toggleMute();
      setIsMuted(isNowMuted);
      setIsAudioInitialized(true);
      console.log('Microphone ' + (isNowMuted ? 'muted' : 'unmuted'));
      
      // Notify other participants of mute state
      if (currentUser) {
        await set(ref(rtdb, `rooms/${groupId}/participants/${currentUser.uid}/muted`), isNowMuted);
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
      alert('Error toggling microphone. Please check your device settings.');
      setIsMuted(true); // Default to muted on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
      {/* Main content area */}
      <div className="flex flex-col flex-grow bg-background rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-bold">{groupName}</h2>
          <div className="flex items-center gap-2">
            <Button
              variant={isMuted ? "destructive" : "default"}
              size="icon"
              onClick={toggleMute}
              disabled={isLoading}
              className={`relative transition-all duration-200 ${isAudioInitialized ? '' : 'bg-green-500 hover:bg-green-600'} 
                ${isMuted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}
                active:scale-95 touch-none select-none`}
              style={{
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : isMuted ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Chat messages */}
        <ScrollArea className="flex-grow p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${
                  message.senderId === currentUser?.uid ? 'justify-end' : ''
                }`}
              >
                {message.senderId !== currentUser?.uid && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.senderPhoto} />
                    <AvatarFallback>
                      {message.senderName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.senderId === currentUser?.uid
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.senderId !== currentUser?.uid && (
                    <p className="text-sm font-medium mb-1">{message.senderName}</p>
                  )}
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow"
            />
            <Button type="submit">Send</Button>
          </div>
        </form>
      </div>

      {/* Participants sidebar */}
      <div className="w-64 bg-background rounded-lg shadow-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5" />
          <h3 className="font-semibold">Participants</h3>
        </div>
        <div className="space-y-2">
          {participants.map((participantId) => (
            <div key={participantId} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm">
                {participantId === currentUser?.uid ? 'You' : 'Participant'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
