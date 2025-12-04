import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CityCard({
  city,
  country,
  aqi,
  qualityLevel,
  onPress,
  onFavorite,
  isFavorite = false,
  showActions = true,
}) {
  const getAQIColor = (value) => {
    if (!value) return '#8E8E93';
    if (value <= 50) return '#00E400';
    if (value <= 100) return '#FFFF00';
    if (value <= 150) return '#FF7E00';
    if (value <= 200) return '#FF0000';
    if (value <= 300) return '#8F3F97';
    return '#7E0023';
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Left side - City info */}
        <View style={styles.leftSection}>
          <Text style={styles.cityName}>{city}</Text>
          {country && <Text style={styles.country}>{country}</Text>}
          
          {qualityLevel && (
            <View style={styles.levelContainer}>
              <Text style={styles.emoji}>{qualityLevel.emoji}</Text>
              <Text style={styles.levelText}>{qualityLevel.level}</Text>
            </View>
          )}
        </View>

        {/* Right side - AQI & Actions */}
        <View style={styles.rightSection}>
          <View
            style={[
              styles.aqiBadge,
              { backgroundColor: getAQIColor(aqi) + '20' },
            ]}
          >
            <Text style={[styles.aqiValue, { color: getAQIColor(aqi) }]}>
              {aqi || '--'}
            </Text>
          </View>

          {showActions && onFavorite && (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={(e) => {
                e.stopPropagation();
                onFavorite();
              }}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? '#FF3B30' : '#8E8E93'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Chevron indicator */}
      <View style={styles.chevronContainer}>
        <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
    marginRight: 16,
  },
  cityName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  country: {
    color: '#8E8E93',
    fontSize: 14,
    marginBottom: 8,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 18,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  rightSection: {
    alignItems: 'center',
    gap: 12,
  },
  aqiBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aqiValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronContainer: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
  },
});