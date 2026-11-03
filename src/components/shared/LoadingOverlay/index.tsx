import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { ActivityIndicator, Text } from 'react-native-paper';

import { styles } from './styles';
import { useStores } from '../../../stores/useStores';

export const LoadingOverlay = observer(function LoadingOverlay() {
  const { uiStore } = useStores();

  if (!uiStore.isLoading) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        <ActivityIndicator size='large' />
        <Text style={styles.text}>Carregando...</Text>
      </View>
    </View>
  );
});
