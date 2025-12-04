import * as SQLite from 'expo-sqlite';

// ============================================
// INITIALISATION DE LA BASE DE DONNÉES
// ============================================

let db = null;

/**
 * Ouvrir ou créer la base de données
 */
export const openDatabase = () => {
  if (!db) {
    db = SQLite.openDatabaseSync('ecoair.db');
    console.log('✅ Base de données ouverte');
  }
  return db;
};

/**
 * Initialiser les tables
 */
export const initDatabase = () => {
  const database = openDatabase();

  try {
    // Table des villes favorites
    database.execSync(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        country TEXT,
        latitude REAL,
        longitude REAL,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Table de l'historique de recherche
    database.execSync(`
      CREATE TABLE IF NOT EXISTS search_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city_name TEXT NOT NULL,
        searched_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Table du cache de qualité de l'air
    database.execSync(`
      CREATE TABLE IF NOT EXISTS air_quality_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city_name TEXT NOT NULL UNIQUE,
        aqi INTEGER,
        level TEXT,
        data TEXT,
        cached_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME
      );
    `);

    // Table des mesures historiques (pour graphiques)
    database.execSync(`
      CREATE TABLE IF NOT EXISTS air_quality_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city_name TEXT NOT NULL,
        aqi INTEGER NOT NULL,
        pm25 REAL,
        pm10 REAL,
        o3 REAL,
        no2 REAL,
        measured_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Index pour optimiser les recherches
    database.execSync(`
      CREATE INDEX IF NOT EXISTS idx_favorites_name ON favorites(name);
      CREATE INDEX IF NOT EXISTS idx_search_history_city ON search_history(city_name);
      CREATE INDEX IF NOT EXISTS idx_cache_city ON air_quality_cache(city_name);
      CREATE INDEX IF NOT EXISTS idx_history_city_date ON air_quality_history(city_name, measured_at);
    `);

    console.log('✅ Tables créées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la création des tables:', error);
    throw error;
  }
};

// ============================================
// GESTION DES FAVORIS
// ============================================

/**
 * Ajouter une ville aux favoris
 */
export const addFavorite = (name, country = null, latitude = null, longitude = null) => {
  const database = openDatabase();
  
  try {
    const result = database.runSync(
      'INSERT INTO favorites (name, country, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, country, latitude, longitude]
    );
    
    console.log('✅ Favori ajouté:', name);
    return { success: true, id: result.lastInsertRowId };
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      console.log('⚠️ Cette ville est déjà dans les favoris');
      return { success: false, error: 'Cette ville est déjà dans les favoris' };
    }
    console.error('❌ Erreur ajout favori:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Récupérer tous les favoris
 */
export const getAllFavorites = () => {
  const database = openDatabase();
  
  try {
    const favorites = database.getAllSync(
      'SELECT * FROM favorites ORDER BY added_at DESC'
    );
    return favorites;
  } catch (error) {
    console.error('❌ Erreur récupération favoris:', error);
    return [];
  }
};

/**
 * Supprimer un favori
 */
export const removeFavorite = (id) => {
  const database = openDatabase();
  
  try {
    database.runSync('DELETE FROM favorites WHERE id = ?', [id]);
    console.log('✅ Favori supprimé:', id);
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur suppression favori:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Vérifier si une ville est favorite
 */
export const isFavorite = (cityName) => {
  const database = openDatabase();
  
  try {
    const result = database.getFirstSync(
      'SELECT id FROM favorites WHERE LOWER(name) = LOWER(?)',
      [cityName]
    );
    return result !== null;
  } catch (error) {
    console.error('❌ Erreur vérification favori:', error);
    return false;
  }
};

/**
 * Mettre à jour un favori
 */
export const updateFavorite = (id, data) => {
  const database = openDatabase();
  
  try {
    const { name, country, latitude, longitude } = data;
    database.runSync(
      'UPDATE favorites SET name = ?, country = ?, latitude = ?, longitude = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, country, latitude, longitude, id]
    );
    console.log('✅ Favori mis à jour:', id);
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur mise à jour favori:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// GESTION DE L'HISTORIQUE DE RECHERCHE
// ============================================

/**
 * Ajouter une recherche à l'historique
 */
export const addSearchHistory = (cityName) => {
  const database = openDatabase();
  
  try {
    database.runSync(
      'INSERT INTO search_history (city_name) VALUES (?)',
      [cityName]
    );
    
    // Limiter l'historique à 50 entrées
    database.runSync(`
      DELETE FROM search_history 
      WHERE id NOT IN (
        SELECT id FROM search_history 
        ORDER BY searched_at DESC 
        LIMIT 50
      )
    `);
    
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur ajout historique:', error);
    return { success: false };
  }
};

/**
 * Récupérer l'historique de recherche (dernières 10)
 */
export const getSearchHistory = (limit = 10) => {
  const database = openDatabase();
  
  try {
    const history = database.getAllSync(
      'SELECT DISTINCT city_name FROM search_history ORDER BY searched_at DESC LIMIT ?',
      [limit]
    );
    return history.map(item => item.city_name);
  } catch (error) {
    console.error('❌ Erreur récupération historique:', error);
    return [];
  }
};

/**
 * Vider l'historique de recherche
 */
export const clearSearchHistory = () => {
  const database = openDatabase();
  
  try {
    database.runSync('DELETE FROM search_history');
    console.log('✅ Historique vidé');
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur vidage historique:', error);
    return { success: false };
  }
};

// ============================================
// GESTION DU CACHE QUALITÉ DE L'AIR
// ============================================

/**
 * Mettre en cache les données de qualité de l'air
 */
export const cacheAirQuality = (cityName, aqi, level, fullData, expirationMinutes = 30) => {
  const database = openDatabase();
  
  try {
    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000).toISOString();
    const dataJson = JSON.stringify(fullData);
    
    database.runSync(
      `INSERT OR REPLACE INTO air_quality_cache 
       (city_name, aqi, level, data, cached_at, expires_at) 
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`,
      [cityName, aqi, level, dataJson, expiresAt]
    );
    
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur cache qualité air:', error);
    return { success: false };
  }
};

/**
 * Récupérer les données cachées si valides
 */
export const getCachedAirQuality = (cityName) => {
  const database = openDatabase();
  
  try {
    const cached = database.getFirstSync(
      'SELECT * FROM air_quality_cache WHERE LOWER(city_name) = LOWER(?) AND expires_at > CURRENT_TIMESTAMP',
      [cityName]
    );
    
    if (cached) {
      return {
        ...cached,
        data: JSON.parse(cached.data)
      };
    }
    return null;
  } catch (error) {
    console.error('❌ Erreur récupération cache:', error);
    return null;
  }
};

/**
 * Nettoyer le cache expiré
 */
export const cleanExpiredCache = () => {
  const database = openDatabase();
  
  try {
    database.runSync('DELETE FROM air_quality_cache WHERE expires_at < CURRENT_TIMESTAMP');
    console.log('✅ Cache expiré nettoyé');
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur nettoyage cache:', error);
    return { success: false };
  }
};

// ============================================
// GESTION DE L'HISTORIQUE DES MESURES
// ============================================

/**
 * Enregistrer une mesure historique
 */
export const addAirQualityHistory = (cityName, aqi, pollutants = {}) => {
  const database = openDatabase();
  
  try {
    database.runSync(
      `INSERT INTO air_quality_history 
       (city_name, aqi, pm25, pm10, o3, no2) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        cityName,
        aqi,
        pollutants.pm25 || null,
        pollutants.pm10 || null,
        pollutants.o3 || null,
        pollutants.no2 || null
      ]
    );
    
    // Limiter à 1000 mesures par ville
    database.runSync(`
      DELETE FROM air_quality_history 
      WHERE city_name = ? AND id NOT IN (
        SELECT id FROM air_quality_history 
        WHERE city_name = ?
        ORDER BY measured_at DESC 
        LIMIT 1000
      )
    `, [cityName, cityName]);
    
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur ajout historique mesure:', error);
    return { success: false };
  }
};

/**
 * Récupérer l'historique des mesures (pour graphiques)
 */
export const getAirQualityHistory = (cityName, days = 7) => {
  const database = openDatabase();
  
  try {
    const history = database.getAllSync(
      `SELECT * FROM air_quality_history 
       WHERE LOWER(city_name) = LOWER(?) 
       AND measured_at >= datetime('now', '-' || ? || ' days')
       ORDER BY measured_at ASC`,
      [cityName, days]
    );
    return history;
  } catch (error) {
    console.error('❌ Erreur récupération historique mesures:', error);
    return [];
  }
};

// ============================================
// UTILITAIRES
// ============================================

/**
 * Obtenir des statistiques sur la base de données
 */
export const getDatabaseStats = () => {
  const database = openDatabase();
  
  try {
    const stats = {
      favoritesCount: database.getFirstSync('SELECT COUNT(*) as count FROM favorites')?.count || 0,
      historyCount: database.getFirstSync('SELECT COUNT(*) as count FROM search_history')?.count || 0,
      cacheCount: database.getFirstSync('SELECT COUNT(*) as count FROM air_quality_cache')?.count || 0,
      measurementsCount: database.getFirstSync('SELECT COUNT(*) as count FROM air_quality_history')?.count || 0,
    };
    return stats;
  } catch (error) {
    console.error('❌ Erreur stats database:', error);
    return null;
  }
};

/**
 * Réinitialiser complètement la base de données
 */
export const resetDatabase = () => {
  const database = openDatabase();
  
  try {
    database.execSync('DROP TABLE IF EXISTS favorites');
    database.execSync('DROP TABLE IF EXISTS search_history');
    database.execSync('DROP TABLE IF EXISTS air_quality_cache');
    database.execSync('DROP TABLE IF EXISTS air_quality_history');
    
    initDatabase();
    console.log('✅ Base de données réinitialisée');
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur reset database:', error);
    return { success: false };
  }
};

/**
 * Fermer la base de données
 */
export const closeDatabase = () => {
  if (db) {
    db.closeSync();
    db = null;
    console.log('✅ Base de données fermée');
  }
};

// ============================================
// EXPORT PAR DÉFAUT
// ============================================

export default {
  openDatabase,
  initDatabase,
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
};