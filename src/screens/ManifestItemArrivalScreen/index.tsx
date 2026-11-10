import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';

import { RootNativeStackScreenProps } from '../../navigation/RootNavigator';
import { useStores } from '../../stores/useStores';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../themes/AppPaperTheme';
import { ManifestItemCard } from '../../components/ManifestItemCard';
import { EslButton } from '../../components/shared/EslButton';
import { ApiError } from '../../services/api/errors';
import { ToastMessage } from '../../helpers/toastMessage';

type Props = RootNativeStackScreenProps<'manifestItemArrival'>;

export const ManifestItemArrivalScreen = observer(function ManifestItemArrivalScreen({route, navigation}: Props) {
  const { manifestId, manifestSequenceCode, itemId } = route.params;
  
  const theme = useTheme<AppTheme>();
  const { manifestStore } = useStores()
  
  const item = manifestStore.selectedManifest?.getManifestItemById(itemId);

  const handleConfirmArrival = async () => {
    try {
      await manifestStore.confirmArrival(manifestId, "2026-11-10 14:30:00" , [itemId])
      
      ToastMessage.info(`Manifesto ${manifestSequenceCode}`, 'Chegada confirmada com sucesso!')
      // [TODO] Incluir navigate para a tela de dados da baixa
    } catch (e) {
      const message = (e instanceof ApiError) ? e.message : 'Erro ao confirmar chegada.' 
      ToastMessage.error(`Manifesto ${manifestSequenceCode}`, message);
    }
  }

  if (!item) {
    navigation.goBack();
    return;
  }
    
  return (
    <SafeAreaView style={[
      styles.arrivalView,
      { backgroundColor: theme.colors.background }
    ]}>
      <View style={{ flex: 1}}>
        <ManifestItemCard 
          manifestItem={item}
          documentNumber={item?.freight?.documentNumber}
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
  }
})