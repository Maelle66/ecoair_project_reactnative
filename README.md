# 🌿 Eco-Air

**Eco-Air** est une application mobile qui vous permet de consulter la qualité de l'air en temps réel partout dans le monde. Obtenez des données précises sur les polluants, des conseils santé personnalisés et suivez vos villes favorites.

### ✨ Fonctionnalités principales

- 🌍 **Qualité de l'air en temps réel** via l'API World Air Quality Index (WAQI)
- 📍 **Géolocalisation automatique** pour votre position actuelle
- 🔍 **Recherche de villes** avec historique intelligent
- ❤️ **Gestion des favoris** pour un accès rapide
- 📊 **Données détaillées** sur tous les polluants (PM2.5, PM10, O3, NO2, SO2, CO)
- 💡 **Conseils santé** adaptés au niveau de pollution
- 🎨 **Interface Dark Mode** élégante et intuitive
- 🔔 **Notifications** pour les alertes de pollution
- 💾 **Persistance des données** (favoris, historique)
- 🌐 **Support plateforme** (Web)

---

## 🚀 Installation

### Prérequis

- **Node.js** (v18 ou supérieur)
- **npm**
- **Expo CLI** (recommandé)
- Compte **WAQI** pour obtenir une clé API gratuite

### Étapes d'installation

1. **Cloner le repository**

```bash
git clone https://github.com/votre-username/eco-air.git
cd eco-air
```

2. **Installer les dépendances**

```bash
npm install

```

3. **Obtenir votre clé API WAQI**

- Rendez-vous sur [https://aqicn.org/data-platform/token/](https://aqicn.org/data-platform/token/)
- Remplissez le formulaire (gratuit, instantané)
- Copiez votre token

4. **Configurer la clé API**

Ouvrez `utils/constants.js` et remplacez :

```javascript
export const API_CONFIG = {
  WAQI_BASE_URL: 'https://api.waqi.info/feed',
  WAQI_API_KEY: 'VOTRE_CLE_API_ICI', // ⚠️ Remplacez ici
  DEFAULT_TIMEOUT: 10000,
  CACHE_DURATION: 30,
};
```

5. **Lancer l'application**

```bash
# Démarrer le serveur Expo
npx expo start

---

## 📁 Structure du projet

```
eco-air/
│
├── 📄 App.js                          # Point d'entrée principal
├── 📄 app.json                        # Configuration Expo
├── 📄 package.json                    # Dépendances npm
│
├── 📁 assets/                         # Assets visuels
│   ├── icon.png                       # Icône de l'app (1024x1024)
│   ├── adaptive-icon.png              # Icône Android (1024x1024)
│   ├── splash.png                     # Splash screen (1242x2436)
│   └── favicon.png                    # Favicon web (48x48)
│
├── 📁 screens/                        # Écrans de l'application
│   ├── HomeScreen.js                  # Écran d'accueil (position actuelle)
│   ├── SearchScreen.js                # Recherche de villes
│   ├── FavoritesScreen.js             # Liste des favoris
│   ├── SettingsScreen.js              # Paramètres de l'app
│   ├── CityDetailScreen.js            # Détails d'une ville
│   └── OnboardingScreen.js            # Premier lancement
│
├── 📁 components/                     # Composants réutilisables
│   ├── AirQualityCard.js              # Card affichage AQI
│   ├── CityCard.js                    # Card pour une ville
│   ├── SearchBar.js                   # Barre de recherche
│   ├── LoadingSpinner.js              # Spinner de chargement
│   ├── ErrorMessage.js                # Affichage d'erreurs
│   └── AQIBadge.js                    # Badge AQI compact
│
├── 📁 hooks/                          # Hooks personnalisés
│   ├── useAirQuality.js               # Hook API WAQI
│   ├── useLocation.js                 # Hook géolocalisation
│   └── useFavorites.js                # Hook gestion favoris
│
└── 📁 utils/                          # Utilitaires
    ├── asyncStorage.js                # Stockage simple (AsyncStorage)
    ├── sqliteDatabase.js              # Base de données (mobile - SQLite)
    ├── sqliteDatabaseWeb.js           # Base de données (web - AsyncStorage)
    ├── database.js                    # Sélecteur de DB selon plateforme
    ├── constants.js                   # Constantes globales
    └── helpers.js                     # Fonctions utilitaires
```

---

## 🛠️ Technologies utilisées

### Frontend
- **React Native** - Framework mobile
- **Expo** - Plateforme de développement
- **React Navigation** - Navigation (Bottom Tabs + Stack)
- **@expo/vector-icons** - Iconographie (Ionicons)

### Stockage & Base de données
- **AsyncStorage** - Stockage clé-valeur simple
- **expo-sqlite** - Base de données SQLite (mobile uniquement)
- Solution hybride pour le web (AsyncStorage)

### APIs & Services
- **WAQI API** (World Air Quality Index) - Données de qualité de l'air
- **Expo Location** - Géolocalisation

### Styling
- **StyleSheet** (React Native)
- **Flexbox** - Layouts responsives
- Dark Mode natif

---

## 👥 Auteurs

- **Maelle66**

---

## 🙏 Remerciements

- [World Air Quality Index Project](https://aqicn.org/) pour l'API gratuite
- [Expo](https://expo.dev/) pour les outils de développement
- [React Navigation](https://reactnavigation.org/) pour la navigation
