import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { RootNativeStackScreenProps } from '../../../navigation/RootNavigator';

import { AppTheme } from '../../../themes/AppPaperTheme';
import { useTheme } from 'react-native-paper';
import { useStores } from '../../../stores/useStores';
import { observer } from 'mobx-react-lite';

import { SafeAreaView } from 'react-native-safe-area-context';
import { DeliveryDraftTabs } from '../../../navigation/TopTabsNavigation';

import { styles } from './styles';

export const DeliveryDraftScreen = observer(({navigation, route}: RootNativeStackScreenProps<'deliveryDraft'>) => {
  const theme = useTheme<AppTheme>();
  const { deliveryDraftStore } = useStores()

  const service = deliveryDraftStore.firstSelectedService;
  const hasOccurrence = !!service?.hasOccurrence;

  useEffect(() => {
    if (service?.hasOccurrence) {
      deliveryDraftStore.loadFromService(service);
    } else {
      deliveryDraftStore.clearForm();
    }
  }, [deliveryDraftStore, service])

  const reference = deliveryDraftStore.getExitedAtReference;

  const renderDates = (kind: 'arrival' | 'exit') => {
    const title = (kind === 'arrival') ? 'Chegada' : 'Saída';
    const date = (kind === 'arrival')
      ? reference?.formattedArrivedAt
      : reference?.formattedExitedAt

    if (!date) return;

    return (
      <View style={[
        styles.dateContainer,
        { borderColor: theme.colors.primary300, backgroundColor: theme.colors.background }
      ]}>
        <Text style={[
          styles.dateTitle,
          { color: theme.colors.primary300 }
        ]}>
          { title }
        </Text>
        <Text style={
          { color: theme.colors.primary300 }
        }>
          { date }
        </Text>
      </View>
    );
  }

  return (
    <View style={[
      styles.screenContainer,
      { backgroundColor: theme.colors.background }
    ]}>
      <View style={styles.headerContainer}>
        <View style={styles.datesView}>
          { renderDates('arrival') }
          { renderDates('exit') }
        </View>
      </View>
      
      <SafeAreaView style={styles.tabsContainer}>
        <DeliveryDraftTabs initialRouteName={hasOccurrence ? 'confirmation' : 'occurrence'} />
      </SafeAreaView>
    </View>
  );
});