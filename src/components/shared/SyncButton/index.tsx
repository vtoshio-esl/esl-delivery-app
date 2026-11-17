import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import Lucide from '@react-native-vector-icons/lucide';
import { observer } from 'mobx-react-lite';

import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../../themes/AppPaperTheme';
import { useStores } from '../../../stores/useStores';

export const SyncButton = observer(() => {
  const theme = useTheme<AppTheme>();
  const { syncStore } = useStores();

  return (
    <TouchableOpacity
      onPress={syncStore.openModal}
      accessibilityLabel='Fila de Sincronização'
      style={[
        styles.buttonContainer,
      ]}
    >
      { syncStore.isProcessing 
        ? <ActivityIndicator size='small' color={theme.colors.warning}/> 
        : <Lucide name='refresh-cw' size={30} color={theme.colors.warning} />
      }
    </TouchableOpacity>
  );
})

export const styles = StyleSheet.create({
  buttonContainer: {
    padding: 5,
    marginHorizontal: 20
  }
})