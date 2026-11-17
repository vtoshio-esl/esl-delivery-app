import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';

import { RootNativeStackScreenProps } from '../../navigation/RootNavigator';
import { useStores } from '../../stores/useStores';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../themes/AppPaperTheme';

import { EslButton } from '../../components/forms/EslButton';
import { ApiError } from '../../services/api/errors';
import { ToastMessage } from '../../helpers/toastMessage';
import { ManifestServiceCard } from '../../components/ManifestServiceCard';
import { FlashList } from '@shopify/flash-list';

type Props = RootNativeStackScreenProps<'manifestItemArrival'>;

export const ManifestItemArrivalScreen = observer(function ManifestItemArrivalScreen({route, navigation}: Props) {
  const { manifestId, manifestSequenceCode, itemId } = route.params;
  
  const theme = useTheme<AppTheme>();
  const { manifestStore, deliveryDraftStore } = useStores()
  
  // [TODO] Refatorar depois para baixa multipla
  const items = deliveryDraftStore.getSelectedServices;

  const handleConfirmArrival = async () => {
    if (!items || items.length === 0) {
      ToastMessage.error(
        `Serviço ${itemId}`, 
        'Serviços não foram encontrados para confirmar chegada.'
      );
      return;
    }

    try {
      const arrivalDate = new Date().toISOString();
      
      items.forEach(async (item) => {
        await manifestStore.confirmArrival(manifestId, arrivalDate, [item])
      })
      
      // [TODO] Incluir navigate para a tela de dados da baixa
      ToastMessage.info(`Manifesto ${manifestSequenceCode}`, 'Chegada confirmada com sucesso!')
    } catch (e) {
      console.log('[ManifestItemArrivalScreen] Erro: ', e)
      const message = (e instanceof ApiError) ? e.message : 'Erro ao confirmar chegada.' 
      ToastMessage.error(`Manifesto ${manifestSequenceCode}`, message);
    }
  }

  useEffect(() => {
    if (!items || items.length === 0) navigation.goBack();
  }, [items, navigation])
    
  if (!items || items.length === 0) return null;

  return (
    <SafeAreaView style={[
      styles.arrivalView,
      { backgroundColor: theme.colors.background }
    ]}>
      <View style={{ flex: 1 }}>
        <View style={styles.counterView}>
          <Text style={[
            styles.counterTitle,
            { color: theme.colors.primary300 }
          ]}>
            Serviços selecionados:
          </Text>
          <Text>
            { deliveryDraftStore.countSelectedServices } itens
          </Text>
        </View>
        <FlashList 
          data={items}
          keyExtractor={(item) => `${item.kind}:${item.id}`}
          renderItem={({ item }) => (
            <ManifestServiceCard service={item}/>
          )}
        />
      </View>

      <EslButton 
        title='Confirmar Chegada'
        icon='map-pinned'
        lightTitle
        style={{ marginBottom: 20 }}
        onPress={handleConfirmArrival}
      />
    </SafeAreaView>
  );
})

export const styles = StyleSheet.create({
  arrivalView: {
    flex: 1,
    paddingHorizontal: 10,
  },
  counterView: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 5,
    gap: 5
  },
  counterTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  }
})