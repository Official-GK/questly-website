import { db } from '@/config/firebase';
import { 
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  getDocs,
  limit
} from 'firebase/firestore';

export interface ChatMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  content: string;
  timestamp: Timestamp;
}

export const sendMessage = async (
  groupId: string,
  senderId: string,
  senderName: string,
  senderPhoto: string | undefined,
  content: string
): Promise<void> => {
  const messagesRef = collection(db, 'messages');
  await addDoc(messagesRef, {
    groupId,
    senderId,
    senderName,
    senderPhoto,
    content,
    timestamp: Timestamp.now()
  });
};

export const subscribeToMessages = (
  groupId: string,
  callback: (messages: ChatMessage[]) => void
): (() => void) => {
  const messagesRef = collection(db, 'messages');
  const q = query(
    messagesRef,
    where('groupId', '==', groupId),
    orderBy('timestamp', 'desc'),
    limit(100)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ChatMessage));
    callback(messages.reverse());
  });

  return unsubscribe;
};

export const getRecentMessages = async (
  groupId: string,
  messageLimit: number = 50
): Promise<ChatMessage[]> => {
  const messagesRef = collection(db, 'messages');
  const q = query(
    messagesRef,
    where('groupId', '==', groupId),
    orderBy('timestamp', 'desc'),
    limit(messageLimit)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ChatMessage))
    .reverse();
};
