import axios from 'axios';
import { PokemonDetails } from '../types/pokemon';

const apiClient = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getPokemonList = async (url: string = '/pokemon?limit=20') => {
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching Pokémon list:', error);
    throw error;
  }
};

export const getPokemonDetails = async (nameOrId: string): Promise<PokemonDetails> => {
  try {
    const response = await apiClient.get(`/pokemon/${nameOrId.toLowerCase()}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for Pokémon "${nameOrId}":`, error);
    throw error;
  }
};