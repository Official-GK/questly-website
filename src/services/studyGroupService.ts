import { db } from '@/config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  Timestamp,
  FieldValue
} from 'firebase/firestore';
import { generateInviteCode } from '@/lib/utils';

export interface GroupMember {
  id: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: Timestamp | FieldValue;
  members: GroupMember[];
  inviteCode: string;
  isLive: boolean;
  activeTopic?: string;
  activeParticipants?: string[];
  schedule?: {
    days: string[];
    time: string;
  };
  days: string[];
  time: string;
}

export const createStudyGroup = async (
  name: string,
  description: string,
  userId: string
): Promise<StudyGroup> => {
  const groupsRef = collection(db, 'studyGroups');
  const inviteCode = generateInviteCode();
  
  const userDoc = await getDoc(doc(db, 'users', userId));
  const userData = userDoc.data();
  
  const newGroup: StudyGroup = {
    id: '', // Will be set after creation
    name,
    description,
    createdBy: userId,
    createdAt: serverTimestamp(),
    members: [{
      id: userId,
      displayName: userData?.displayName || null,
      email: userData?.email || null,
      photoURL: userData?.photoURL || null
    }],
    inviteCode,
    isLive: false,
    days: [],
    time: ''
  };

  const docRef = doc(groupsRef);
  newGroup.id = docRef.id;
  
  await setDoc(docRef, newGroup);
  return newGroup;
};

export const joinStudyGroup = async (inviteCode: string, userId: string): Promise<StudyGroup> => {
  const groupsRef = collection(db, 'studyGroups');
  const q = query(groupsRef, where('inviteCode', '==', inviteCode));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error('Invalid invite code');
  }

  const groupDoc = querySnapshot.docs[0];
  const group = groupDoc.data() as StudyGroup;

  if (group.members.some(member => member.id === userId)) {
    throw new Error('You are already a member of this group');
  }

  const userDoc = await getDoc(doc(db, 'users', userId));
  const userData = userDoc.data();

  const newMember: GroupMember = {
    id: userId,
    displayName: userData?.displayName || null,
    email: userData?.email || null,
    photoURL: userData?.photoURL || null
  };

  await updateDoc(doc(db, 'studyGroups', groupDoc.id), {
    members: arrayUnion(newMember)
  });

  return { ...group, id: groupDoc.id, members: [...group.members, newMember] };
};

export const leaveStudyGroup = async (groupId: string, userId: string): Promise<void> => {
  const groupRef = doc(db, 'studyGroups', groupId);
  const groupDoc = await getDoc(groupRef);
  const group = groupDoc.data() as StudyGroup;
  
  const memberToRemove = group.members.find(member => member.id === userId);
  if (memberToRemove) {
    await updateDoc(groupRef, {
      members: arrayRemove(memberToRemove)
    });
  }
};

export const getUserStudyGroups = async (userId: string): Promise<StudyGroup[]> => {
  const groupsRef = collection(db, 'studyGroups');
  const q = query(groupsRef, where('members', 'array-contains', { id: userId }));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id
  })) as StudyGroup[];
};

export const updateStudyGroupStatus = async (
  groupId: string,
  isLive: boolean,
  activeTopic?: string
): Promise<void> => {
  const groupRef = doc(db, 'studyGroups', groupId);
  await updateDoc(groupRef, {
    isLive,
    ...(activeTopic && { activeTopic })
  });
};
