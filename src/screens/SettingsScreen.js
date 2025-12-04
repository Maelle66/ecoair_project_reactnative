import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  getNotificationPreferences,
  saveNotificationPreferences,
  clearSearchHistory,
} from '../utils/asyncStorage';

// Import conditionnel selon la plateforme
const db = Platform.OS === 'web'
  ? require('../utils/sqliteDatabaseWeb')
  : require('../utils/sqliteDatabase');

const { getDatabaseStats, resetDatabase } = db;

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState(150);
  const [databaseStats, setDatabaseStats] = useState(null);

  useEffect(() => {
    loadSettings();
    loadStats();
  }, []);

  const loadSettings = async () => {
    const prefs = await getNotificationPreferences();
    setNotificationsEnabled(prefs.enabled);
    setAlertThreshold(prefs.alertThreshold);
  };

  const loadStats = async () => {
    const stats = await getDatabaseStats();
    setDatabaseStats(stats);
  };

  const handleNotificationsToggle = async (value) => {
    setNotificationsEnabled(value);
    await saveNotificationPreferences({
      enabled: value,
      alertThreshold: alertThreshold,
    });
  };

  const handleThresholdChange = () => {
    Alert.alert(
      'Seuil d\'alerte',
      'Choisissez le niveau AQI pour recevoir une alerte',
      [
        { text: '100 - Modéré', onPress: () => updateThreshold(100) },
        { text: '150 - Mauvais', onPress: () => updateThreshold(150) },
        { text: '200 - Très mauvais', onPress: () => updateThreshold(200) },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  const updateThreshold = async (value) => {
    setAlertThreshold(value);
    await saveNotificationPreferences({
      enabled: notificationsEnabled,
      alertThreshold: value,
    });
    Alert.alert('✓', `Seuil mis à jour : AQI ${value}`);
  };

  const handleClearHistory = async () => {
    Alert.alert(
      'Effacer l\'historique',
      'Voulez-vous vraiment effacer votre historique de recherche ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Effacer',
          style: 'destructive',
          onPress: async () => {
            const result = await clearSearchHistory();
            if (result) {
              Alert.alert('✓', 'Historique effacé');
              await loadStats();
            } else {
              Alert.alert('Erreur', 'Impossible d\'effacer l\'historique');
            }
          },
        },
      ]
    );
  };

  const handleResetDatabase = () => {
    Alert.alert(
      '⚠️ Réinitialiser l\'application',
      'Cela supprimera TOUS vos favoris et données. Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: async () => {
            const result = await resetDatabase();
            if (result.success) {
              await loadStats();
              Alert.alert('✓', 'Application réinitialisée');
            } else {
              Alert.alert('Erreur', 'Impossible de réinitialiser');
            }
          },
        },
      ]
    );
  };

  const getThresholdLabel = (value) => {
    if (value === 100) return 'Modéré (100)';
    if (value === 150) return 'Mauvais (150)';
    if (value === 200) return 'Très mauvais (200)';
    return `AQI ${value}`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Section Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications-outline" size={24} color="#00E400" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Alertes de pollution</Text>
              <Text style={styles.settingDescription}>
                Recevoir une notification si l'AQI dépasse le seuil
              </Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationsToggle}
            trackColor={{ false: '#3A3A3C', true: '#00E40080' }}
            thumbColor={notificationsEnabled ? '#00E400' : '#8E8E93'}
          />
        </View>

        {notificationsEnabled && (
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleThresholdChange}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="speedometer-outline" size={24} color="#00E400" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Seuil d'alerte</Text>
                <Text style={styles.settingDescription}>
                  {getThresholdLabel(alertThreshold)}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
        )}
      </View>

      {/* Section Données */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DONNÉES</Text>

        {databaseStats && (
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{databaseStats.favoritesCount}</Text>
              <Text style={styles.statLabel}>Favoris</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{databaseStats.historyCount}</Text>
              <Text style={styles.statLabel}>Recherches</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{databaseStats.measurementsCount}</Text>
              <Text style={styles.statLabel}>Mesures</Text>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.settingItem} onPress={handleClearHistory}>
          <View style={styles.settingLeft}>
            <Ionicons name="time-outline" size={24} color="#FF9500" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Effacer l'historique</Text>
              <Text style={styles.settingDescription}>
                Supprimer l'historique de recherche
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleResetDatabase}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
            <View style={styles.settingText}>
              <Text style={[styles.settingLabel, { color: '#FF3B30' }]}>
                Réinitialiser l'application
              </Text>
              <Text style={styles.settingDescription}>
                Supprimer toutes les données
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      {/* Section À propos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>À PROPOS</Text>

        <View style={styles.infoCard}>
          <View style={styles.appIcon}>
            <Ionicons name="leaf" size={40} color="#00E400" />
          </View>
          <Text style={styles.appName}>Eco-Air</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDescription}>
            Application de suivi de la qualité de l'air en temps réel
          </Text>
        </View>

        {/* Échelle de qualité de l'air */}
        <View style={styles.scaleCard}>
          <View style={styles.scaleHeader}>
            <Ionicons name="color-palette-outline" size={24} color="#00E400" />
            <Text style={styles.scaleTitle}>Échelle de Qualité de l'Air</Text>
          </View>

          <View style={styles.scaleContainer}>
            {[
              { range: '0-50', level: 'Bon', color: '#00E400' },
              { range: '51-100', level: 'Modéré', color: '#FFFF00' },
              { range: '101-150', level: 'Mauvais (groupes sensibles)', color: '#FF7E00' },
              { range: '151-200', level: 'Mauvais', color: '#FF0000' },
              { range: '201-300', level: 'Très mauvais', color: '#8F3F97' },
              { range: '300+', level: 'Dangereux', color: '#7E0023' },
            ].map((item, index) => (
              <View key={index} style={styles.scaleItem}>
                <View
                  style={[styles.scaleColor, { backgroundColor: item.color }]}
                />
                <View style={styles.scaleInfo}>
                  <Text style={styles.scaleRange}>{item.range}</Text>
                  <Text style={styles.scaleLevel}>{item.level}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="globe-outline" size={24} color="#00E400" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Source des données</Text>
              <Text style={styles.settingDescription}>
                World Air Quality Index (WAQI)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="code-slash-outline" size={24} color="#00E400" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Développé avec</Text>
              <Text style={styles.settingDescription}>
                React Native & Expo
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Fait avec ❤️ pour la planète 🌍
        </Text>
        <Text style={styles.footerCopyright}>
          © 2024 Eco-Air. Tous droits réservés.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#8E8E93',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    color: '#8E8E93',
    fontSize: 13,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 20,
    marginBottom: 8,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#00E400',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#8E8E93',
    fontSize: 12,
  },
  infoCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 8,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#00E40020',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appVersion: {
    color: '#8E8E93',
    fontSize: 14,
    marginBottom: 12,
  },
  appDescription: {
    color: '#8E8E93',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  footerText: {
    color: '#8E8E93',
    fontSize: 14,
    marginBottom: 8,
  },
  footerCopyright: {
    color: '#3A3A3C',
    fontSize: 12,
  },
  scaleCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 20,
    marginBottom: 8,
  },
  scaleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  scaleTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  scaleContainer: {
    gap: 12,
  },
  scaleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scaleColor: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  scaleInfo: {
    flex: 1,
  },
  scaleRange: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scaleLevel: {
    color: '#8E8E93',
    fontSize: 12,
  },
});