import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import adapter from 'webrtc-adapter';
import { db } from '@/config/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Send, Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: Timestamp;
}

interface GroupChatProps {
  groupId: string;
}

export function GroupChat({ groupId }: GroupChatProps) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAudioOn, setIsAudioOn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen to messages
  useEffect(() => {
    const messagesRef = collection(db, 'studyGroups', groupId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const newMessages = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              text: data.text || '',
              userId: data.userId || '',
              userName: data.userName || 'Anonymous',
              timestamp: data.timestamp || serverTimestamp()
            } as Message;
          });
          setMessages(newMessages);
        } catch (error) {
          console.error('Error parsing messages:', error);
          toast.error('Error loading messages');
        }
      },
      (error) => {
        console.error('Error fetching messages:', error);
        toast.error('Error loading messages');
      }
    );

    return () => unsubscribe();
  }, [groupId]);

  // Handle sending messages
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    try {
      const messagesRef = collection(db, 'studyGroups', groupId, 'messages');
      await addDoc(messagesRef, {
        text: newMessage,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        timestamp: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Check if we're in a secure context (HTTPS or localhost)
  const isSecureContext = window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // Handle audio toggle
  const toggleAudio = async () => {
    try {
      if (!isAudioOn) {
        // Check if we're in a secure context
        if (!isSecureContext) {
          console.error('Not in a secure context');
          toast.error('Microphone access requires HTTPS. Please use a secure connection.');
          return;
        }

        // Check if getUserMedia is supported
        if (!navigator.mediaDevices?.getUserMedia) {
          console.error('getUserMedia not supported');
          toast.error('Your browser does not support microphone access');
          return;
        }

        console.log('Attempting to access microphone...');
        console.log('Browser:', adapter.browserDetails.browser);
        console.log('Version:', adapter.browserDetails.version);

        // Try to get microphone access with more detailed constraints
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: { ideal: true },
            noiseSuppression: { ideal: true },
            autoGainControl: { ideal: true },
          },
          video: false
        });

        setLocalStream(stream);
        setIsAudioOn(true);
        toast.success('Microphone activated');
      } else {
        // Stop the audio stream
        if (localStream) {
          localStream.getTracks().forEach(track => {
            track.stop();
          });
          setLocalStream(null);
          setIsAudioOn(false);
          toast.success('Microphone deactivated');
        }
      }
    } catch (error) {
      console.error('Audio error:', error);
      
      // Handle common error cases
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          toast.error('Please allow microphone access in your browser settings');
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          toast.error('No microphone found. Please check your device settings');
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          toast.error('Cannot access microphone. It might be in use by another app');
        } else if (error.name === 'OverconstrainedError') {
          toast.error('Microphone not compatible');
        } else {
          toast.error('Could not access microphone. Please check your settings');
        }
      } else {
        toast.error('Could not access microphone');
      }
    }
  };

  return (
    <Card className="flex flex-col h-[600px]">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2 ${message.userId === currentUser?.uid ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback>{message.userName[0]}</AvatarFallback>
              </Avatar>
              <div
                className={`max-w-[70%] rounded-lg p-3 ${message.userId === currentUser?.uid
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
                }`}
              >
                <div className="text-sm font-semibold mb-1">
                  {message.userId === currentUser?.uid ? 'You' : message.userName}
                </div>
                <div>{message.text}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Button
            type="button"
            size="icon"
            variant={isAudioOn ? "destructive" : "default"}
            onClick={toggleAudio}
          >
            {isAudioOn ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
