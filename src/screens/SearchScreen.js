import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAirQuality } from '../hooks/useAirQuality';
import { getSearchHistory, saveSearchHistory } from '../utils/asyncStorage';

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchCity, setSearchCity] = useState(null);

  const { data, loading, aqi, city, qualityLevel } = useAirQuality(searchCity);

  // Charger l'historique au montage ET quand on revient sur l'écran
  useFocusEffect(
    React.useCallback(() => {
      console.log('🔄 SearchScreen focus - rechargement historique');
      loadHistory();
    }, [])
  );

  useEffect(() => {
    if (data && searchCity) {
      console.log('✅ Données reçues:', data);
      saveSearchToHistory(city || searchCity);
    }
  }, [data]);

  const loadHistory = async () => {
    console.log('📜 Chargement de l\'historique...');
    const history = await getSearchHistory();
    console.log('📊 Historique récupéré:', history);
    setSearchHistory(history);
  };

  const saveSearchToHistory = async (cityName) => {
    await saveSearchHistory(cityName);
    await loadHistory(); // Recharger après sauvegarde
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('🔍 Recherche de:', searchQuery.trim());
      setSearchCity(searchQuery.trim());
    }
  };

  const handleSelectHistory = (cityName) => {
    setSearchQuery(cityName);
    setSearchCity(cityName);
  };

  const handleClearHistory = async () => {
    await clearSearchHistory();
    setSearchHistory([]);
  };

  const handleGoToDetail = () => {
    if (data && city) {
      navigation.navigate('CityDetail', {
        cityName: city,
        aqi: aqi,
        qualityLevel: qualityLevel,
        data: data,
      });
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
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une ville..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.searchButton,
            !searchQuery.trim() && styles.searchButtonDisabled,
          ]}
          onPress={handleSearch}
          disabled={!searchQuery.trim() || loading}
        >
          <Text style={styles.searchButtonText}>Rechercher</Text>
        </TouchableOpacity>
      </View>

      {/* Résultat de recherche */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00E400" />
          <Text style={styles.loadingText}>Recherche en cours...</Text>
        </View>
      )}

      {data && !loading && (
        <TouchableOpacity style={styles.resultCard} onPress={handleGoToDetail}>
          <View style={styles.resultHeader}>
            <View>
              <Text style={styles.resultCity}>{city}</Text>
              <Text style={styles.resultLevel}>{qualityLevel?.level}</Text>
            </View>
            <View
              style={[
                styles.aqiBadge,
                { backgroundColor: getAQIColor(aqi) + '20' },
              ]}
            >
              <Text style={[styles.aqiText, { color: getAQIColor(aqi) }]}>
                {aqi}
              </Text>
            </View>
          </View>
          <View style={styles.resultFooter}>
            <Text style={styles.resultEmoji}>{qualityLevel?.emoji}</Text>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </View>
        </TouchableOpacity>
      )}

      {/* Historique de recherche */}
      {!loading && !data && searchHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Recherches récentes</Text>
          </View>
          <FlatList
            data={searchHistory}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.historyItem}
                onPress={() => handleSelectHistory(item)}
              >
                <Ionicons name="time-outline" size={20} color="#8E8E93" />
                <Text style={styles.historyText}>{item}</Text>
                <Ionicons name="arrow-up-outline" size={20} color="#8E8E93" />
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Message vide */}
      {!loading && !data && searchHistory.length === 0 && (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color="#3A3A3C" />
          <Text style={styles.emptyTitle}>Recherchez une ville</Text>
          <Text style={styles.emptyText}>
            Entrez le nom d'une ville pour connaître la qualité de l'air
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#00E400',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  searchButtonDisabled: {
    backgroundColor: '#3A3A3C',
  },
  searchButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    color: '#8E8E93',
    marginTop: 12,
    fontSize: 16,
  },
  resultCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultCity: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultLevel: {
    color: '#8E8E93',
    fontSize: 14,
  },
  aqiBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aqiText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultEmoji: {
    fontSize: 32,
  },
  historyContainer: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  clearText: {
    color: '#00E400',
    fontSize: 14,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    gap: 12,
  },
  historyText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: '#8E8E93',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});