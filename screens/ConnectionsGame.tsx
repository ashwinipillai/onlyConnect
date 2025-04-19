import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Platform,
  ImageBackground
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import wordGroupsData from '../data/wordGroups.json';
import { GROUP_COLORS } from '../constants/colors';
import { getTodaysPuzzle } from '../utils/puzzleUtils';
import { WordGroups } from '../types/wordGroups';
import { WinnerScreen } from '../app/components/WinnerScreen';

type RootStackParamList = {
  Home: undefined;
  Game: undefined;
};

type ConnectionsGameProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Game'>;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PADDING = 16;
const GRID_WIDTH = SCREEN_WIDTH - (PADDING * 2);
const GAP = 4;
const BUTTON_SIZE = (GRID_WIDTH - (GAP * 3)) / 4;

// Test ad unit ID
const BANNER_ID = Platform.select({
  ios: 'ca-app-pub-3940256099942544/2934735716',
  android: 'ca-app-pub-3940256099942544/6300978111',
  default: 'ca-app-pub-3940256099942544/6300978111'
}) as string;

export function ConnectionsGame({ navigation }: ConnectionsGameProps) {
  const [selectedWords, setSelectedWords] = useState<number[]>([]);
  const [mistakesLeft, setMistakesLeft] = useState(4);
  const [solvedGroups, setSolvedGroups] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [currentGroups, setCurrentGroups] = useState<WordGroups['groups']>([]);
  const [solveHintsLeft, setSolveHintsLeft] = useState(2);
  
  useEffect(() => {
    try {
      const { words, groups } = getTodaysPuzzle(wordGroupsData as WordGroups);
      setShuffledWords(words);
      setCurrentGroups(groups);
    } catch (error) {
      console.error('Error initializing game:', error);
      Alert.alert('Error', 'Failed to initialize the game. Please try again.');
    }
  }, []);

  const toggleWord = (index: number) => {
    if (selectedWords.includes(index)) {
      setSelectedWords(prev => prev.filter(i => i !== index));
    } else if (selectedWords.length < 4) {
      setSelectedWords(prev => [index, ...prev]);
    }
  };

  const checkSelection = () => {
    if (selectedWords.length !== 4) return;

    const selectedWordTexts = selectedWords.map(index => shuffledWords[index]);
    
    const matchingGroup = currentGroups.find(group => 
      !solvedGroups.includes(group.category) &&
      group.words.every(word => selectedWordTexts.includes(word)) &&
      selectedWordTexts.every(word => group.words.includes(word))
    );

    if (matchingGroup) {
      setSolvedGroups(prev => [...prev, matchingGroup.category]);
      setSelectedWords([]);
    } else {
      setMistakesLeft(prev => prev - 1);
      setSelectedWords([]);
    }
  };

  const isWordSolved = (word: string) => {
    return solvedGroups.some(category => 
      currentGroups.find(g => g.category === category)?.words.includes(word)
    );
  };

  const getGroupIndex = (word: string) => {
    const group = currentGroups.find(g => g.words.includes(word));
    return group ? currentGroups.indexOf(group) : -1;
  };

  const solveOneGroup = () => {
    const unsolvedGroups = currentGroups.filter(
      group => !solvedGroups.includes(group.category)
    );

    if (unsolvedGroups.length === 0 || solveHintsLeft <= 0) return;

    const randomGroup = unsolvedGroups[Math.floor(Math.random() * unsolvedGroups.length)];

    const wordIndices = randomGroup.words.map(word => 
      shuffledWords.findIndex(w => w === word)
    );

    setSolvedGroups(prev => [...prev, randomGroup.category]);
    
    setSolveHintsLeft(prev => prev - 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.backgroundImage, { backgroundColor: '#f5f5f5' }]}>
        <View style={styles.gameContainer}>
          {solvedGroups.length === 4 && (
            <WinnerScreen 
              solvedGroups={currentGroups.filter(group => 
                solvedGroups.includes(group.category)
              )} 
            />
          )}
          
          <View style={[
            styles.mainContent,
            solvedGroups.length === 4 && styles.mainContentWithWinner
          ]}>
            <Text style={styles.title}>Create four groups of four!</Text>

            {solvedGroups.length > 0 && (
              <ScrollView style={styles.solvedGroupsSection}>
                {solvedGroups.map((category, index) => {
                  const group = currentGroups.find(g => g.category === category);
                  if (!group) return null;
                  
                  return (
                    <View 
                      key={category} 
                      style={[
                        styles.solvedGroupContainer,
                        { backgroundColor: GROUP_COLORS[index] }
                      ]}
                    >
                      <View style={styles.solvedGroupHeader}>
                        <Text style={styles.solvedGroupCategory}>{group.category}</Text>
                        <Text style={styles.solvedGroupDescription}>{group.description}</Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            )}

            <View style={styles.gridContainer}>
              {shuffledWords.map((word, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.tileButton,
                    selectedWords.includes(index) && styles.selectedWord,
                    isWordSolved(word) && { 
                      backgroundColor: GROUP_COLORS[getGroupIndex(word)],
                      borderColor: GROUP_COLORS[getGroupIndex(word)],
                    }
                  ]}
                  onPress={() => toggleWord(index)}
                  disabled={isWordSolved(word)}
                >
                  <Text style={[
                    styles.wordText,
                    isWordSolved(word) && { color: '#FFFFFF' }
                  ]}>
                    {word}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.bottomSection}>
              {selectedWords.length === 4 && (
                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={checkSelection}
                >
                  <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
              )}

              {solveHintsLeft > 0 && solvedGroups.length < 4 && (
                <TouchableOpacity 
                  style={styles.solveOneButton}
                  onPress={solveOneGroup}
                >
                  <Text style={styles.solveOneText}>
                    Solve next group? ({solveHintsLeft} left)
                  </Text>
                </TouchableOpacity>
              )}

              <View style={styles.mistakesContainer}>
                <Text style={styles.mistakesText}>Mistakes Remaining:</Text>
                <View style={styles.circlesContainer}>
                  {[...Array(4)].map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.circle,
                        index < mistakesLeft ? styles.filledCircle : styles.emptyCircle
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  gameContainer: {
    flex: 1,
    padding: PADDING,
  },
  mainContent: {
    flex: 1,
    paddingTop: 24,
  },
  mainContentWithWinner: {
    paddingTop: 120, // Adjust this value based on your winner banner height
  },
  title: {
    color: '#2C3E50',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '700',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    justifyContent: 'center',
    marginTop: 20,
  },
  tileButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  wordText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  selectedWord: {
    backgroundColor: 'rgba(200, 200, 200, 0.7)',
    transform: [{ scale: 0.98 }],
    borderColor: '#2C3E50',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 8,
  },
  submitButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#2C3E50',
  },
  submitText: {
    color: '#2C3E50',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  mistakesContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  mistakesText: {
    color: '#2C3E50',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  circlesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  filledCircle: {
    backgroundColor: '#FFFFFF',
  },
  emptyCircle: {
    backgroundColor: 'transparent',
  },
  solvedGroupsSection: {
    maxHeight: 120,
    marginVertical: 10,
  },
  solvedGroupContainer: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  solvedGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  solvedGroupCategory: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  solvedGroupDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  adContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    minHeight: 50, // Ensure there's space for the banner
  },
  solveOneButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(44, 62, 80, 0.1)',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2C3E50',
  },
  solveOneText: {
    color: '#2C3E50',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 

