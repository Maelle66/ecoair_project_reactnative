import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@ecoair_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les favoris au montage du composant
  useEffect(() => {
    loadFavorites();
  }, []);

  // Charger les favoris depuis AsyncStorage
  const loadFavorites = async () => {
    try {
      setLoading(true);
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
      
      if (storedFavorites !== null) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (err) {
      setError('Erreur lors du chargement des favoris');
      console.error('Erreur load favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sauvegarder les favoris dans AsyncStorage
  const saveFavorites = async (newFavorites) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
      console.error('Erreur save favorites:', err);
    }
  };

  // Ajouter une ville aux favoris
  const addFavorite = async (city) => {
    try {
      // Vérifier si la ville n'est pas déjà dans les favoris
      const cityExists = favorites.some(
        (fav) => fav.name.toLowerCase() === city.name.toLowerCase()
      );

      if (cityExists) {
        setError('Cette ville est déjà dans vos favoris');
        return false;
      }

      const newFavorite = {
        id: Date.now().toString(),
        name: city.name || city,
        addedAt: new Date().toISOString(),
        ...city, // Ajoute les autres propriétés si présentes (coords, country, etc.)
      };

      const updatedFavorites = [...favorites, newFavorite];
      await saveFavorites(updatedFavorites);
      setError(null);
      return true;
    } catch (err) {
      setError('Impossible d\'ajouter aux favoris');
      console.error('Erreur add favorite:', err);
      return false;
    }
  };

  // Retirer une ville des favoris
  const removeFavorite = async (cityId) => {
    try {
      const updatedFavorites = favorites.filter((fav) => fav.id !== cityId);
      await saveFavorites(updatedFavorites);
      setError(null);
      return true;
    } catch (err) {
      setError('Impossible de retirer des favoris');
      console.error('Erreur remove favorite:', err);
      return false;
    }
  };

  // Vérifier si une ville est dans les favoris
  const isFavorite = (cityName) => {
    return favorites.some(
      (fav) => fav.name.toLowerCase() === cityName.toLowerCase()
    );
  };

  // Obtenir un favori par son nom
  const getFavoriteByName = (cityName) => {
    return favorites.find(
      (fav) => fav.name.toLowerCase() === cityName.toLowerCase()
    );
  };

  // Toggle favori (ajouter si absent, retirer si présent)
  const toggleFavorite = async (city) => {
    const favorite = getFavoriteByName(city.name || city);
    
    if (favorite) {
      return await removeFavorite(favorite.id);
    } else {
      return await addFavorite(city);
    }
  };

  // Vider tous les favoris
  const clearAllFavorites = async () => {
    try {
      await AsyncStorage.removeItem(FAVORITES_KEY);
      setFavorites([]);
      setError(null);
      return true;
    } catch (err) {
      setError('Impossible de vider les favoris');
      console.error('Erreur clear favorites:', err);
      return false;
    }
  };

  // Mettre à jour un favori existant
  const updateFavorite = async (cityId, updatedData) => {
    try {
      const updatedFavorites = favorites.map((fav) =>
        fav.id === cityId ? { ...fav, ...updatedData, updatedAt: new Date().toISOString() } : fav
      );
      await saveFavorites(updatedFavorites);
      setError(null);
      return true;
    } catch (err) {
      setError('Impossible de mettre à jour le favori');
      console.error('Erreur update favorite:', err);
      return false;
    }
  };

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteByName,
    toggleFavorite,
    clearAllFavorites,
    updateFavorite,
    refreshFavorites: loadFavorites,
  };
};

export default useFavorites;