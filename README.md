# 📱 Aperçu
Eco-Air est une application mobile qui vous permet de consulter la qualité de l'air en temps réel partout dans le monde. Obtenez des données précises sur les polluants, des conseils santé personnalisés et suivez vos villes favorites.

# ✨ Fonctionnalités principales

🌍 Qualité de l'air en temps réel via l'API World Air Quality Index (WAQI)
📍 Géolocalisation automatique pour votre position actuelle
🔍 Recherche de villes avec historique intelligent
❤️ Gestion des favoris pour un accès rapide
📊 Données détaillées sur tous les polluants (PM2.5, PM10, O3, NO2, SO2, CO)
💡 Conseils santé adaptés au niveau de pollution
🎨 Interface Dark Mode élégante et intuitive
🔔 Notifications pour les alertes de pollution
💾 Persistance des données (favoris, historique)
🌐 Support plateforme Web

# 🔧 Configuration du projet Eco-Air

## 📋 Prérequis

- Node.js (v18+)
- npm ou yarn
- Compte WAQI pour obtenir une clé API

## 🚀 Installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/eco-air.git
cd eco-air
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
# Copier le fichier exemple
cp .env.example .env

# Éditer .env et remplacer par votre vraie clé API
nano .env
```

4. **Obtenir votre clé API WAQI**
- Allez sur https://aqicn.org/data-platform/token/
- Remplissez le formulaire (gratuit, instantané)
- Copiez votre token dans `.env`

5. **Lancer l'application**
```bash
npx expo start
```

## 🔑 Variables d'environnement

Créez un fichier `.env` à la racine avec :
```env
WAQI_API_KEY=votre_cle_api_ici
```
