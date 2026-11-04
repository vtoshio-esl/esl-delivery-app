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

import { ManifestSnapshotOut } from '../../models/Manifest';
import { SyncProgressBar } from '../SyncProgressBar';
import { formatDateToLocale, formatDateTimeToLocale } from '../../helpers/dateFormat';

export interface ManifestCardProps extends TouchableOpacityProps {
  manifest: ManifestSnapshotOut
}

export function ManifestCard(props: ManifestCardProps) {
  const theme = useTheme<AppTheme>();
  
  const { 
    manifest,
    ...rest 
  } = props;

  const manifestServiceDate = formatDateToLocale(manifest.service_date);
  const manifestMobileAcceptedAt = (manifest.mobile_accepted_at) ? formatDateTimeToLocale(manifest.mobile_accepted_at) : '';
  const manifestMobileDeparturedAt = (manifest.departured_at) ? formatDateTimeToLocale(manifest.departured_at) : '';
  const syncPercentage = manifest.manifest_items_count > 0 ?
    1 - manifest.pending_items_count / manifest.manifest_items_count
    : 0

  const renderMobileDate = (date: string, title: string) => (
    <View style={[
      styles.mobileDateContainer,
      { backgroundColor: theme.colors.success, borderColor: theme.colors.successDark }
    ]} >
      <Text style={[
        styles.mobileDateTitleText,
        { color: theme.colors.white }
      ]}>
        { title }
      </Text>
      <Text style={{ color: theme.colors.white }}>
        { date }
      </Text>
    </View>
  );

  const renderManifestData = (title: string, data: string | number) => (
    <View style={styles.manifestDataContainer}>
      <Text style={{ fontWeight: 'bold' }}>
        { title }
      </Text>
      <Text>
        { data }
      </Text>
    </View>
  );

  return (
    <TouchableOpacity style={[
      styles.cardContainer,
      { backgroundColor: theme.colors.background, borderColor: theme.colors.primary300 }
    ]} 
    {...rest}
    >
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
            { manifestServiceDate }
          </Text>
        </View>
      </View>

      { (manifestMobileAcceptedAt || manifestMobileDeparturedAt) && (  
        <View style={styles.mobileDatesContainer}>
          { manifestMobileAcceptedAt && renderMobileDate(manifestMobileAcceptedAt, 'Data de Aceite') }
          { manifestMobileDeparturedAt && renderMobileDate(manifestMobileDeparturedAt, 'Data de Saída')}
        </View>
      )}
        
      <View style={styles.volumesContainer}>
        { renderManifestData('Serviços', manifest.manifest_items_count) }
        { renderManifestData('Volumes', manifest.invoices_volumes)}
        { renderManifestData('Peso', manifest.invoices_weight) }
      </View>

      <View style={styles.manifestItemsContainer}>
        { manifest.delivery_manifest_items_count !== 0 && renderManifestData('Entregas', manifest.delivery_manifest_items_count) }
        { manifest.transfer_manifest_items_count !== 0 && renderManifestData('Transferências', manifest.transfer_manifest_items_count) }
        { manifest.pick_manifest_items_count !== 0 && renderManifestData('Coletas', manifest.pick_manifest_items_count) }
        { manifest.reverse_pick_manifest_items_count !== 0 && renderManifestData('Coletas Reversas', manifest.pick_manifest_items_count) }
        { manifest.scheduling_operation_manifest_items_count !== 0 && renderManifestData('Programações', manifest.scheduling_operation_manifest_items_count)}
        { manifest.consolidation_manifest_items_count !== 0 && renderManifestData('Consolidações', manifest.consolidation_manifest_items_count)}
      </View>

      <View style={[
        styles.progressData,
        { borderColor: theme.colors.primary300 }
      ]}>
        <SyncProgressBar progress={syncPercentage} />
      </View>
    </TouchableOpacity>
  );
}
