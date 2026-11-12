import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';

import { RootNativeStackScreenProps } from '../../navigation/RootNavigator';
import { useStores } from '../../stores/useStores';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../themes/AppPaperTheme';

import { EslButton } from '../../components/shared/EslButton';
import { ApiError } from '../../services/api/errors';
import { ToastMessage } from '../../helpers/toastMessage';
import { ManifestServiceCard } from '../../components/ManifestServiceCard';

type Props = RootNativeStackScreenProps<'manifestItemArrival'>;

export const ManifestItemArrivalScreen = observer(function ManifestItemArrivalScreen({route, navigation}: Props) {
  const { manifestId, manifestSequenceCode, itemId, itemKind } = route.params;
  
  const theme = useTheme<AppTheme>();
  const { manifestStore } = useStores()
  
  const item = manifestStore.selectedManifest?.getServiceById(itemId, itemKind);

  const handleConfirmArrival = async () => {
    if (!item) {
      ToastMessage.error(
        `Serviço ${itemId}`, 
        'Serviço não foi encontrado para confirmar chegada.'
      );
      return;
    }

    try {
      await manifestStore.confirmArrival(manifestId, new Date().toISOString(), [item])
      
      // [TODO] Incluir navigate para a tela de dados da baixa
      ToastMessage.info(`Manifesto ${manifestSequenceCode}`, 'Chegada confirmada com sucesso!')
    } catch (e) {
      console.log('[ManifestItemArrivalScreen] Erro: ', e)
      const message = (e instanceof ApiError) ? e.message : 'Erro ao confirmar chegada.' 
      ToastMessage.error(`Manifesto ${manifestSequenceCode}`, message);
    }
  }

  useEffect(() => {
    if (!item) navigation.goBack();
  }, [item, navigation])
    
  if (!item) return null;

  return (
    <SafeAreaView style={[
      styles.arrivalView,
      { backgroundColor: theme.colors.background }
    ]}>
      <View style={{ flex: 1}}>
        <ManifestServiceCard service={item} />
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
  }
})