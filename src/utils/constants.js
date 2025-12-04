// ============================================
// API CONFIGURATION
// ============================================

export const API_CONFIG = {
  WAQI_BASE_URL: 'https://api.waqi.info/feed',
  WAQI_API_KEY: '05ef8f5ab65f63e2d00f65a93e35009190308f84',
  DEFAULT_TIMEOUT: 10000, // 10 secondes
  CACHE_DURATION: 30, // 30 minutes
};

// ============================================
// COLORS
// ============================================

export const COLORS = {
  // Background
  background: '#000000',
  cardBackground: '#1C1C1E',
  secondaryBackground: '#2C2C2E',
  
  // Text
  primary: '#FFFFFF',
  secondary: '#8E8E93',
  tertiary: '#3A3A3C',
  
  // Brand
  accent: '#00E400',
  accentTransparent: '#00E40020',
  
  // Status
  success: '#00E400',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
  
  // AQI Colors
  aqi: {
    good: '#00E400',           // 0-50
    moderate: '#FFFF00',       // 51-100
    unhealthySensitive: '#FF7E00', // 101-150
    unhealthy: '#FF0000',      // 151-200
    veryUnhealthy: '#8F3F97',  // 201-300
    hazardous: '#7E0023',      // 300+
    unknown: '#8E8E93',
  },
};

// ============================================
// TYPOGRAPHY
// ============================================

export const TYPOGRAPHY = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// ============================================
// SPACING
// ============================================

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// ============================================
// BORDER RADIUS
// ============================================

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

// ============================================
// AQI LEVELS
// ============================================

export const AQI_LEVELS = [
  {
    min: 0,
    max: 50,
    level: 'Bon',
    color: COLORS.aqi.good,
    emoji: '😊',
    description: 'La qualité de l\'air est excellente.',
    advice: 'Profitez de vos activités en plein air !',
  },
  {
    min: 51,
    max: 100,
    level: 'Modéré',
    color: COLORS.aqi.moderate,
    emoji: '😐',
    description: 'La qualité de l\'air est acceptable.',
    advice: 'Les personnes sensibles devraient limiter les efforts prolongés.',
  },
  {
    min: 101,
    max: 150,
    level: 'Mauvais pour groupes sensibles',
    color: COLORS.aqi.unhealthySensitive,
    emoji: '😷',
    description: 'Membres des groupes sensibles peuvent ressentir des effets.',
    advice: 'Les groupes sensibles devraient réduire les efforts prolongés.',
  },
  {
    min: 151,
    max: 200,
    level: 'Mauvais',
    color: COLORS.aqi.unhealthy,
    emoji: '😨',
    description: 'Tout le monde peut commencer à ressentir des effets.',
    advice: 'Tout le monde devrait limiter les efforts prolongés.',
  },
  {
    min: 201,
    max: 300,
    level: 'Très mauvais',
    color: COLORS.aqi.veryUnhealthy,
    emoji: '🤢',
    description: 'Alerte sanitaire.',
    advice: 'Évitez les efforts en extérieur.',
  },
  {
    min: 301,
    max: 999,
    level: 'Dangereux',
    color: COLORS.aqi.hazardous,
    emoji: '☠️',
    description: 'Urgence sanitaire.',
    advice: 'Restez à l\'intérieur et gardez les fenêtres fermées.',
  },
];

// ============================================
// POLLUTANTS INFO
// ============================================

export const POLLUTANTS = {
  pm25: {
    name: 'PM2.5',
    fullName: 'Particules fines',
    unit: 'µg/m³',
    description: 'Particules de diamètre inférieur à 2,5 micromètres',
    icon: 'water',
  },
  pm10: {
    name: 'PM10',
    fullName: 'Particules',
    unit: 'µg/m³',
    description: 'Particules de diamètre inférieur à 10 micromètres',
    icon: 'water-outline',
  },
  o3: {
    name: 'O₃',
    fullName: 'Ozone',
    unit: 'µg/m³',
    description: 'Ozone troposphérique',
    icon: 'sunny',
  },
  no2: {
    name: 'NO₂',
    fullName: 'Dioxyde d\'azote',
    unit: 'µg/m³',
    description: 'Émis principalement par les véhicules',
    icon: 'car',
  },
  so2: {
    name: 'SO₂',
    fullName: 'Dioxyde de soufre',
    unit: 'µg/m³',
    description: 'Émis par l\'industrie et le chauffage',
    icon: 'business',
  },
  co: {
    name: 'CO',
    fullName: 'Monoxyde de carbone',
    unit: 'µg/m³',
    description: 'Gaz toxique incolore et inodore',
    icon: 'warning',
  },
};

// ============================================
// STORAGE KEYS
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
// APP INFO
// ============================================

export const APP_INFO = {
  name: 'Eco-Air',
  version: '1.0.0',
  description: 'Application de suivi de la qualité de l\'air',
  author: 'Maelle',
  dataSource: 'World Air Quality Index (WAQI)',
  website: 'https://aqicn.org',
};

// ============================================
// LIMITS & THRESHOLDS
// ============================================

export const LIMITS = {
  MAX_FAVORITES: 50,
  MAX_SEARCH_HISTORY: 10,
  MAX_MEASUREMENTS_HISTORY: 1000,
  CACHE_EXPIRATION_MINUTES: 30,
  REQUEST_TIMEOUT_MS: 10000,
};

// ============================================
// NOTIFICATION SETTINGS
// ============================================

export const NOTIFICATION_DEFAULTS = {
  enabled: false,
  alertThreshold: 150,
  dailyReminder: false,
  reminderTime: '09:00',
};

// ============================================
// ERROR MESSAGES
// ============================================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
  API_ERROR: 'Impossible de récupérer les données. Réessayez plus tard.',
  LOCATION_DENIED: 'Permission de localisation refusée.',
  LOCATION_ERROR: 'Impossible de récupérer votre position.',
  CITY_NOT_FOUND: 'Ville introuvable. Vérifiez l\'orthographe.',
  GENERIC_ERROR: 'Une erreur est survenue.',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Obtenir les informations d'un niveau AQI
 */
export const getAQILevel = (aqi) => {
  if (!aqi) return null;
  return AQI_LEVELS.find((level) => aqi >= level.min && aqi <= level.max);
};

/**
 * Obtenir la couleur AQI
 */
export const getAQIColor = (aqi) => {
  const level = getAQILevel(aqi);
  return level ? level.color : COLORS.aqi.unknown;
};

/**
 * Formater une date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default {
  API_CONFIG,
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  AQI_LEVELS,
  POLLUTANTS,
  STORAGE_KEYS,
  APP_INFO,
  LIMITS,
  NOTIFICATION_DEFAULTS,
  ERROR_MESSAGES,
  getAQILevel,
  getAQIColor,
  formatDate,
};