import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAirQuality } from '../hooks/useAirQuality';
import { showSimpleAlert } from '../utils/alertHelper';

// Import conditionnel selon la plateforme
const db = Platform.OS === 'web'
  ? require('../utils/sqliteDatabaseWeb')
  : require('../utils/sqliteDatabase');

const { addFavorite, isFavorite, removeFavorite, getAllFavorites } = db;

export default function CityDetailScreen({ route, navigation }) {
  const { cityName, coords } = route.params;
  const [favorite, setFavorite] = useState(false);

  const { data, aqi, qualityLevel, healthAdvice, pollutants } = useAirQuality(
    cityName,
    coords
  );

  useEffect(() => {
    checkFavoriteStatus();
    navigation.setOptions({ title: cityName });
  }, [cityName]);

  const checkFavoriteStatus = async () => {
    const status = await isFavorite(cityName);
    setFavorite(status);
  };

  const toggleFavorite = async () => {
    if (favorite) {
      // Retirer des favoris
      const favorites = await getAllFavorites();
      const item = favorites.find(
        (f) => f.name.toLowerCase() === cityName.toLowerCase()
      );
      if (item) {
        await removeFavorite(item.id);
        setFavorite(false);
        showSimpleAlert('✓', `${cityName} retiré des favoris`);
      }
    } else {
      // Ajouter aux favoris
      const result = await addFavorite(
        cityName,
        data?.city?.country || null,
        coords?.latitude || null,
        coords?.longitude || null
      );
      if (result.success) {
        setFavorite(true);
        showSimpleAlert('✓', `${cityName} ajouté aux favoris`);
      } else {
        showSimpleAlert('Erreur', result.error);
      }
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

  return (
    <View style={styles.container}>
      {/* Bouton favori en haut */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={28}
            color={favorite ? '#FF3B30' : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
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
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="information-circle" size={24} color="#00E400" />
              <Text style={styles.cardTitle}>Conseil Santé</Text>
            </View>
            <Text style={styles.adviceText}>{healthAdvice}</Text>
          </View>
        )}

        {/* Polluants détaillés */}
        {pollutants && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="analytics" size={24} color="#00E400" />
              <Text style={styles.cardTitle}>Polluants Détaillés</Text>
            </View>

            <View style={styles.pollutantsGrid}>
              {pollutants.pm25 && (
                <View style={styles.pollutantCard}>
                  <Text style={styles.pollutantName}>PM2.5</Text>
                  <Text style={styles.pollutantValue}>{pollutants.pm25.v}</Text>
                  <Text style={styles.pollutantUnit}>µg/m³</Text>
                </View>
              )}

              {pollutants.pm10 && (
                <View style={styles.pollutantCard}>
                  <Text style={styles.pollutantName}>PM10</Text>
                  <Text style={styles.pollutantValue}>{pollutants.pm10.v}</Text>
                  <Text style={styles.pollutantUnit}>µg/m³</Text>
                </View>
              )}

              {pollutants.o3 && (
                <View style={styles.pollutantCard}>
                  <Text style={styles.pollutantName}>Ozone (O₃)</Text>
                  <Text style={styles.pollutantValue}>{pollutants.o3.v}</Text>
                  <Text style={styles.pollutantUnit}>µg/m³</Text>
                </View>
              )}

              {pollutants.no2 && (
                <View style={styles.pollutantCard}>
                  <Text style={styles.pollutantName}>NO₂</Text>
                  <Text style={styles.pollutantValue}>{pollutants.no2.v}</Text>
                  <Text style={styles.pollutantUnit}>µg/m³</Text>
                </View>
              )}

              {pollutants.so2 && (
                <View style={styles.pollutantCard}>
                  <Text style={styles.pollutantName}>SO₂</Text>
                  <Text style={styles.pollutantValue}>{pollutants.so2.v}</Text>
                  <Text style={styles.pollutantUnit}>µg/m³</Text>
                </View>
              )}

              {pollutants.co && (
                <View style={styles.pollutantCard}>
                  <Text style={styles.pollutantName}>CO</Text>
                  <Text style={styles.pollutantValue}>{pollutants.co.v}</Text>
                  <Text style={styles.pollutantUnit}>µg/m³</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Informations supplémentaires */}
        {data && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="information-circle-outline" size={24} color="#00E400" />
              <Text style={styles.cardTitle}>Informations</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Station</Text>
              <Text style={styles.infoValue}>{data.city?.name || cityName}</Text>
            </View>

            {data.time?.s && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Dernière mise à jour</Text>
                <Text style={styles.infoValue}>
                  {new Date(data.time.s).toLocaleString('fr-FR')}
                </Text>
              </View>
            )}

            {data.city?.geo && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Coordonnées</Text>
                <Text style={styles.infoValue}>
                  {data.city.geo[0].toFixed(4)}, {data.city.geo[1].toFixed(4)}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
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
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  adviceText: {
    color: '#8E8E93',
    fontSize: 15,
    lineHeight: 22,
  },
  pollutantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  pollutantCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    minWidth: '45%',
    flex: 1,
  },
  pollutantName: {
    color: '#8E8E93',
    fontSize: 12,
    marginBottom: 8,
  },
  pollutantValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 4,
  },
  pollutantUnit: {
    color: '#8E8E93',
    fontSize: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  infoLabel: {
    color: '#8E8E93',
    fontSize: 14,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
});