import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface PokemonCardProps {
  name: string;
  url: string;
  onPress: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ name, url, onPress }) => {
  const pokemonId = url.split('/')[url.split('/').length - 2];
  
  const officialImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
  
  // URL de Fallback: Sprite padrão
  const defaultImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

  const [imageUrl, setImageUrl] = useState(officialImageUrl);

  const handleImageError = () => {
    // Se a URL atual for a principal, mude para a de fallback.
    if (imageUrl === officialImageUrl) {
      setImageUrl(defaultImageUrl);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.image} 
        onError={handleImageError} // Adicionamos o manipulador de erro aqui
      />
      <Text style={styles.name}>{name.charAt(0).toUpperCase() + name.slice(1)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
  },
  name: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PokemonCard;