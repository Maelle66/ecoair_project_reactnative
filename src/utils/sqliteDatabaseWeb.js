// VERSION WEB - Utilise AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  FAVORITES: '@ecoair_web_favorites',
  HISTORY: '@ecoair_web_history',
};

// Initialisation
export const initDatabase = () => {
  console.log('✅ Mode Web: AsyncStorage activé');
};

export const openDatabase = () => null;
export const closeDatabase = () => null;

// FAVORIS
export const addFavorite = async (name, country = null, latitude = null, longitude = null) => {
  try {
    const favorites = await getAllFavorites();
    const exists = favorites.some(f => f.name.toLowerCase() === name.toLowerCase());
    
    if (exists) {
      return { success: false, error: 'Déjà dans les favoris' };
    }

    const newFav = {
      id: Date.now(),
      name,
      country,
      latitude,
      longitude,
      added_at: new Date().toISOString(),
    };

    favorites.push(newFav);
    await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
    return { success: true, id: newFav.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getAllFavorites = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const removeFavorite = async (id) => {
  try {
    const favorites = await getAllFavorites();
    const filtered = favorites.filter(f => f.id !== id);
    await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(filtered));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const isFavorite = async (cityName) => {
  const favorites = await getAllFavorites();
  return favorites.some(f => f.name.toLowerCase() === cityName.toLowerCase());
};

export const updateFavorite = async (id, data) => {
  try {
    const favorites = await getAllFavorites();
    const index = favorites.findIndex(f => f.id === id);
    if (index !== -1) {
      favorites[index] = { ...favorites[index], ...data };
      await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// HISTORIQUE
export const addSearchHistory = async (cityName) => {
  try {
    const history = await getSearchHistory(50);
    const updated = [cityName, ...history.filter(c => c !== cityName)].slice(0, 50);
    await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
    return { success: true };
  } catch {
    return { success: false };
  }
};

export const getSearchHistory = async (limit = 10) => {
  try {
    const data = await AsyncStorage.getItem(KEYS.HISTORY);
    const history = data ? JSON.parse(data) : [];
    return history.slice(0, limit);
  } catch {
    return [];
  }
};

export const clearSearchHistory = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.HISTORY);
    return { success: true };
  } catch {
    return { success: false };
  }
};

// CACHE (non implémenté sur web)
export const cacheAirQuality = async () => ({ success: true });
export const getCachedAirQuality = async () => null;
export const cleanExpiredCache = async () => ({ success: true });
export const addAirQualityHistory = async () => ({ success: true });
export const getAirQualityHistory = async () => [];

// STATS
export const getDatabaseStats = async () => {
  const favorites = await getAllFavorites();
  const history = await getSearchHistory(100);
  return {
    favoritesCount: favorites.length,
    historyCount: history.length,
    cacheCount: 0,
    measurementsCount: 0,
  };
};

export const resetDatabase = async () => {
  try {
    await AsyncStorage.multiRemove([KEYS.FAVORITES, KEYS.HISTORY]);
    return { success: true };
  } catch {
    return { success: false };
  }
};

export default {
  initDatabase,
  openDatabase,
  closeDatabase,
  addFavorite,
  getAllFavorites,
  removeFavorite,
  isFavorite,
  updateFavorite,
  addSearchHistory,
  getSearchHistory,
  clearSearchHistory,
  cacheAirQuality,
  getCachedAirQuality,
  cleanExpiredCache,
  addAirQualityHistory,
  getAirQualityHistory,
  getDatabaseStats,
  resetDatabase,
};