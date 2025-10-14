import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

export type RootStackParamList = {
  Home: undefined;
  Details: { pokemonName: string };
  Favorites: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#009dffff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Pokédex Explorer' }} 
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen} 
        options={({ route }) => ({ title: route.params.pokemonName.charAt(0).toUpperCase() + route.params.pokemonName.slice(1)})} 
      />
      <Stack.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{ title: 'Meus Favoritos' }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;