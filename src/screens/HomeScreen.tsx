import React, { useState, useEffect } from 'react';
import { View, FlatList, Button, StyleSheet, ActivityIndicator, Text, TextInput } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { getPokemonList } from '../api/pokeapi';
import { PokemonListItem } from '../types/pokemon';
import PokemonCard from '../components/PokemonCard';
import { RootStackParamList } from '../navigation/AppNavigator';

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPokemons = async (url?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPokemonList(url);
      setPokemonList((prevList) => url ? [...prevList, ...data.results] : data.results);
      setNextUrl(data.next);
    } catch (err) {
      setError('Falha ao carregar os Pokémon. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  const handleLoadMore = () => {
    if (nextUrl && !loading) {
      fetchPokemons(nextUrl);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Details', { pokemonName: searchQuery.trim() });
    }
  };

  if (loading && pokemonList.length === 0) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.centered} />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Tentar Novamente" onPress={() => fetchPokemons()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome ou número"
            value={searchQuery}
            onChangeText={setSearchQuery}
        />
        <Button title="Buscar" onPress={handleSearch} />
      </View>
       <Button title="Ver Favoritos" onPress={() => navigation.navigate('Favorites')} />
      <FlatList
        data={pokemonList}
        keyExtractor={(item) => item.name}
        numColumns={2}
        renderItem={({ item }) => (
          <PokemonCard
            name={item.name}
            url={item.url}
            onPress={() => navigation.navigate('Details', { pokemonName: item.name })}
          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    paddingHorizontal: 8,
  },
  list: { padding: 8 },
  errorText: { color: 'red', marginBottom: 10 }
});

export default HomeScreen;