import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { setOnboardingDone } from '../utils/asyncStorage';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: 'leaf',
    iconColor: '#00E400',
    title: 'Bienvenue sur Eco-Air',
    description: 'Suivez la qualité de l\'air en temps réel partout dans le monde',
  },
  {
    id: '2',
    icon: 'location',
    iconColor: '#00E400',
    title: 'Votre position',
    description: 'Obtenez instantanément la qualité de l\'air de votre localisation actuelle',
  },
  {
    id: '3',
    icon: 'search',
    iconColor: '#00E400',
    title: 'Recherchez des villes',
    description: 'Explorez la qualité de l\'air dans n\'importe quelle ville du monde',
  },
  {
    id: '4',
    icon: 'heart',
    iconColor: '#FF3B30',
    title: 'Sauvegardez vos favoris',
    description: 'Ajoutez vos villes préférées pour un accès rapide',
  },
  {
    id: '5',
    icon: 'analytics',
    iconColor: '#00E400',
    title: 'Données détaillées',
    description: 'Consultez les polluants, conseils santé et l\'historique de qualité de l\'air',
  },
];

export default function OnboardingScreen({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    await setOnboardingDone();
    onComplete();
  };

  const handleSkip = async () => {
    await setOnboardingDone();
    onComplete();
  };

  const renderSlide = ({ item }) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <View style={[styles.iconCircle, { backgroundColor: item.iconColor + '20' }]}>
          <Ionicons name={item.icon} size={80} color={item.iconColor} />
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  const Pagination = () => {
    return (
      <View style={styles.pagination}>
        {slides.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index.toString()}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Skip button */}
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Passer</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={slidesRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={32}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Pagination />

        <TouchableOpacity style={styles.nextButton} onPress={scrollTo}>
          {currentIndex === slides.length - 1 ? (
            <>
              <Text style={styles.nextButtonText}>Commencer</Text>
              <Ionicons name="checkmark" size={24} color="#000000" />
            </>
          ) : (
            <>
              <Text style={styles.nextButtonText}>Suivant</Text>
              <Ionicons name="arrow-forward" size={24} color="#000000" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: '#8E8E93',
    fontSize: 16,
  },
  slide: {
    width: width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  footer: {
    paddingBottom: 60,
    paddingHorizontal: 40,
  },
  pagination: {
    flexDirection: 'row',
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00E400',
    marginHorizontal: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00E400',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  nextButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
});