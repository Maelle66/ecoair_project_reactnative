import { AQI_LEVELS, COLORS } from './constants';

// ============================================
// AQI HELPERS
// ============================================

/**
 * Obtenir le niveau AQI avec toutes les informations
 * @param {number} aqi - Valeur AQI
 * @returns {Object|null} - Informations du niveau AQI
 */
export const getAQILevel = (aqi) => {
  if (!aqi || isNaN(aqi)) return null;
  const level = AQI_LEVELS.find((l) => aqi >= l.min && aqi <= l.max);
  return level || null;
};

/**
 * Obtenir la couleur correspondante à un AQI
 * @param {number} aqi - Valeur AQI
 * @returns {string} - Code couleur hexadécimal
 */
export const getAQIColor = (aqi) => {
  const level = getAQILevel(aqi);
  return level ? level.color : COLORS.aqi.unknown;
};

/**
 * Obtenir l'emoji correspondant à un AQI
 * @param {number} aqi - Valeur AQI
 * @returns {string} - Emoji
 */
export const getAQIEmoji = (aqi) => {
  const level = getAQILevel(aqi);
  return level ? level.emoji : '🌍';
};

/**
 * Obtenir le conseil santé correspondant à un AQI
 * @param {number} aqi - Valeur AQI
 * @returns {string} - Conseil santé
 */
export const getHealthAdvice = (aqi) => {
  const level = getAQILevel(aqi);
  return level ? level.advice : 'Données indisponibles';
};

// ============================================
// DATE & TIME HELPERS
// ============================================

/**
 * Formater une date en français
 * @param {string|Date} date - Date à formater
 * @returns {string} - Date formatée
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Formater une date avec l'heure
 * @param {string|Date} date - Date à formater
 * @returns {string} - Date et heure formatées
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Obtenir le temps relatif (il y a X minutes/heures)
 * @param {string|Date} date - Date de référence
 * @returns {string} - Temps relatif
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  
  return formatDate(date);
};

// ============================================
// STRING HELPERS
// ============================================

/**
 * Capitaliser la première lettre
 * @param {string} str - Chaîne à capitaliser
 * @returns {string} - Chaîne capitalisée
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Tronquer un texte
 * @param {string} text - Texte à tronquer
 * @param {number} maxLength - Longueur maximale
 * @returns {string} - Texte tronqué
 */
export const truncate = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Nettoyer un nom de ville
 * @param {string} cityName - Nom de la ville
 * @returns {string} - Nom nettoyé
 */
export const cleanCityName = (cityName) => {
  if (!cityName) return '';
  return cityName.trim().replace(/\s+/g, ' ');
};

// ============================================
// NUMBER HELPERS
// ============================================

/**
 * Formater un nombre avec séparateurs de milliers
 * @param {number} num - Nombre à formater
 * @returns {string} - Nombre formaté
 */
export const formatNumber = (num) => {
  if (!num && num !== 0) return '';
  return num.toLocaleString('fr-FR');
};

/**
 * Arrondir un nombre à N décimales
 * @param {number} num - Nombre à arrondir
 * @param {number} decimals - Nombre de décimales
 * @returns {number} - Nombre arrondi
 */
export const roundTo = (num, decimals = 2) => {
  if (!num && num !== 0) return 0;
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Valider un AQI
 * @param {number} aqi - Valeur AQI
 * @returns {boolean} - Validité
 */
export const isValidAQI = (aqi) => {
  return typeof aqi === 'number' && aqi >= 0 && aqi <= 500;
};

/**
 * Valider des coordonnées GPS
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {boolean} - Validité
 */
export const isValidCoordinates = (latitude, longitude) => {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

/**
 * Valider un nom de ville
 * @param {string} cityName - Nom de la ville
 * @returns {boolean} - Validité
 */
export const isValidCityName = (cityName) => {
  if (!cityName || typeof cityName !== 'string') return false;
  const cleaned = cleanCityName(cityName);
  return cleaned.length >= 2 && cleaned.length <= 100;
};

// ============================================
// ARRAY HELPERS
// ============================================

/**
 * Supprimer les doublons d'un tableau
 * @param {Array} array - Tableau
 * @param {string} key - Clé pour comparaison (optionnel)
 * @returns {Array} - Tableau sans doublons
 */
export const removeDuplicates = (array, key = null) => {
  if (!Array.isArray(array)) return [];
  
  if (key) {
    return array.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t[key] === item[key])
    );
  }
  
  return [...new Set(array)];
};

/**
 * Trier un tableau par une propriété
 * @param {Array} array - Tableau à trier
 * @param {string} key - Clé de tri
 * @param {string} order - 'asc' ou 'desc'
 * @returns {Array} - Tableau trié
 */
export const sortByKey = (array, key, order = 'asc') => {
  if (!Array.isArray(array)) return [];
  
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// ============================================
// GEOLOCATION HELPERS
// ============================================

/**
 * Calculer la distance entre deux points GPS (en km)
 * @param {number} lat1 - Latitude point 1
 * @param {number} lon1 - Longitude point 1
 * @param {number} lat2 - Latitude point 2
 * @param {number} lon2 - Longitude point 2
 * @returns {number} - Distance en km
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Convertir des degrés en radians
 * @param {number} degrees - Degrés
 * @returns {number} - Radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

// ============================================
// ERROR HELPERS
// ============================================

/**
 * Extraire un message d'erreur lisible
 * @param {Error} error - Erreur
 * @returns {string} - Message d'erreur
 */
export const getErrorMessage = (error) => {
  if (!error) return 'Une erreur est survenue';
  
  if (typeof error === 'string') return error;
  
  if (error.message) return error.message;
  
  if (error.response?.data?.message) return error.response.data.message;
  
  return 'Une erreur est survenue';
};

// ============================================
// DEBOUNCE HELPER
// ============================================

/**
 * Créer une fonction debounced
 * @param {Function} func - Fonction à debouncer
 * @param {number} wait - Délai en ms
 * @returns {Function} - Fonction debounced
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// ============================================
// EXPORT DEFAULT
// ============================================

export default {
  // AQI
  getAQILevel,
  getAQIColor,
  getAQIEmoji,
  getHealthAdvice,
  // Date & Time
  formatDate,
  formatDateTime,
  getRelativeTime,
  // String
  capitalize,
  truncate,
  cleanCityName,
  // Number
  formatNumber,
  roundTo,
  // Validation
  isValidAQI,
  isValidCoordinates,
  isValidCityName,
  // Array
  removeDuplicates,
  sortByKey,
  // Geolocation
  calculateDistance,
  // Error
  getErrorMessage,
  // Other
  debounce,
};