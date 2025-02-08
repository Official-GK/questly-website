export interface Flashcard {
  term: string;
  definition: string;
  mastered: boolean;
}

export interface FlashcardSet {
  id: string;
  title: string;
  description?: string;
  cards: Flashcard[];
  createdAt: number;
  lastModified: number;
  userId: string;
}

export interface FlashcardStats {
  totalCards: number;
  mastered: number;
  needsReview: number;
  lastStudySession?: number;
  totalStudyTime: number; // in minutes
}
