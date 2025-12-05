import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';

export const useLocation = (autoFetch = false) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);

  // Demander la permission de localisation
  const requestPermission = async () => {
    try {
      if (Platform.OS === 'web') {
        // Sur web, pas besoin de demander via Expo
        console.log('📍 Web : Permission géolocalisation gérée par le navigateur');
        return true;
      }
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      return status === 'granted';
    } catch (err) {
      setError('Erreur lors de la demande de permission');
      console.error('Erreur permission:', err);
      return false;
    }
  };

  // Obtenir la position actuelle
  const getCurrentLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('📍 Demande de permission de localisation...');
      
      // Sur web, utiliser l'API native du navigateur
      if (Platform.OS === 'web') {
        return await getCurrentLocationWeb();
      }
      
      // Sur mobile, utiliser Expo Location
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('⚠️ Permission non accordée, demande en cours...');
        const granted = await requestPermission();
        if (!granted) {
          setError('Permission de localisation refusée');
          setLoading(false);
          console.error('❌ Permission refusée par l\'utilisateur');
          return null;
        }
      }

      console.log('🔄 Récupération de la position...');
      
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        altitude: currentLocation.coords.altitude,
        accuracy: currentLocation.coords.accuracy,
      };

      console.log('✅ Position obtenue:', coords);
      setLocation(coords);
      setLoading(false);
      return coords;
    } catch (err) {
      const errorMsg = 'Impossible de récupérer votre position';
      setError(errorMsg);
      console.error('❌ Erreur localisation:', err);
      setLoading(false);
      return null;
    }
  };

  // Fonction spécifique pour le web
  const getCurrentLocationWeb = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = 'La géolocalisation n\'est pas supportée par ce navigateur';
        setError(error);
        setLoading(false);
        reject(new Error(error));
        return;
      }

      console.log('🌐 Utilisation de l\'API Geolocation du navigateur');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude,
            accuracy: position.coords.accuracy,
          };

          console.log('✅ Position Web obtenue:', coords);
          console.log('📏 Précision:', coords.accuracy, 'mètres');
          
          setLocation(coords);
          setLoading(false);
          resolve(coords);
        },
        (err) => {
          let errorMsg = 'Erreur de géolocalisation';
          
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMsg = 'Permission de localisation refusée. Autorisez la localisation dans votre navigateur.';
              console.error('❌ Permission refusée par l\'utilisateur');
              break;
            case err.POSITION_UNAVAILABLE:
              errorMsg = 'Position indisponible';
              console.error('❌ Position indisponible');
              break;
            case err.TIMEOUT:
              errorMsg = 'Délai de localisation dépassé';
              console.error('❌ Timeout');
              break;
            default:
              console.error('❌ Erreur inconnue:', err.message);
          }
          
          setError(errorMsg);
          setLoading(false);
          reject(new Error(errorMsg));
        },
        {
          enableHighAccuracy: true, // Utiliser le GPS si disponible
          timeout: 10000, // 10 secondes
          maximumAge: 0, // Ne pas utiliser de cache
        }
      );
    });
  };

  // Obtenir l'adresse à partir des coordonnées (Reverse Geocoding)
  const getAddressFromCoords = async (coords) => {
    try {
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (addressResponse && addressResponse.length > 0) {
        const address = addressResponse[0];
        return {
          city: address.city || address.subregion,
          country: address.country,
          region: address.region,
          postalCode: address.postalCode,
          street: address.street,
          formattedAddress: `${address.city || address.subregion}, ${address.country}`,
        };
      }
      return null;
    } catch (err) {
      console.error('Erreur geocoding:', err);
      return null;
    }
  };

  // Surveiller les changements de position (en temps réel)
  const watchLocation = async (callback) => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        const granted = await requestPermission();
        if (!granted) return null;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000, // Mise à jour toutes les 10 secondes
          distanceInterval: 50, // Ou tous les 50 mètres
        },
        (newLocation) => {
          const coords = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            altitude: newLocation.coords.altitude,
            accuracy: newLocation.coords.accuracy,
          };
          setLocation(coords);
          if (callback) callback(coords);
        }
      );

      return subscription;
    } catch (err) {
      console.error('Erreur watch location:', err);
      return null;
    }
  };

  // Auto-fetch au montage du composant si demandé
  useEffect(() => {
    if (autoFetch) {
      getCurrentLocation();
    }
  }, [autoFetch]);

  return {
    location,
    loading,
    error,
    permissionStatus,
    requestPermission,
    getCurrentLocation,
    getAddressFromCoords,
    watchLocation,
  };
};

export default useLocation;