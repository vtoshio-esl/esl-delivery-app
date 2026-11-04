import { observer } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';
import {
  View, 
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { getSnapshot } from 'mobx-state-tree';

import { useStores } from '../../../stores/useStores';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../../themes/AppPaperTheme';
import { styles } from './styles';

import { ManifestCard } from '../../../components/ManifestCard';

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
      styles.manifestsContainer,
      { backgroundColor: theme.colors.background }
    ]}>
      <Text style={{ textAlign: 'center', marginBottom: 5, }}>
        Arraste para baixo para atualizar a lista.
      </Text>
      <FlashList 
        data={manifests}
        keyExtractor={(item) => String(item.id)}
        refreshing={refreshing}
        onRefresh={handleRefreshManifests}
        ListEmptyComponent={
          <View style={[
            styles.noManifestContainer,
            { backgroundColor: theme.colors.background }
          ]}>
            <Text>
              Nenhum manifesto sincronizado no momento.
            </Text>
            <Text>
              Arraste para baixo para atualizar a lista de manifestos.
            </Text>
          </View>
        }
        renderItem={({item}) =>
          <ManifestCard key={item.id} manifest={item} />
        }
      />
    </SafeAreaView>
  );
})