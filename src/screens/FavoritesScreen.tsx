import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FavoritesContext } from '../contexts/FavoritesContext';
import PokemonCard from '../components/PokemonCard';
import { RootStackParamList } from '../navigation/AppNavigator';

const FavoritesScreen = () => {
  const { favorites } = useContext(FavoritesContext);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  if (favorites.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Você ainda não tem Pokémon favoritos.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      renderItem={({ item }) => (
        <PokemonCard
          name={item.name}
          // A URL não está no objeto de detalhes, então a montamos
          url={`https://pokeapi.co/api/v2/pokemon/${item.id}/`}
          onPress={() => navigation.navigate('Details', { pokemonName: item.name })}
        />
      )}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },
  list: {
    padding: 8,
  },
});

export default FavoritesScreen;