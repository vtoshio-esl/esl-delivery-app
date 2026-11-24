import React from 'react';
import { 
  TouchableOpacity, 
  TouchableOpacityProps, 
  View,
  Text
} from 'react-native';
import Lucide from '@react-native-vector-icons/lucide';

import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../themes/AppPaperTheme';
import { styles } from './styles';

import { UnloadingRecipient } from '../../models/ManifestServices/UnloadingRecipient';
import { LabeledValue } from '../LabeledValue';
import { openMaps } from '../../helpers/openMaps';
import { ToastMessage } from '../../helpers/toastMessage';
import { EslButton } from '../forms/EslButton';

export interface ManifestUnloadingRecipientCardProps extends TouchableOpacityProps {
  unloadingRecipient: UnloadingRecipient;
  simplified?: boolean;
  showNavigate?: boolean;
  mapsLabel?: string;
  latitude?: string | null | undefined;
  longitude?: string | null | undefined;
  fontSize?: number;
  titleFontSize?: number;
  errors?: string[];
}

export function ManifestUnloadingRecipientCard(props: ManifestUnloadingRecipientCardProps) {
  const theme = useTheme<AppTheme>();
  
  const {
    unloadingRecipient,
    simplified = false,
    showNavigate = false,
    latitude,
    longitude,
    mapsLabel,
    disabled,
    fontSize = simplified ? 12 : 14,
    titleFontSize = simplified ? 16 : 18,
    errors = [],
    ...rest
  } = props;
  
  const iconSize = simplified ? 25 : 30;

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
        <View style={styles.recipientDataContainer}>
          <Text 
            style={[
              styles.recipientName,
              { color: theme.colors.primary300, fontSize: titleFontSize }
            ]}
          >
            { unloadingRecipient.recipient?.nickname }
          </Text>

          { (unloadingRecipient.hasOccurrence)
            ? <Lucide 
                name='package-check' 
                color={theme.colors.success} 
                size={iconSize} 
              />
            : <Lucide 
                name='package' 
                color={theme.colors.gray400} 
                size={iconSize}
              />
          }
        </View>
        
        <Text style={{ color: theme.colors.textSecondary, fontSize }}>
          { unloadingRecipient.recipient?.main_address.formattedAddress }
        </Text>
      </View>
      
      { !simplified && (
        <View style={[
            styles.footerContainer,
            { borderColor: theme.colors.primary300 },
            (errors.length > 0) && { paddingBottom: 10, }
          ]}>
            { showNavigate && (
              <EslButton 
                title='Navegar'
                icon='map'
                lightTitle
                fontSize={fontSize - 2}
                style={{ width: '33%' }}
                onPress={handleNavigateToRecipient}
              />
            )}
            <View style={styles.freightData}>
              <LabeledValue 
                title='Tipo'
                value={'Transf.'}
                fontSize={fontSize - 2}
                style={{ flex: 1 }}
              />
              <LabeledValue 
                title='Qt. Docs'
                value={unloadingRecipient.freights_count}
                fontSize={fontSize - 2}
                style={{ flex: 1 }}
              />
              <LabeledValue 
                title='Qt. NFs'
                value={unloadingRecipient.invoices_count}
                fontSize={fontSize - 2}
                style={{ flex: 1 }}
              />
              <LabeledValue 
                title='Qt. Vol.'
                value={unloadingRecipient.freights_volumes}
                fontSize={fontSize - 2}
                style={{ flex: 1 }}
              />
            </View>
        </View>
      )}

      { errors.length > 0 && (
        <View style={[
          styles.warningsSectionContainer,
          { borderColor: theme.colors.primary300 }
        ]}>
            { errors.map((message, index) => (
              <View 
                key={`${message}:${index}`}
                style={styles.warning}
              >
                <Lucide name='circle-alert' size={fontSize + 2} color={theme.colors.warning} />
                <Text style={
                  { color: theme.colors.warning, fontSize }
                }>
                  { message }
                </Text>
              </View>
            ))}
        </View>
      )}
    </TouchableOpacity>
  );
}
