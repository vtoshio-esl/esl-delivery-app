import { observer } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';
import {
  View, 
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../../themes/AppPaperTheme';
import { useStores } from '../../../stores/useStores';
import { FlashList } from '@shopify/flash-list';
import { getSnapshot } from 'mobx-state-tree';

export const ManifestsScreen = observer(function ManifestsScreen() {
  const theme = useTheme<AppTheme>();
  const { manifestStore } = useStores();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const manifests = getSnapshot(manifestStore.manifests);

  const handleRefreshManifests = useCallback(async () => {
    setRefreshing(true);
    try {
      await manifestStore.syncAvailableManifests();
    } finally {
      setRefreshing(false);
    }
  }, [manifestStore]);

  return (
    <SafeAreaView style={[
      styles.screenContainer,
      { backgroundColor: theme.colors.background }
    ]}>
      <FlashList 
        data={manifests}
        keyExtractor={(item) => String(item.id)}
        refreshing={refreshing}
        onRefresh={handleRefreshManifests}
        ListEmptyComponent={
          <View style={[
            styles.screenContainer,
            { backgroundColor: theme.colors.background }
          ]}>
            <Text>
              Nenhum manifesto sincronizado no momento.
            </Text>
            <Text>
              Arraste para cima para atualizar a lista de manifestos.
            </Text>
          </View>
        }
        renderItem={({item}) => 
          <View key={item.id}>
            <Text>
              { item.sequence_code } - {item.vehicle_license_plate}
            </Text>
            <Text>
              { item.service_date }
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
})

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
  }
})