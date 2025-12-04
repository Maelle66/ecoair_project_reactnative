import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../hooks/useLocation';
import { useAirQuality } from '../hooks/useAirQuality';
import { showSimpleAlert } from '../utils/alertHelper';

// Import conditionnel selon la plateforme
const db = Platform.OS === 'web'
  ? require('../utils/sqliteDatabaseWeb')
  : require('../utils/sqliteDatabase');

const { addFavorite, isFavorite } = db;

export default function HomeScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const { location, loading: locationLoading, getCurrentLocation, error: locationError } = useLocation();
  const { data, loading, aqi, city, qualityLevel, healthAdvice } = useAirQuality(
    null,
    location
  );

  useEffect(() => {
    console.log('🏠 HomeScreen monté');
    handleGetLocation();
  }, []);

  useEffect(() => {
    if (location) {
      console.log('📍 Position obtenue:', location);
    }
  }, [location]);

  useEffect(() => {
    if (data) {
      console.log('✅ Données air reçues:', { city, aqi });
    }
  }, [data]);

  const handleGetLocation = async () => {
    console.log('📍 Demande de géolocalisation...');
    const coords = await getCurrentLocation();
    if (!coords) {
      console.error('❌ Géolocalisation échouée:', locationError);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await handleGetLocation();
    setRefreshing(false);
  };

  const handleAddLocationToFavorites = async () => {
    if (!city || !location) {
      showSimpleAlert('Erreur', 'Aucune localisation disponible');
      return;
    }

    const alreadyFavorite = await isFavorite(city);
    if (alreadyFavorite) {
      showSimpleAlert('Info', `${city} est déjà dans vos favoris`);
      return;
    }

    const result = await addFavorite(
      city,
      data?.city?.country || null,
      location.latitude,
      location.longitude
    );

    if (result.success) {
      showSimpleAlert('✓', `${city} ajouté aux favoris`);
    } else {
      showSimpleAlert('Erreur', result.error || 'Impossible d\'ajouter aux favoris');
    }
  };

  const getAQIColor = (value) => {
    if (!value) return '#8E8E93';
    if (value <= 50) return '#00E400';
    if (value <= 100) return '#FFFF00';
    if (value <= 150) return '#FF7E00';
    if (value <= 200) return '#FF0000';
    if (value <= 300) return '#8F3F97';
    return '#7E0023';
  };

  if (locationLoading || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00E400" />
        <Text style={styles.loadingText}>Localisation en cours...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#00E400"
        />
      }
    >
      {/* En-tête avec localisation */}
      <View style={styles.header}>
        <View style={styles.locationInfo}>
          <Ionicons name="location" size={24} color="#00E400" />
          <Text style={styles.cityName}>{city || 'Position actuelle'}</Text>
        </View>
        <View style={styles.headerButtons}>
          {city && location && (
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={handleAddLocationToFavorites}
            >
              <Ionicons name="heart-outline" size={24} color="#FF3B30" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleGetLocation}>
            <Ionicons name="refresh" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Card principale AQI */}
      <View style={styles.mainCard}>
        <Text style={styles.aqiLabel}>Indice de Qualité de l'Air</Text>
        <View
          style={[
            styles.aqiCircle,
            { backgroundColor: getAQIColor(aqi) + '20' },
          ]}
        >
          <Text style={[styles.aqiValue, { color: getAQIColor(aqi) }]}>
            {aqi || '--'}
          </Text>
        </View>
        <Text style={styles.aqiLevel}>{qualityLevel?.level || 'Chargement...'}</Text>
        <Text style={styles.aqiEmoji}>{qualityLevel?.emoji || '🌍'}</Text>
      </View>

      {/* Conseils santé */}
      {healthAdvice && (
        <View style={styles.adviceCard}>
          <View style={styles.adviceHeader}>
            <Ionicons name="information-circle" size={24} color="#00E400" />
            <Text style={styles.adviceTitle}>Conseil Santé</Text>
          </View>
          <Text style={styles.adviceText}>{healthAdvice}</Text>
        </View>
      )}

      {/* Polluants principaux */}
      {data?.iaqi && (
        <View style={styles.pollutantsCard}>
          <Text style={styles.sectionTitle}>Polluants Détectés</Text>
          <View style={styles.pollutantsList}>
            {data.iaqi.pm25 && (
              <View style={styles.pollutantItem}>
                <Text style={styles.pollutantName}>PM2.5</Text>
                <Text style={styles.pollutantValue}>{data.iaqi.pm25.v}</Text>
              </View>
            )}
            {data.iaqi.pm10 && (
              <View style={styles.pollutantItem}>
                <Text style={styles.pollutantName}>PM10</Text>
                <Text style={styles.pollutantValue}>{data.iaqi.pm10.v}</Text>
              </View>
            )}
            {data.iaqi.o3 && (
              <View style={styles.pollutantItem}>
                <Text style={styles.pollutantName}>O₃</Text>
                <Text style={styles.pollutantValue}>{data.iaqi.o3.v}</Text>
              </View>
            )}
            {data.iaqi.no2 && (
              <View style={styles.pollutantItem}>
                <Text style={styles.pollutantName}>NO₂</Text>
                <Text style={styles.pollutantValue}>{data.iaqi.no2.v}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Actions rapides */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search" size={24} color="#FFFFFF" />
          <Text style={styles.actionText}>Rechercher une ville</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Favorites')}
        >
          <Ionicons name="heart" size={24} color="#FFFFFF" />
          <Text style={styles.actionText}>Mes favoris</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cityName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
  },
  aqiLabel: {
    color: '#8E8E93',
    fontSize: 14,
    marginBottom: 16,
  },
  aqiCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  aqiValue: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  aqiLevel: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  aqiEmoji: {
    fontSize: 48,
  },
  adviceCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  adviceTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  adviceText: {
    color: '#8E8E93',
    fontSize: 15,
    lineHeight: 22,
  },
  pollutantsCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  pollutantsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  pollutantItem: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    minWidth: '45%',
  },
  pollutantName: {
    color: '#8E8E93',
    fontSize: 12,
    marginBottom: 4,
  },
  pollutantValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});