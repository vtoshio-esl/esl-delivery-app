import { observer } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';
import {
  View, 
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { AppDrawerScreenProps } from '../../../navigation/DrawerNavigation';

import { useStores } from '../../../stores/useStores';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../../themes/AppPaperTheme';
import { styles } from './styles';

import { ManifestCard } from '../../../components/ManifestCard';
import { ToastMessage } from '../../../helpers/toastMessage';
import { ManifestCommentsModal } from '../../../components/ManifestCommentsModal';
import { KmKind, ManifestKmModal } from '../../../components/ManifestKmModal';
import { ApiError } from '../../../services/api/errors';
import { Manifest } from '../../../models/Manifest';

type Props = AppDrawerScreenProps<'manifests'>;

type KmTarget = {
  kind: KmKind;
  manifestId: number;
  sequenceCode: number;
}

export const ManifestsScreen = observer(function ManifestsScreen({ navigation }: Props) {
  const theme = useTheme<AppTheme>();
  
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedComments, setSelectedComments] = useState<string | null>(null);
  const [kmTarget, setKmTarget] = useState<KmTarget | null>(null);
  const [modalLabel, setModalLabel] = useState<string>('');

  const { manifestStore } = useStores();
  const manifests = manifestStore.manifests.slice();

  const setKmTargetWithLabel = (kind: KmKind, item: Manifest) => {
    setKmTarget({
      kind: kind,
      manifestId: item.id,
      sequenceCode: item.sequence_code,
    })
    setModalLabel(`Manifesto ${item.sequence_code}`)
  }

  const handleRefreshManifests = useCallback(async () => {
    setRefreshing(true);
    try {
      await manifestStore.syncAvailableManifests();
    } catch (e) {
      console.log('[Manifests] Falha ao sincronizar manifestos:', e);
      const message = e instanceof ApiError ? e.message : 'Falha ao sincronizar manifestos disponíveis.'
      
      ToastMessage.error('Manifestos', message)
    } finally {
      setRefreshing(false);
    }
  }, [manifestStore]);

  const handleManifestCardPress = async (manifestId: number, sequenceCode: number) => {
      navigation.navigate('manifestDetail', { manifestId, sequenceCode })
  }

  const handleConfirmKm = async (km: number) => {
    if (!kmTarget) return;
    const { kind, manifestId, sequenceCode } = kmTarget;

    try {
      if (kind === 'departure') {
        await manifestStore.updateDepartureKm(manifestId, km);
      } else { 
        await manifestStore.updateClosingKm(manifestId, km);
      }

      await handleRefreshManifests();
    } catch (e) {
      const message = e instanceof ApiError ? e.message : 'Erro ao salvar KM.';
      ToastMessage.error(`Manifesto ${sequenceCode}`, message)
    } finally {
      setKmTarget(null);
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

      <ManifestKmModal
        label={modalLabel}
        kind={kmTarget?.kind ?? 'departure'}
        visible={kmTarget !== null}
        onDismiss={() => setKmTarget(null)}
        onConfirm={handleConfirmKm}
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
            manifest={item}
            onPress={() => handleManifestCardPress(item.id, item.sequence_code)} 
            onPressComments={() => setSelectedComments(item.mobile_comments ?? '')}
            onPressDepartureKm={() => setKmTargetWithLabel('departure', item)}
            onPressClosingKm={() => setKmTargetWithLabel('closing', item)}
          />
        }
      />
    </SafeAreaView>
  );
})