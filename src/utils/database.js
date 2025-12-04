import { Platform } from 'react-native';

// Sélection automatique selon la plateforme
let db;

if (Platform.OS === 'web') {
  db = require('./sqliteDatabaseWeb');
} else {
  db = require('./sqliteDatabase');
}

// Export de toutes les fonctions
export const {
  initDatabase,
  openDatabase,
  closeDatabase,
  // Favoris
  addFavorite,
  getAllFavorites,
  removeFavorite,
  isFavorite,
  updateFavorite,
  // Historique recherche
  addSearchHistory,
  getSearchHistory,
  clearSearchHistory,
  // Cache
  cacheAirQuality,
  getCachedAirQuality,
  cleanExpiredCache,
  // Historique mesures
  addAirQualityHistory,
  getAirQualityHistory,
  // Utilitaires
  getDatabaseStats,
  resetDatabase,
} = db;

export default db.default || db;