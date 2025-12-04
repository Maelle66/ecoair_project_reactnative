import { useState, useEffect } from 'react';
import { API_CONFIG } from '../utils/constants';

const API_KEY = API_CONFIG.WAQI_API_KEY; 
const BASE_URL = API_CONFIG.WAQI_BASE_URL;

export const useAirQuality = (city = null, coords = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city && !coords) return;

    const fetchAirQuality = async () => {
      setLoading(true);
      setError(null);

      try {
        let url;
        
        if (coords) {
          // Recherche par coordonnées GPS
          url = `${BASE_URL}/geo:${coords.latitude};${coords.longitude}/?token=${API_KEY}`;
        } else if (city) {
          // Recherche par nom de ville
          url = `${BASE_URL}/${city}/?token=${API_KEY}`;
        }

        const response = await fetch(url);
        const result = await response.json();

        if (result.status === 'ok') {
          setData(result.data);
        } else {
          setError('Impossible de récupérer les données de qualité de l\'air');
        }
      } catch (err) {
        setError('Erreur de connexion à l\'API');
        console.error('Erreur API:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAirQuality();
  }, [city, coords]);

  // Fonction pour déterminer le niveau de qualité de l'air
  const getAirQualityLevel = (aqi) => {
    if (!aqi) return null;
    
    if (aqi <= 50) return { level: 'Bon', color: '#00E400', emoji: '😊' };
    if (aqi <= 100) return { level: 'Modéré', color: '#FFFF00', emoji: '😐' };
    if (aqi <= 150) return { level: 'Mauvais pour groupes sensibles', color: '#FF7E00', emoji: '😷' };
    if (aqi <= 200) return { level: 'Mauvais', color: '#FF0000', emoji: '😨' };
    if (aqi <= 300) return { level: 'Très mauvais', color: '#8F3F97', emoji: '🤢' };
    return { level: 'Dangereux', color: '#7E0023', emoji: '☠️' };
  };

  // Fonction pour obtenir des conseils santé
  const getHealthAdvice = (aqi) => {
    if (!aqi) return null;

    if (aqi <= 50) {
      return 'La qualité de l\'air est excellente. Profitez de vos activités en plein air !';
    }
    if (aqi <= 100) {
      return 'La qualité de l\'air est acceptable. Les personnes sensibles devraient limiter les efforts prolongés.';
    }
    if (aqi <= 150) {
      return 'Les groupes sensibles devraient réduire les efforts prolongés en extérieur.';
    }
    if (aqi <= 200) {
      return 'Tout le monde devrait limiter les efforts prolongés en extérieur.';
    }
    if (aqi <= 300) {
      return 'Évitez les efforts en extérieur. Les groupes sensibles devraient rester à l\'intérieur.';
    }
    return 'Restez à l\'intérieur et gardez les fenêtres fermées. Activité extérieure fortement déconseillée.';
  };

  return {
    data,
    loading,
    error,
    aqi: data?.aqi,
    city: data?.city?.name,
    qualityLevel: getAirQualityLevel(data?.aqi),
    healthAdvice: getHealthAdvice(data?.aqi),
    pollutants: data?.iaqi,
    timestamp: data?.time?.s,
  };
};

export default useAirQuality;