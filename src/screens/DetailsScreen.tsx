import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Button, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getPokemonDetails } from '../api/pokeapi';
import { PokemonDetails } from '../types/pokemon';
import { FavoritesContext } from '../contexts/FavoritesContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

const DetailsScreen = () => {
  const route = useRoute<DetailsScreenRouteProp>();
  const { pokemonName } = route.params;
  
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const details = await getPokemonDetails(pokemonName);
        setPokemon(details);
      } catch (err) {
        setError(`Pokémon "${pokemonName}" não encontrado.`);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [pokemonName]);

  const handleFavoritePress = () => {
    if (!pokemon) return;

    if (isFavorite(pokemon.id)) {
      removeFavorite(pokemon.id);
    } else {
      addFavorite(pokemon);
    }
  };


  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.centered} />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!pokemon) {
    return null;
  }

  const favorite = isFavorite(pokemon.id);

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: pokemon.sprites.other['official-artwork'].front_default }} 
        style={styles.image} 
      />
      <Text style={styles.name}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
      <Text style={styles.pokedexNumber}>#{String(pokemon.id).padStart(3, '0')}</Text>
      
      <View style={styles.typesContainer}>
        {pokemon.types.map(({ type }) => (
          <Text key={type.name} style={styles.type}>{type.name}</Text>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Habilidades</Text>
      {pokemon.abilities.map(({ ability }) => (
        <Text key={ability.name} style={styles.ability}>- {ability.name}</Text>
      ))}

      <TouchableOpacity onPress={handleFavoritePress} style={[styles.favoriteButton, {backgroundColor: favorite ? '#FFD700' : '#d3d3d3'}]}>
        <Text style={styles.favoriteButtonText}>{favorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  image: { width: 250, height: 250 },
  name: { fontSize: 28, fontWeight: 'bold', marginTop: 16 },
  pokedexNumber: { fontSize: 20, color: 'gray', marginBottom: 10 },
  typesContainer: { flexDirection: 'row', marginBottom: 20 },
  type: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginHorizontal: 5,
    fontSize: 16,
    textTransform: 'capitalize',
  },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
  ability: { fontSize: 18, textTransform: 'capitalize' },
  errorText: { color: 'red', fontSize: 18 },
  favoriteButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  favoriteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default DetailsScreen;