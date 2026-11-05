import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { 
  ActivityIndicator,
  StyleSheet, 
  Text,
  View,
 } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootNativeStackScreenProps } from '../../navigation/RootNavigator';

import { useStores } from '../../stores/useStores';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../themes/AppPaperTheme';

import { ToastMessage } from '../../helpers/toastMessage';
import { ApiError } from '../../services/api/errors';
import { FlashList } from '@shopify/flash-list';

type Props = RootNativeStackScreenProps<'manifestDetail'>;

export const ManifestDetailScreen = observer(function ManifestDetailScreen( { navigation, route }: Props) {
  const manifestId = route.params.manifestId;
  const manifestSequenceCode = route.params.sequenceCode;

  const theme = useTheme<AppTheme>();
  
  const { manifestStore } = useStores();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const manifest = manifestStore.selectedManifest;
  const manifestItems = manifest?.allManifestItems;

  useEffect(() => {
    let isActive = true;

    const loadManifest = async () => {
      try {
        await manifestStore.fetchSelectedManifest(manifestId);
      } catch (e) {
        console.log('[ManifestDetail]', e);
        if (!isActive) return;
        const message = e instanceof ApiError ? e.message : 'Erro ao carregar dados do manifesto.'
        
        ToastMessage.error(`Manifest ${manifestSequenceCode}`, message);
        navigation.goBack();
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    loadManifest();
    return () => { isActive = false; };
  }, [manifestStore, manifestSequenceCode, manifestId, navigation])
  
  if (!manifest || isLoading) {
    return (
      <SafeAreaView style={[
        styles.loadingContainer
      ]}>
        <ActivityIndicator color={theme.colors.primary300} />
        <Text style={[
          styles.loadingText,
          { color: theme.colors.primary300 }
        ]}>
          Carregando dados do manifesto
        </Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[
      styles.screenContainer,
      { backgroundColor: theme.colors.background }
    ]}>
      <FlashList 
        data={manifestItems}
        renderItem={({ item }) => (
          <View>
            <Text>
              { item.id } - { item.type }
            </Text>
            <Text>
              { item.recipient?.name }
            </Text>
            <Text>
              { item.sender?.nickname }
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
})

export const styles = StyleSheet.create({
  loadingContainer: {
    width: '100%',
    alignItems: 'center'
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  screenContainer: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    paddingHorizontal: 10,
  }
});