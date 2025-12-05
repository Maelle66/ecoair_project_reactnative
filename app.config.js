export default {
  expo: {
    name: "Eco-Air",
    slug: "eco-air",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "dark",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#000000"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.Maelle.ecoair",
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "Eco-Air utilise votre position pour afficher la qualité de l'air à votre emplacement actuel.",
        NSLocationAlwaysAndWhenInUseUsageDescription: "Eco-Air utilise votre position pour afficher la qualité de l'air à votre emplacement actuel.",
        UIBackgroundModes: [
          "location"
        ]
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#000000"
      },
      package: "com.Maelle.ecoair",
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ]
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro"
    },
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Permet à Eco-Air d'accéder à votre position pour afficher la qualité de l'air locale.",
          locationAlwaysPermission: "Permet à Eco-Air d'accéder à votre position en arrière-plan pour les notifications de qualité de l'air.",
          locationWhenInUsePermission: "Permet à Eco-Air d'accéder à votre position lorsque vous utilisez l'application.",
          isAndroidBackgroundLocationEnabled: false,
          isIosBackgroundLocationEnabled: false
        }
      ]
    ],
    extra: {
      // ⚠️ PAS DE CLÉ ICI - Elle sera lue depuis .env
      eas: {
        projectId: "ecoair_project"
      }
    },
    owner: "Maelle",
    scheme: "ecoair",
    updates: {
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/ecoair_project"
    },
    runtimeVersion: {
      policy: "sdkVersion"
    }
  }
};