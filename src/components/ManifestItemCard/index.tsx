import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  TouchableOpacityProps, 
  View,
  Text
} from 'react-native';

import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../themes/AppPaperTheme';
import { styles } from './styles';

import { ManifestItem } from '../../models/ManifestItem';
import { EslButton } from '../shared/EslButton';
import { LabeledValue } from '../LabeledValue';
import { openMaps } from '../../helpers/openMaps';
import { ToastMessage } from '../../helpers/toastMessage';

export interface ManifestItemCardProps extends TouchableOpacityProps {
  manifestItem: ManifestItem,
  documentNumber: string | undefined,
  mapsLabel?: string,
  latitude?: string | null | undefined,
  longitude?: string | null | undefined,
}

export function ManifestItemCard(props: ManifestItemCardProps) {
  const theme = useTheme<AppTheme>();
  
  const {
    manifestItem,
    latitude,
    longitude,
    mapsLabel,
    documentNumber,
    ...rest
  } = props;
  
  const handleNavigateToRecipient = () => {
    if (!latitude || !longitude) {
      console.log('[ManifestItem::Recipient]', manifestItem.recipient)
      ToastMessage.error(
        `Serviço ${documentNumber}`,
        'Latitude ou longitude em branco. Tente localizar o endereço manualmente.'
      )
      return;
    }

    openMaps({ latitude, longitude, label: mapsLabel ?? 'Destinatário' })
  }

  return (
    <TouchableOpacity style={[
      styles.container,
      { backgroundColor: theme.colors.background, borderColor: theme.colors.primary300 }
    ]} {...rest}>
      <View style={{ marginBottom: 5 }}>
        <Text>
          { manifestItem.freight?.documentNumber }
        </Text>
        <Text 
          style={[
            styles.recipientName,
            { color: theme.colors.primary300 }
          ]}
        >
          { manifestItem.recipient?.nickname }
        </Text>
        
        <View style={styles.recipientDataContainer}>
          <Text style={{ color: theme.colors.primary200 }}>
            Remetente:
          </Text>

          <Text style ={{ color: theme.colors.textSecondary }}>
            { manifestItem.sender?.name }
          </Text>
        </View>
        
        <Text style={{ color: theme.colors.textSecondary }}>
          { manifestItem.deliveryAddress?.formattedAddress }
        </Text>
      </View>
      
      <View style={[
        styles.footerContainer,
        { borderColor: theme.colors.primary300 }
      ]}>
        <EslButton 
          title='Navegar'
          icon='map'
          fontSize={12}
          onPress={handleNavigateToRecipient}
          style={{ width: '30%' }}
          lightTitle={true}
        />

        <View style={styles.freightData}>
          <LabeledValue 
            title='Tipo'
            value={manifestItem.typeLabel}
            fontSize={12}
            style={{ flex: 1 }}
          />
          <LabeledValue
            title='Vol'
            value={manifestItem.freight?.invoices_volumes}
            fontSize={12}
            style={{ flex: 1 }}
          />
          <LabeledValue 
            title='NFs'
            value={manifestItem.freight?.allInvoicesListed}
            fontSize={12}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
