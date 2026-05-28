export interface Chapter {
  id: string;
  title: string;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  originalTitle?: string;
  author: string;
  category: string;
  description: string;
  coverColor: string; // Tailwind class, e.g. "from-amber-600 to-amber-800"
  coverTextColor: string; // e.g. "text-amber-50"
  readTimeMin: number;
  rating: number;
  reviewsCount: number;
  isPremium: boolean;
  chapters: Chapter[];
  takeaways: string[]; // Key lessons from the book
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  popular?: boolean;
  tagline: string;
}

export interface SubscriptionState {
  isSubscribed: boolean;
  planId: string | null;
  billingCycle: 'monthly' | 'annual' | null;
  expiresAt: string | null;
  cardName?: string;
  cardNumber?: string; // masked / simulated
}

export interface BookReview {
  id: string;
  bookId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface UserProgress {
  readBooks: string[]; // List of book IDs completed
  favoriteBooks: string[]; // List of book IDs bookmarked
  currentChapterIndexes: { [bookId: string]: number }; // Progress saved per book
}
