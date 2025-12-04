import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import des écrans
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import CityDetailScreen from './src/screens/CityDetailScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';

// Import des utilitaires
// Import des utilitaires
import { initDatabase } from './src/utils/database';
import { isOnboardingDone } from './src/utils/asyncStorage';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ============================================
// NAVIGATION PAR ONGLETS (TAB NAVIGATOR)
// ============================================

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00E400',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#1C1C1E',
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: '#1C1C1E',
        },
        headerTintColor: '#FFFFFF',
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Accueil' }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Recherche' }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'Favoris' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Réglages' }}
      />
    </Tab.Navigator>
  );
}

// ============================================
// NAVIGATION PRINCIPALE (STACK NAVIGATOR)
// ============================================

function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1C1C1E',
        },
        headerTintColor: '#FFFFFF',
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: '#000000',
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CityDetail"
        component={CityDetailScreen}
        options={({ route }) => ({
          title: route.params?.cityName || 'Détails',
          headerBackTitle: 'Retour',
        })}
      />
    </Stack.Navigator>
  );
}

// ============================================
// COMPOSANT PRINCIPAL APP
// ============================================

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // 1. Initialiser la base de données SQLite
      console.log('🔧 Initialisation de la base de données...');
      initDatabase();

      // 2. Vérifier si l'utilisateur a déjà fait l'onboarding
      const onboardingCompleted = await isOnboardingDone();
      setShowOnboarding(!onboardingCompleted);

      // 3. Simuler un délai de chargement (splash screen)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('✅ Application initialisée');
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  // Écran de chargement
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00E400" />
      </View>
    );
  }

  // Écran d'onboarding
  if (showOnboarding) {
    return (
      <>
        <OnboardingScreen onComplete={handleOnboardingComplete} />
        <StatusBar style="light" />
      </>
    );
  }

  // Application principale
  return (
    <NavigationContainer>
      <AppNavigator />
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
});