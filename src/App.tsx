import React from 'react';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';

import { 
  initialWindowMetrics, 
  SafeAreaProvider 
} from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AppNativeStackNavigator } from './navigation/RootNavigator';
import { PaperProvider } from 'react-native-paper';
import { AppPaperTheme } from './themes/AppPaperTheme';

import { RootStoreProvider, useInitialRootStore } from './stores/useStores';

export function App() {
  const { rootStore, rehydrated } = useInitialRootStore();

  // [TODO] Adicionar splash screen
  if (!rehydrated) return null;

  return (
    <RootStoreProvider value={rootStore}> 
      <PaperProvider theme={AppPaperTheme}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <NavigationContainer>
            <AppNativeStackNavigator />
          </NavigationContainer>

          <Toast/>
          <StatusBar style='auto' />
        </SafeAreaProvider>
      </PaperProvider>
    </RootStoreProvider>
  );
}