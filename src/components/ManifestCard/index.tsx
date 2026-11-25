import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  TouchableOpacityProps, 
  View 
} from 'react-native';
import Lucide from '@react-native-vector-icons/lucide';

import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../themes/AppPaperTheme';
import { styles } from './styles';

import { Manifest } from '../../models/Manifest';
import { SyncProgressBar } from '../shared/SyncProgressBar';
import { LabeledValue } from '../LabeledValue';
import { EslButton } from '../forms/EslButton';
import { EslValueLabeledButton } from '../forms/EslValueLabeledButton';
import { observer } from 'mobx-react-lite';

export interface ManifestCardProps extends TouchableOpacityProps {
  manifest: Manifest,
  onPressComments?: () => void;
  onPressDepartureKm?: () => void;
  onPressClosingKm?: () => void;
}

export const ManifestCard = observer((props: ManifestCardProps) => {
  const theme = useTheme<AppTheme>();
  
  const { 
    manifest,
    onPressComments,
    onPressDepartureKm,
    onPressClosingKm,
    ...rest 
  } = props;

  const syncPercentage = manifest.manifest_items_count > 0 ?
    1 - manifest.pending_items_count / manifest.manifest_items_count
    : 0

  const renderMobileDate = (date: string, title: string) => (
    <View style={[
      styles.mobileDateContainer,
      { backgroundColor: theme.colors.successLight, borderColor: theme.colors.success }
    ]} >
      <Text style={[
        styles.mobileDateTitleText,
        { color: theme.colors.success }
      ]}>
        { title }
      </Text>
      <Text style={{ color: theme.colors.success }}>
        { date }
      </Text>
    </View>
  );

  const renderManifestData = (title: string, data: string | number) => (
    <LabeledValue 
      title={title}
      value={data}
      style={{ width: '33.33%' }}
    />
  );

  return (
    <TouchableOpacity style={[
      styles.cardContainer,
      { backgroundColor: theme.colors.background, borderColor: theme.colors.primary300 }
    ]} 
    {...rest}
    >
      <View style={styles.manifestCardHeaderContainer}>
        <View style={styles.manifestTitleContainer}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: theme.colors.primary100, borderColor: theme.colors.primary300 }
          ]}>
            <Lucide name='truck' size={30} color={theme.colors.primary300} />
          </View>

          <View>
            <Text style={[
              styles.titleText,
              { color: theme.colors.primary300 }
            ]}>
              Manifesto {manifest.sequence_code}
            </Text>
            <Text style={styles.secondaryText}>
              Veículo { manifest.vehicle_license_plate }
            </Text>
            <Text style={styles.secondaryText}>
              { manifest.getServiceDate }
            </Text>
          </View>
        </View>
        { (manifest.mobile_accepted_at || manifest.departured_at) && (  
          <View style={styles.mobileDatesContainer}>
            { manifest.mobile_accepted_at && renderMobileDate(manifest.getMobileAcceptedAt, 'Data de Aceite') }
            { manifest.departured_at && renderMobileDate(manifest.getDeparturedAt, 'Data de Saída')}
          </View>
        )}
      </View>

        
      <View style={styles.volumesContainer}>
        { renderManifestData('Serviços', manifest.manifest_items_count) }
        { renderManifestData('Volumes', manifest.invoices_volumes)}
        { renderManifestData('Peso', manifest.invoices_weight) }
      </View>

      <View style={styles.manifestItemsContainer}>
        { manifest.delivery_manifest_items_count !== 0 && renderManifestData('Entregas', manifest.delivery_manifest_items_count) }
        { manifest.transferCount() !== 0 && renderManifestData('Transferências', manifest.transferCount()) }
        { manifest.pick_manifest_items_count !== 0 && renderManifestData('Coletas', manifest.pick_manifest_items_count) }
        { manifest.reverse_pick_manifest_items_count !== 0 && renderManifestData('Coletas Reversas', manifest.reverse_pick_manifest_items_count) }
        { manifest.scheduling_operation_manifest_items_count !== 0 && renderManifestData('Programações', manifest.scheduling_operation_manifest_items_count)}
        { manifest.consolidation_manifest_items_count !== 0 && renderManifestData('Consolidações', manifest.consolidation_manifest_items_count)}
      </View>

      <View style={[
        styles.progressData,
        { borderColor: theme.colors.primary300 }
      ]}>
        <SyncProgressBar progress={manifest.finishedRatio()} />
        { manifest.status === 'in_transit' && (
          <EslValueLabeledButton 
            title='KM Inicial'
            value={manifest.vehicle_departure_km}
            onPress={onPressDepartureKm}
            disabled={manifest.vehicle_departure_km !== 0}
          />
        )}
        { syncPercentage === 1 && (
          <EslValueLabeledButton 
            title='KM Final' 
            value={manifest.closing_km}
            onPress={onPressClosingKm}
            disabled={manifest.closing_km !== 0}
          />
        )}
        { manifest.mobile_comments && (
          <EslButton 
            icon='message-circle-warning'
            lightTitle={true}
            fontSize={20}
            onPress={onPressComments}
          /> 
        )}
      </View>
    </TouchableOpacity>
  );
})
