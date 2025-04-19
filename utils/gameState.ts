import AsyncStorage from '@react-native-async-storage/async-storage';
import { WordGroups } from '../types/wordGroups';

interface GameState {
  selectedWords: number[];
  mistakesLeft: number;
  solvedGroups: string[];
  shuffledWords: string[];
  currentGroups: WordGroups['groups'];
  solveHintsLeft: number;
  lastPlayedDate: string;
}

const STORAGE_KEY = '@game_state';

export const saveGameState = async (state: GameState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving game state:', error);
  }
};

export const loadGameState = async (): Promise<GameState | null> => {
  try {
    const savedState = await AsyncStorage.getItem(STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
    return null;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
};

export const clearGameState = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing game state:', error);
  }
}; 