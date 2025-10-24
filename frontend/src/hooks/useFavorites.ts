import { useState, useEffect } from 'react';
import { Favorite } from '../types';

const FAVORITES_KEY = 'artwork_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
        localStorage.removeItem(FAVORITES_KEY);
      }
    }
  }, []);

  const addToFavorites = (artworkId: string) => {
    const newFavorite: Favorite = {
      artworkId,
      addedAt: new Date(),
    };

    const updatedFavorites = [...favorites, newFavorite];
    setFavorites(updatedFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  };

  const removeFromFavorites = (artworkId: string) => {
    const updatedFavorites = favorites.filter(fav => fav.artworkId !== artworkId);
    setFavorites(updatedFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  };

  const isFavorite = (artworkId: string): boolean => {
    return favorites.some(fav => fav.artworkId === artworkId);
  };

  const toggleFavorite = (artworkId: string) => {
    if (isFavorite(artworkId)) {
      removeFromFavorites(artworkId);
    } else {
      addToFavorites(artworkId);
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem(FAVORITES_KEY);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  };
};
