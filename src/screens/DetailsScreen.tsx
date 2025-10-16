import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getPokemonDetails } from '../api/pokeapi';
import { PokemonDetails } from '../types/pokemon';
import { FavoritesContext } from '../contexts/FavoritesContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import axios from 'axios';
import typeColors from '../utils/typeColors';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

const DetailsScreen = () => {
  const route = useRoute<DetailsScreenRouteProp>();
  const { pokemonName } = route.params;
  
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [abilitiesPT, setAbilitiesPT] = useState<string[]>([]);

  const { addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const details = await getPokemonDetails(pokemonName);
        setPokemon(details);
        // Buscar habilidades em português
        const abilities = await Promise.all(
          details.abilities.map(async ({ ability }) => {
            try {
              const res = await axios.get(ability.url);
              const ptEntry = res.data.names.find((n: any) => n.language.name === 'pt');
              return ptEntry ? ptEntry.name : ability.name;
            } catch {
              return ability.name;
            }
          })
        );
        setAbilitiesPT(abilities);
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

  const mainType = pokemon.types[0]?.type.name;
  const bgColor = typeColors[mainType] || '#fff';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}> 
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
      <View style={styles.abilitiesContainer}>
        {abilitiesPT.map((name, idx) => (
          <View key={name + idx} style={styles.abilityBox}>
            <Text style={styles.abilityText}>{name}</Text>
          </View>
        ))}
      </View>
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
  abilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  abilityBox: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    margin: 5,
    alignItems: 'center',
  },
  abilityText: {
    fontSize: 16,
    textTransform: 'capitalize',
    color: '#333',
    fontWeight: 'bold',
  },
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