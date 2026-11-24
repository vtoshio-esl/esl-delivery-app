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
  fontSize?: number,
  titleFontSize?: number,
  latitude?: string | null | undefined,
  longitude?: string | null | undefined,
  errors?: string[],
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
    fontSize = simplified ? 12 : 14,
    titleFontSize = simplified ? 16 : 18,
    errors = [],
    ...rest
  } = props;

  const iconSize = simplified ? 25 : 30;

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
              <Text style={{ fontSize }}>
                { manifestItem.freight?.documentNumber }
              </Text>
            }

            { manifestItem.pick && 
              <Text style={{ fontSize }}>
                { manifestItem.pick?.sequence_code }
              </Text>
            }
            <Text 
              style={[
                styles.recipientName,
                { color: theme.colors.primary300, fontSize: titleFontSize },
              ]}
            >
              { manifestItem.recipient?.nickname }
            </Text>
          </View>
          
          
          <View style={{ flexDirection: 'row', gap: 5 }}>
            { manifestItem.hasToConfirmExit && (
                <Lucide 
                  name='door-open' 
                  color={theme.colors.danger} 
                  size={30} 
                />
            )}

            { (manifestItem.hasOccurrence)
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
        </View>
        
        { manifestItem.recipient?.phone_number && (
          <View style={styles.phoneNumberContainer}>
            <Lucide name='phone' size={fontSize + 2} color={theme.colors.primary200} />
            <Text style={{ 
              color: theme.colors.textSecondary, fontSize 
            }}>
              { manifestItem.recipient.phone_number }
            </Text>
          </View>
        ) }

        { manifestItem.sender && (
          <View style={styles.recipientDataContainer}>
            <Text style={{ color: theme.colors.primary200, fontSize }}>
              Remetente:
            </Text>

            <Text style ={{ color: theme.colors.textSecondary, fontSize }}>
              { manifestItem.sender?.name }
            </Text>
          </View>
        )}
        
        { manifestItem.destination_address ? (
          <Text style={{ color: theme.colors.textSecondary, fontSize }}>
            { manifestItem.destination_address?.formattedAddress }
          </Text>
        ) : (
          <Text style={{ color: theme.colors.textSecondary, fontSize }}>
            { manifestItem.recipient?.main_address.formattedAddress }
          </Text>
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
          { borderColor: theme.colors.primary300 },
          (errors.length > 0) && { paddingBottom: 10, }
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
