import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppContainer from "./routes";
export default function App() {
  
  return (
      <PaperProvider>
        <AppContainer/>
      </PaperProvider>
  );
}

