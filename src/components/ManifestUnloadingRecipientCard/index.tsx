import React from 'react';
import { 
  TouchableOpacity, 
  TouchableOpacityProps, 
  View,
  Text
} from 'react-native';

import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../themes/AppPaperTheme';
import { styles } from './styles';

import { UnloadingRecipient } from '../../models/ManifestServices/UnloadingRecipient';
import { EslButton } from '../forms/EslButton';
import { LabeledValue } from '../LabeledValue';
import { openMaps } from '../../helpers/openMaps';
import { ToastMessage } from '../../helpers/toastMessage';

export interface ManifestUnloadingRecipientCardProps extends TouchableOpacityProps {
  unloadingRecipient: UnloadingRecipient,
  simplified?: boolean,
  mapsLabel?: string,
  latitude?: string | null | undefined,
  longitude?: string | null | undefined,
}

export function ManifestUnloadingRecipientCard(props: ManifestUnloadingRecipientCardProps) {
  const theme = useTheme<AppTheme>();
  
  const {
    unloadingRecipient,
    simplified = false,
    latitude,
    longitude,
    mapsLabel,
    disabled,
    ...rest
  } = props;
  
  const handleNavigateToRecipient = () => {
    if (!latitude || !longitude) {
      console.log('[UnloadingRecipient::Recipient]', unloadingRecipient.recipient)
      ToastMessage.error(
        `Local de Descarregamento`,
        'Latitude ou longitude em branco. Tente localizar o endereço manualmente.'
      )
      return;
    }

    openMaps({ latitude, longitude, label: mapsLabel ?? 'Destino' })
  }

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.container,
        { backgroundColor: theme.colors.background, borderColor: theme.colors.primary300 },
        disabled && { backgroundColor: theme.colors.backdrop, elevation: 0 },
      ]} 
      {...rest}
    >
      <View style={{ marginBottom: 5 }}>
        <Text 
          style={[
            styles.recipientName,
            { color: theme.colors.primary300 }
          ]}
        >
          { unloadingRecipient.recipient?.nickname }
        </Text>
        
        <Text style={{ color: theme.colors.textSecondary }}>
          { unloadingRecipient.recipient?.main_address.formattedAddress }
        </Text>
      </View>
      
      { !simplified && (
        <View style={[
            styles.footerContainer,
            { borderColor: theme.colors.primary300 }
          ]}>
            <EslButton 
              title='Navegar'
              icon='map'
              fontSize={12}
              disabled={disabled}
              onPress={handleNavigateToRecipient}
              style={{ width: '30%' }}
              lightTitle={true}
            />

            <View style={styles.freightData}>
              <LabeledValue 
                title='Tipo'
                value={'Transf.'}
                fontSize={12}
                style={{ flex: 1 }}
              />
              <LabeledValue 
                title='Qt. Docs'
                value={unloadingRecipient.freights_count}
                fontSize={12}
                style={{ flex: 1 }}
              />
              <LabeledValue 
                title='Qt. NFs'
                value={unloadingRecipient.invoices_count}
                fontSize={12}
                style={{ flex: 1 }}
              />
              <LabeledValue 
                title='Qt. Vol.'
                value={unloadingRecipient.freights_volumes}
                fontSize={12}
                style={{ flex: 1 }}
              />
            </View>
        </View>
      )}
    </TouchableOpacity>
  );
}
