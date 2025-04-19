import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GameOverScreenProps {
  onNewPuzzle: () => void;
}

export function GameOverScreen({ onNewPuzzle }: GameOverScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.gameOverText}>Game Over!</Text>
          <TouchableOpacity 
            style={styles.tryAgainButton}
            onPress={onNewPuzzle}
          >
            <Ionicons name="refresh" size={24} color="#2C3E50" />
            <Text style={styles.tryAgainText}>Try Again</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.message}>
          Don't give up! Each puzzle has four groups of related words.
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  contentContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
  },
  tryAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(44, 62, 80, 0.1)',
  },
  tryAgainText: {
    marginLeft: 4,
    color: '#2C3E50',
    fontSize: 14,
    fontWeight: '600',
  },
  message: {
    color: '#2C3E50',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
    opacity: 0.8,
  },
}); 