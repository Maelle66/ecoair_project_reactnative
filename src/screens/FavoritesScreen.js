import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAirQuality } from '../hooks/useAirQuality';
import { showAlert } from '../utils/alertHelper';

// Import conditionnel selon la plateforme
const db = Platform.OS === 'web'
  ? require('../utils/sqliteDatabaseWeb')
  : require('../utils/sqliteDatabase');

const { getAllFavorites, removeFavorite } = db;

function FavoriteCard({ item, onPress, onDelete }) {
  const { aqi, qualityLevel, loading } = useAirQuality(item.name);

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
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.cardLeft}>
          <Text style={styles.cityName}>{item.name}</Text>
          {item.country && (
            <Text style={styles.country}>{item.country}</Text>
          )}
          {qualityLevel && (
            <View style={styles.levelContainer}>
              <Text style={styles.levelEmoji}>{qualityLevel.emoji}</Text>
              <Text style={styles.levelText}>{qualityLevel.level}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardRight}>
          {loading ? (
            <View style={styles.aqiPlaceholder}>
              <Text style={styles.loadingText}>...</Text>
            </View>
          ) : (
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
          )}

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(item)}
          >
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    // Sur web, getAllFavorites est async
    if (Platform.OS === 'web') {
      const data = await getAllFavorites();
      setFavorites(data);
    } else {
      const data = getAllFavorites();
      setFavorites(data);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const handleDelete = async (item) => {
    showAlert(
      'Supprimer le favori',
      `Voulez-vous retirer ${item.name} de vos favoris ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await removeFavorite(item.id);
            await loadFavorites();
          },
        },
      ]
    );
  };

  const handleCardPress = (item) => {
    navigation.navigate('CityDetail', {
      cityName: item.name,
      coords: item.latitude && item.longitude
        ? { latitude: item.latitude, longitude: item.longitude }
        : null,
    });
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={64} color="#3A3A3C" />
      <Text style={styles.emptyTitle}>Aucun favori</Text>
      <Text style={styles.emptyText}>
        Ajoutez des villes à vos favoris pour suivre leur qualité de l'air
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Search')}
      >
        <Ionicons name="add" size={24} color="#000000" />
        <Text style={styles.addButtonText}>Rechercher une ville</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {favorites.length > 0 ? (
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {favorites.length} {favorites.length > 1 ? 'favoris' : 'favori'}
            </Text>
          </View>

          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <FavoriteCard
                item={item}
                onPress={() => handleCardPress(item)}
                onDelete={handleDelete}
              />
            )}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#00E400"
              />
            }
          />
        </>
      ) : (
        renderEmpty()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 20,
    paddingBottom: 8,
  },
  headerTitle: {
    color: '#8E8E93',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  listContent: {
    padding: 20,
    paddingTop: 8,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: {
    flex: 1,
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
  levelEmoji: {
    fontSize: 20,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  cardRight: {
    alignItems: 'center',
    gap: 12,
  },
  aqiBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aqiValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  aqiPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#8E8E93',
    fontSize: 20,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: '#8E8E93',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00E400',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  addButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});