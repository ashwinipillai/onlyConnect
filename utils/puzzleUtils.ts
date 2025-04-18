import { WordGroups } from '../types/wordGroups';

// Simple hash function to convert string to number
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Seeded random number generator
function seededRandom(seed: number): () => number {
  const x = Math.sin(seed) * 10000;
  return () => {
    const x2 = Math.sin(x) * 10000;
    return x2 - Math.floor(x2);
  };
}

// Fisher-Yates shuffle with seed
function seededShuffle<T>(array: T[], seed: number): T[] {
  const random = seededRandom(seed);
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getTodaysPuzzle(wordGroups: WordGroups): { words: string[], groups: WordGroups['groups'] } {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().slice(0, 10);
  
  // Hash the date to get a seed
  const seed = hashString(today);
  
  // Shuffle all groups using the seed
  const shuffledGroups = seededShuffle([...wordGroups.groups], seed);
  
  // Take the first 4 groups
  const selectedGroups = shuffledGroups.slice(0, 4);
  
  // Flatten the words from these groups
  const allWords = selectedGroups.flatMap(group => group.words);
  
  // Shuffle the words normally (without seed) for display
  const shuffledWords = [...allWords].sort(() => Math.random() - 0.5);
  
  return {
    words: shuffledWords,
    groups: selectedGroups
  };
} 