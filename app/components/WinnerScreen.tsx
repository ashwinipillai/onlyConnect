import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { GROUP_COLORS } from '../../constants/colors';
import { GroupType } from '../../types/wordGroups';

interface WinnerScreenProps {
  solvedGroups: GroupType[];
}

export function WinnerScreen({ solvedGroups }: WinnerScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const confettiRef = useRef<any>(null);

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Trigger confetti after a short delay
    setTimeout(() => {
      confettiRef.current?.start();
    }, 100);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.contentContainer}>
        <Text style={styles.victoryText}>You solved it!</Text>
        
        <View style={styles.categoriesContainer}>
          {solvedGroups.map((group, index) => (
            <Text key={index} style={[
              styles.categoryText,
              { color: GROUP_COLORS[index] }
            ]}>
              {group.category}
            </Text>
          ))}
        </View>
      </View>

      <ConfettiCannon
        ref={confettiRef}
        count={50}
        origin={{ x: -10, y: 0 }}
        autoStart={false}
        fadeOut={true}
        fallSpeed={3000}
        explosionSpeed={350}
        colors={GROUP_COLORS}
      />
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
  victoryText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 