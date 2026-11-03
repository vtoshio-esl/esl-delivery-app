import React from 'react';
import { View, Text } from 'react-native';
import { OccurrenceSnapshotOut } from '../../models/Occurrence';
import { getTriggerLabel } from '../../models/types/OccurrenceTrigger';
import { getAvailableForLabel } from '../../models/types/OccurrenceAvailableFor';

import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../themes/AppPaperTheme';
import { styles } from './styles';

export interface OccurrenceCardProps {
  occurrence: OccurrenceSnapshotOut
}

export function OccurrenceCard(props: OccurrenceCardProps) {
  const { occurrence } = props
  
  const theme = useTheme<AppTheme>();

  const triggerLabel = getTriggerLabel(occurrence.trigger)
  const availableForLabels = occurrence.available_for.map(getAvailableForLabel).join(', ')

  return (
    <View style={[
      styles.cardContainer,
      { backgroundColor: theme.colors.background}
    ]}>
      <View style={{ justifyContent: 'space-around' }}>
        <Text style={[
          styles.titleText,
          { color: theme.colors.textPrimary }
        ]}>
          {occurrence.code} - {occurrence.description}
        </Text>
        <Text style={[
          styles.occurrenceTrigger,
          { color: theme.colors.textSecondary }
        ]}>
          {triggerLabel}
        </Text>
      </View>
      { availableForLabels && (
        <Text style={{ textAlign: 'justify' }}> 
          {availableForLabels}
        </Text>
      )}
    </View>
  );
}