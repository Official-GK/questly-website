import { db } from '@/config/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs, query, where, orderBy, enableIndexedDbPersistence, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';
import { MockTest, MockTestAttempt, TopicPerformance, MockQuestion } from '@/types/mockTest';
import { availableTopics } from '@/config/topics';
import { generateQuestions as generateGeminiQuestions } from '@/lib/gemini';

// Enable offline persistence with multi-tab support
try {
  enableMultiTabIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time.
      // Fall back to memory-only persistence
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      // The current browser doesn't support persistence
      console.warn('The current browser does not support persistence.');
    }
  });
} catch (err) {
  console.warn('Error enabling persistence:', err);
}

const MOCK_TESTS_COLLECTION = 'mockTests';
const MOCK_TEST_ATTEMPTS_COLLECTION = 'mockTestAttempts';

const generateQuestions = async (topics: string[], difficulty: string): Promise<MockQuestion[]> => {
  try {
    const distribution = {
      easy: difficulty === 'easy' ? 3 : 0,
      medium: difficulty === 'medium' ? 4 : 0,
      hard: difficulty === 'hard' ? 3 : 0
    };

    const questions = await generateGeminiQuestions(topics, distribution);
    if (!questions || questions.length === 0) {
      throw new Error('Failed to generate questions');
    }

    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate quiz questions. Please try again.');
  }
};

export const generateMockTest = async (topics: string[], duration: number, userId: string): Promise<MockTest> => {
  try {
    // Generate questions with different difficulties
    const easyQuestions = await generateQuestions(topics, 'easy');
    const mediumQuestions = await generateQuestions(topics, 'medium');
    const hardQuestions = await generateQuestions(topics, 'hard');

    // Combine all questions
    const questions = [
      ...easyQuestions.slice(0, 3),
      ...mediumQuestions.slice(0, 4),
      ...hardQuestions.slice(0, 3)
    ];

    // Create the mock test
    const mockTest: MockTest = {
      id: '',  // Will be set by Firestore
      userId,
      title: `Mock Test - ${topics.join(', ')}`,
      description: `A ${duration}-minute mock test covering ${topics.join(', ')}`,
      topics,
      questions,
      duration,
      createdAt: Date.now()
    };

    // Save to Firestore
    const docRef = doc(collection(db, MOCK_TESTS_COLLECTION));
    await setDoc(docRef, {
      ...mockTest,
      id: docRef.id
    });

    return {
      ...mockTest,
      id: docRef.id
    };
  } catch (error) {
    console.error('Error generating mock test:', error);
    throw error;
  }
};

export const getMockTest = async (testId: string): Promise<MockTest | null> => {
  try {
    const docRef = doc(db, MOCK_TESTS_COLLECTION, testId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as MockTest;
    }
    return null;
  } catch (error) {
    console.error('Error getting mock test:', error);
    throw error;
  }
};

export const updateMockTest = async (testId: string, updates: Partial<MockTest>): Promise<void> => {
  try {
    const docRef = doc(db, MOCK_TESTS_COLLECTION, testId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating mock test:', error);
    throw error;
  }
};

export const deleteMockTest = async (testId: string): Promise<void> => {
  try {
    const docRef = doc(db, MOCK_TESTS_COLLECTION, testId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting mock test:', error);
    throw error;
  }
};

export const getUserMockTests = async (userId: string): Promise<MockTest[]> => {
  try {
    const q = query(
      collection(db, MOCK_TESTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as MockTest);
  } catch (error) {
    console.error('Error getting user mock tests:', error);
    throw error;
  }
};

export const saveMockTestAttempt = async (attempt: MockTestAttempt): Promise<void> => {
  try {
    const docRef = doc(collection(db, MOCK_TEST_ATTEMPTS_COLLECTION));
    await setDoc(docRef, {
      ...attempt,
      id: docRef.id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving mock test attempt:', error);
    throw error;
  }
};

export const getUserMockTestAttempts = async (userId: string): Promise<MockTestAttempt[]> => {
  try {
    const q = query(
      collection(db, MOCK_TEST_ATTEMPTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as MockTestAttempt);
  } catch (error) {
    console.error('Error getting user mock test attempts:', error);
    throw error;
  }
};

export const calculateTopicPerformance = (
  questions: MockQuestion[],
  answers: { questionId: string; isCorrect: boolean; timeSpent: number }[]
): TopicPerformance[] => {
  try {
    // Create a map for quick answer lookup
    const answerMap = new Map(answers.map(a => [a.questionId, a]));

    // Group questions by topic
    const topicMap = new Map<string, {
      total: number;
      correct: number;
      totalTime: number;
    }>();

    // Process each question
    questions.forEach(question => {
      const topic = question.topic;
      const answer = answerMap.get(question.id);
      
      const current = topicMap.get(topic) || { total: 0, correct: 0, totalTime: 0 };
      current.total += 1;
      
      if (answer) {
        if (answer.isCorrect) {
          current.correct += 1;
        }
        current.totalTime += answer.timeSpent;
      }
      
      topicMap.set(topic, current);
    });

    // Calculate performance metrics
    return Array.from(topicMap.entries()).map(([topic, stats]) => ({
      topic,
      totalQuestions: stats.total,
      correctAnswers: stats.correct,
      accuracy: (stats.correct / stats.total) * 100,
      averageTimePerQuestion: stats.totalTime / stats.total
    }));
  } catch (error) {
    console.error('Error calculating topic performance:', error);
    throw new Error('Failed to calculate topic performance');
  }
};
