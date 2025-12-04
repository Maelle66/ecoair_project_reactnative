import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export const useLocation = (autoFetch = false) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);

  // Demander la permission de localisation
  const requestPermission = async () => {
    try {
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
      // Vérifier d'abord si on a la permission
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        const granted = await requestPermission();
        if (!granted) {
          setError('Permission de localisation refusée');
          setLoading(false);
          return null;
        }
      }

      // Récupérer la position
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        altitude: currentLocation.coords.altitude,
        accuracy: currentLocation.coords.accuracy,
      };

      setLocation(coords);
      setLoading(false);
      return coords;
    } catch (err) {
      setError('Impossible de récupérer votre position');
      console.error('Erreur localisation:', err);
      setLoading(false);
      return null;
    }
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