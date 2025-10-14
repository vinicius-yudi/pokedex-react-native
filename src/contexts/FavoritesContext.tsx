import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { PokemonDetails } from '../types/pokemon';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesContextData {
  favorites: PokemonDetails[];
  addFavorite: (pokemon: PokemonDetails) => void;
  removeFavorite: (pokemonId: number) => void;
  isFavorite: (pokemonId: number) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextData>({} as FavoritesContextData);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<PokemonDetails[]>([]);

  // Carrega os favoritos do armazenamento local ao iniciar
  useEffect(() => {
    const loadFavorites = async () => {
      const storedFavorites = await AsyncStorage.getItem('@pokedex_favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    };
    loadFavorites();
  }, []);

  // Salva os favoritos no armazenamento local sempre que a lista muda
  useEffect(() => {
    AsyncStorage.setItem('@pokedex_favorites', JSON.stringify(favorites));
  }, [favorites]);


  const addFavorite = (pokemon: PokemonDetails) => {
    setFavorites((prevFavorites) => [...prevFavorites, pokemon]);
  };

  const removeFavorite = (pokemonId: number) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((pokemon) => pokemon.id !== pokemonId)
    );
  };

  const isFavorite = (pokemonId: number) => {
    return favorites.some((pokemon) => pokemon.id === pokemonId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};