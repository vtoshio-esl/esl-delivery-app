import { observer } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';
import {
  View, 
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { getSnapshot } from 'mobx-state-tree';
import { AppDrawerScreenProps } from '../../../navigation/DrawerNavigation';

import { useStores } from '../../../stores/useStores';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../../themes/AppPaperTheme';
import { styles } from './styles';

import { ManifestCard } from '../../../components/ManifestCard';
import { ToastMessage } from '../../../helpers/toastMessage';
import { ManifestCommentsModal } from '../../../components/ManifestCommentsModal';

type Props = AppDrawerScreenProps<'manifests'>;

export const ManifestsScreen = observer(function ManifestsScreen({ navigation }: Props) {
  const theme = useTheme<AppTheme>();
  
  const { manifestStore } = useStores();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedComments, setSelectedComments] = useState<string | null>(null);

  const manifests = getSnapshot(manifestStore.manifests);

  const handleRefreshManifests = useCallback(async () => {
    setRefreshing(true);
    try {
      await manifestStore.syncAvailableManifests();
    } finally {
      setRefreshing(false);
    }
  }, [manifestStore]);

  const handleManifestCardPress = async (manifestId: number, sequenceCode: number) => {
    try {
      navigation.navigate('manifestDetail', { manifestId, sequenceCode })
    } catch {
      ToastMessage.error(
        'Manifesto',
        `Erro ao exibir o Manifesto ${sequenceCode}.`
      )
    }
  }

  return (
    <SafeAreaView style={[
      styles.manifestsContainer,
      { backgroundColor: theme.colors.background }
    ]}>
      <ManifestCommentsModal 
        comments={selectedComments}
        visible={selectedComments !== null}
        onDismiss={() => setSelectedComments(null)}
      />

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
          <ManifestCard 
            key={item.id} 
            manifest={item}
            onPress={() => handleManifestCardPress(item.id, item.sequence_code)} 
            onPressComments={() => setSelectedComments(item.mobile_comments ?? '')}
          />
        }
      />
    </SafeAreaView>
  );
})