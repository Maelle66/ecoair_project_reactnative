import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AirQualityCard({
  aqi,
  city,
  qualityLevel,
  onPress,
  showLocation = true,
  size = 'large', // 'large', 'medium', 'small'
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

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          circle: { width: 80, height: 80, borderRadius: 40 },
          aqiValue: { fontSize: 32 },
          level: { fontSize: 12 },
          emoji: { fontSize: 24 },
        };
      case 'medium':
        return {
          circle: { width: 120, height: 120, borderRadius: 60 },
          aqiValue: { fontSize: 48 },
          level: { fontSize: 16 },
          emoji: { fontSize: 32 },
        };
      case 'large':
      default:
        return {
          circle: { width: 160, height: 160, borderRadius: 80 },
          aqiValue: { fontSize: 64 },
          level: { fontSize: 20 },
          emoji: { fontSize: 48 },
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const CardContent = () => (
    <View style={styles.container}>
      {showLocation && city && (
        <View style={styles.header}>
          <Ionicons name="location" size={20} color="#00E400" />
          <Text style={styles.cityName}>{city}</Text>
        </View>
      )}

      <View style={styles.content}>
        <View
          style={[
            styles.aqiCircle,
            sizeStyles.circle,
            { backgroundColor: getAQIColor(aqi) + '20' },
          ]}
        >
          <Text style={[styles.aqiValue, sizeStyles.aqiValue, { color: getAQIColor(aqi) }]}>
            {aqi || '--'}
          </Text>
        </View>

        {qualityLevel && (
          <>
            <Text style={[styles.level, sizeStyles.level]}>{qualityLevel.level}</Text>
            <Text style={[styles.emoji, sizeStyles.emoji]}>{qualityLevel.emoji}</Text>
          </>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.card}>
      <CardContent />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 24,
  },
  container: {
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cityName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    alignItems: 'center',
  },
  aqiCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  aqiValue: {
    fontWeight: 'bold',
  },
  level: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emoji: {
    textAlign: 'center',
  },
});