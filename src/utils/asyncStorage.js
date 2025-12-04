import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================
// UTILITAIRES GÉNÉRIQUES ASYNCSTORAGE
// ============================================

/**
 * Sauvegarder des données
 * @param {string} key - Clé de stockage
 * @param {any} value - Valeur à stocker (sera convertie en JSON)
 * @returns {Promise<boolean>} - Succès ou échec
 */
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
    return false;
  }
};

/**
 * Récupérer des données
 * @param {string} key - Clé de stockage
 * @returns {Promise<any|null>} - Données récupérées ou null
 */
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Erreur lors de la récupération de ${key}:`, error);
    return null;
  }
};

/**
 * Supprimer des données
 * @param {string} key - Clé à supprimer
 * @returns {Promise<boolean>} - Succès ou échec
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression de ${key}:`, error);
    return false;
  }
};

/**
 * Vider tout le stockage
 * @returns {Promise<boolean>} - Succès ou échec
 */
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Erreur lors du vidage du stockage:', error);
    return false;
  }
};

/**
 * Récupérer toutes les clés
 * @returns {Promise<string[]>} - Liste des clés
 */
export const getAllKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys;
  } catch (error) {
    console.error('Erreur lors de la récupération des clés:', error);
    return [];
  }
};

/**
 * Récupérer plusieurs valeurs en une seule fois
 * @param {string[]} keys - Array de clés
 * @returns {Promise<Object>} - Objet avec clé-valeur
 */
export const getMultiple = async (keys) => {
  try {
    const values = await AsyncStorage.multiGet(keys);
    const result = {};
    values.forEach(([key, value]) => {
      result[key] = value ? JSON.parse(value) : null;
    });
    return result;
  } catch (error) {
    console.error('Erreur lors de la récupération multiple:', error);
    return {};
  }
};

/**
 * Sauvegarder plusieurs valeurs en une seule fois
 * @param {Object} data - Objet avec clé-valeur
 * @returns {Promise<boolean>} - Succès ou échec
 */
export const setMultiple = async (data) => {
  try {
    const pairs = Object.entries(data).map(([key, value]) => [
      key,
      JSON.stringify(value),
    ]);
    await AsyncStorage.multiSet(pairs);
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde multiple:', error);
    return false;
  }
};

/**
 * Vérifier si une clé existe
 * @param {string} key - Clé à vérifier
 * @returns {Promise<boolean>} - Existe ou non
 */
export const hasKey = async (key) => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys.includes(key);
  } catch (error) {
    console.error(`Erreur lors de la vérification de ${key}:`, error);
    return false;
  }
};

// ============================================
// CLÉS DE STOCKAGE (CONSTANTES)
// ============================================

export const STORAGE_KEYS = {
  FAVORITES: '@ecoair_favorites',
  USER_LOCATION: '@ecoair_user_location',
  LAST_CITY: '@ecoair_last_city',
  THEME: '@ecoair_theme',
  NOTIFICATIONS: '@ecoair_notifications',
  ONBOARDING_DONE: '@ecoair_onboarding',
  SEARCH_HISTORY: '@ecoair_search_history',
  AIR_QUALITY_CACHE: '@ecoair_aq_cache',
};

// ============================================
// FONCTIONS SPÉCIFIQUES À L'APP ECO-AIR
// ============================================

/**
 * Sauvegarder la dernière ville recherchée
 */
export const saveLastCity = async (cityName) => {
  return await storeData(STORAGE_KEYS.LAST_CITY, cityName);
};

/**
 * Récupérer la dernière ville recherchée
 */
export const getLastCity = async () => {
  return await getData(STORAGE_KEYS.LAST_CITY);
};

/**
 * Sauvegarder l'historique de recherche
 */
export const saveSearchHistory = async (cityName) => {
  try {
    let history = (await getData(STORAGE_KEYS.SEARCH_HISTORY)) || [];
    
    // Éviter les doublons
    history = history.filter(city => city.toLowerCase() !== cityName.toLowerCase());
    
    // Ajouter en début de liste
    history.unshift(cityName);
    
    // Limiter à 10 éléments
    history = history.slice(0, 10);
    
    return await storeData(STORAGE_KEYS.SEARCH_HISTORY, history);
  } catch (error) {
    console.error('Erreur sauvegarde historique:', error);
    return false;
  }
};

/**
 * Récupérer l'historique de recherche
 */
export const getSearchHistory = async () => {
  return (await getData(STORAGE_KEYS.SEARCH_HISTORY)) || [];
};

/**
 * Vider l'historique de recherche
 */
export const clearSearchHistory = async () => {
  try {
    await removeData(STORAGE_KEYS.SEARCH_HISTORY);
    console.log('✅ Historique AsyncStorage effacé');
    return { success: true };
  } catch (error) {
    console.error('Erreur vidage historique:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Marquer l'onboarding comme terminé
 */
export const setOnboardingDone = async () => {
  return await storeData(STORAGE_KEYS.ONBOARDING_DONE, true);
};

/**
 * Vérifier si l'onboarding a été fait
 */
export const isOnboardingDone = async () => {
  return (await getData(STORAGE_KEYS.ONBOARDING_DONE)) || false;
};

/**
 * Sauvegarder les préférences de notifications
 */
export const saveNotificationPreferences = async (preferences) => {
  return await storeData(STORAGE_KEYS.NOTIFICATIONS, preferences);
};

/**
 * Récupérer les préférences de notifications
 */
export const getNotificationPreferences = async () => {
  return (await getData(STORAGE_KEYS.NOTIFICATIONS)) || {
    enabled: false,
    alertThreshold: 150,
    dailyReminder: false,
  };
};

/**
 * Sauvegarder la position de l'utilisateur
 */
export const saveUserLocation = async (location) => {
  return await storeData(STORAGE_KEYS.USER_LOCATION, location);
};

/**
 * Récupérer la position de l'utilisateur
 */
export const getUserLocation = async () => {
  return await getData(STORAGE_KEYS.USER_LOCATION);
};

/**
 * Cache pour les données de qualité de l'air (avec expiration)
 */
export const cacheAirQuality = async (cityName, data, expirationMinutes = 30) => {
  const cacheData = {
    data,
    timestamp: Date.now(),
    expiration: expirationMinutes * 60 * 1000,
  };
  
  const cacheKey = `${STORAGE_KEYS.AIR_QUALITY_CACHE}_${cityName.toLowerCase()}`;
  return await storeData(cacheKey, cacheData);
};

/**
 * Récupérer les données cachées si elles sont encore valides
 */
export const getCachedAirQuality = async (cityName) => {
  const cacheKey = `${STORAGE_KEYS.AIR_QUALITY_CACHE}_${cityName.toLowerCase()}`;
  const cached = await getData(cacheKey);
  
  if (!cached) return null;
  
  const now = Date.now();
  const isExpired = now - cached.timestamp > cached.expiration;
  
  if (isExpired) {
    await removeData(cacheKey);
    return null;
  }
  
  return cached.data;
};

/**
 * Exporter toutes les données (pour backup)
 */
export const exportAllData = async () => {
  try {
    const keys = await getAllKeys();
    const data = await getMultiple(keys);
    return data;
  } catch (error) {
    console.error('Erreur export données:', error);
    return null;
  }
};

/**
 * Importer des données (pour restore)
 */
export const importData = async (data) => {
  return await setMultiple(data);
};

export default {
  storeData,
  getData,
  removeData,
  clearAll,
  getAllKeys,
  getMultiple,
  setMultiple,
  hasKey,
  STORAGE_KEYS,
  // Fonctions spécifiques
  saveLastCity,
  getLastCity,
  saveSearchHistory,
  getSearchHistory,
  clearSearchHistory,
  setOnboardingDone,
  isOnboardingDone,
  saveNotificationPreferences,
  getNotificationPreferences,
  saveUserLocation,
  getUserLocation,
  cacheAirQuality,
  getCachedAirQuality,
  exportAllData,
  importData,
};