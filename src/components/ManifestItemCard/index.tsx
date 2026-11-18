import React from 'react';
import { 
  TouchableOpacity, 
  TouchableOpacityProps, 
  View,
  Text,
} from 'react-native';
import Lucide from '@react-native-vector-icons/lucide';

import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../themes/AppPaperTheme';
import { styles } from './styles';

import { ManifestItem } from '../../models/ManifestServices/ManifestItem';
import { LabeledValue } from '../LabeledValue';
import { openMaps } from '../../helpers/openMaps';
import { ToastMessage } from '../../helpers/toastMessage';
import { EslButton } from '../forms/EslButton';

export interface ManifestItemCardProps extends TouchableOpacityProps {
  manifestItem: ManifestItem,
  documentNumber?: string | undefined,
  simplified?: boolean,
  showNavigate?: boolean,
  mapsLabel?: string,
  latitude?: string | null | undefined,
  longitude?: string | null | undefined,
}

export function ManifestItemCard(props: ManifestItemCardProps) {
  const theme = useTheme<AppTheme>();
  
  const {
    manifestItem,
    simplified = false,
    showNavigate = false,
    latitude,
    longitude,
    mapsLabel,
    documentNumber,
    disabled,
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
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.container,
        { backgroundColor: theme.colors.background, borderColor: theme.colors.primary300 },
        disabled && { backgroundColor: theme.colors.backdrop, elevation: 0 },
      ]} 
      {...rest}
    >
      <View style={styles.cardHeader}>
        <View style={styles.manifestItemTitleContainer}>
          <View style={styles.itemRecipientDataContainer}>
            { manifestItem.freight && 
              <Text>
                { manifestItem.freight?.documentNumber }
              </Text>
            }

            { manifestItem.pick && 
              <Text>
                { manifestItem.pick?.sequence_code }
              </Text>
            }
            <Text 
              style={[
                styles.recipientName,
                { color: theme.colors.primary300 }
              ]}
            >
              { manifestItem.recipient?.nickname }
            </Text>
          </View>
          
          
          { (manifestItem.hasOccurrence)
            ? <Lucide 
                name='package-check' 
                color={theme.colors.success} 
                size={30} 
              />
            : <Lucide 
                name='package' 
                color={theme.colors.gray400} 
                size={30}
              />
          }
        </View>
        
        { manifestItem.recipient?.phone_number && (
          <View style={styles.phoneNumberContainer}>
            <Lucide name='phone' size={14} color={theme.colors.primary200} />
            <Text style={{ color: theme.colors.textSecondary }}>
              { manifestItem.recipient.phone_number }
            </Text>
          </View>
        ) }

        { manifestItem.sender && (
          <View style={styles.recipientDataContainer}>
            <Text style={{ color: theme.colors.primary200 }}>
              Remetente:
            </Text>

            <Text style ={{ color: theme.colors.textSecondary }}>
              { manifestItem.sender?.name }
            </Text>
          </View>
        )}
        
        { manifestItem.destination_address ? (
          <Text style={{ color: theme.colors.textSecondary }}>
            { manifestItem.destination_address?.formattedAddress }
          </Text>
        ) : (
          <Text style={{ color: theme.colors.textSecondary }}>
            { manifestItem.recipient?.main_address.formattedAddress }
          </Text>
        )}


        { manifestItem.hasOccurrence && !manifestItem.hasExited && (
          <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Lucide name='triangle-alert' size={16} color={theme.colors.danger} />
            <Text style={{ fontSize: 14, color: theme.colors.danger }}>
              Confirmar Saída
            </Text>
          </View>
        )}
      </View>

      { manifestItem.pick && !simplified && (
        <View style={[
          styles.pickDataContainer,
          { borderColor: theme.colors.primary300 }
        ]}>
          <LabeledValue 
            title='Agendado'
            value={manifestItem.pick.serviceDateFormatted}
            titleColor={theme.colors.primary300}
            style={{ flex: 1 }}
          />
          <LabeledValue 
            title='Coletar entre'
            value={manifestItem.pick.pickAtInterval}
            titleColor={theme.colors.primary300}
            style={{ flex: 1 }}
          />
          <LabeledValue 
            title='Almoço'
            value={manifestItem.pick.lunchAtInterval}
            titleColor={theme.colors.primary300}
            style={{ flex: 1 }}
          />
        </View>
      )}
      
      { !simplified && (
        <View style={[
          styles.footerContainer,
          { borderColor: theme.colors.primary300 }
        ]}>
          { showNavigate && (
            <EslButton 
              title='Navegar'
              icon='map'
              lightTitle
              fontSize={12}
              style={{ width: '33%' }}
              onPress={handleNavigateToRecipient}
            />
          )}

          <View style={styles.freightData}>
            <LabeledValue 
              title='Tipo'
              value={manifestItem.typeLabel}
              fontSize={12}
              style={{ flex: 1 }}
            />

            { manifestItem.freight && (
              <>
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
              </>
            )}

            { manifestItem.pick && (
              <>
                <LabeledValue
                  title='Vol'
                  value={manifestItem.pick?.invoices_volumes}
                  fontSize={12}
                  style={{ flex: 1 }}
                />
              </>
            )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}
