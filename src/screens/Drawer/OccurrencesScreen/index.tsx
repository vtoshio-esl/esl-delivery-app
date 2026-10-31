import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';
import { FlashList } from '@shopify/flash-list';
import { getSnapshot } from 'mobx-state-tree';

import { useStores } from '../../../stores/useStores';

export const OccurrencesScreen = observer(function OccurrencesScreen() {
  const { occurrencesStore } = useStores();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      { (occurrencesStore.occurrences.length === 0) ? (
        <Text>
          Nenhuma ocorrência foi carregada ainda.
        </Text>
      ) : (
        <FlashList
          data={getSnapshot(occurrencesStore.occurrences)}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => 
            <View key={item.id}>
              <Text>
                { item.description }
              </Text>
            </View>
          }
        />
      ) }
    </SafeAreaView>
  );
})