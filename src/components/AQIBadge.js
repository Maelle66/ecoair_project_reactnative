import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AQIBadge({
  aqi,
  size = 'medium', // 'small', 'medium', 'large'
  showLabel = false,
  label = 'AQI',
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

  const getAQILevel = (value) => {
    if (!value) return 'N/A';
    if (value <= 50) return 'Bon';
    if (value <= 100) return 'Modéré';
    if (value <= 150) return 'Mauvais';
    if (value <= 200) return 'Très mauvais';
    if (value <= 300) return 'Dangereux';
    return 'Extrême';
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          badge: { width: 48, height: 48, borderRadius: 24 },
          value: { fontSize: 16 },
          label: { fontSize: 10 },
        };
      case 'large':
        return {
          badge: { width: 80, height: 80, borderRadius: 40 },
          value: { fontSize: 28 },
          label: { fontSize: 14 },
        };
      case 'medium':
      default:
        return {
          badge: { width: 64, height: 64, borderRadius: 32 },
          value: { fontSize: 20 },
          label: { fontSize: 12 },
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const color = getAQIColor(aqi);
  const level = getAQILevel(aqi);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.badge,
          sizeStyles.badge,
          { backgroundColor: color + '20' },
        ]}
      >
        <Text style={[styles.value, sizeStyles.value, { color }]}>
          {aqi || '--'}
        </Text>
      </View>
      {showLabel && (
        <Text style={[styles.label, sizeStyles.label]}>
          {label !== 'AQI' ? label : level}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontWeight: 'bold',
  },
  label: {
    color: '#8E8E93',
    marginTop: 4,
    textAlign: 'center',
  },
});