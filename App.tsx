import 'react-native-gesture-handler'; // Importe no topo
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { FavoritesProvider } from './src/contexts/FavoritesContext';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <AppNavigator />
      </NavigationContainer>
    </FavoritesProvider>
  );
}

