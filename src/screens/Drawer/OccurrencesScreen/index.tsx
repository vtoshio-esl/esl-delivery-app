import React, { useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';
import { FlashList } from '@shopify/flash-list';
import { getSnapshot } from 'mobx-state-tree';

import { useStores } from '../../../stores/useStores';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../../themes/AppPaperTheme';

import { OccurrenceCard } from '../../../components/OccurrenceCard';
import { EslTextInput } from '../../../components/shared/EslTextInput';
import { styles } from './styles';

export const OccurrencesScreen = observer(function OccurrencesScreen() {
  const { occurrencesStore } = useStores();
  const theme = useTheme<AppTheme>();
  const [search, setSearch] = useState<string>();

  const occurrences = getSnapshot(occurrencesStore.occurrences);

  const filtered = useMemo(() => {
    const query = search;
    if (!query) return occurrences;

    return occurrences.filter((item) => 
      String(item.code).includes(query)
    );
  }, [occurrences, search]);

  if (occurrences.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text>
          Nenhuma ocorrência está carregada. Por gentileza, atualize as ocorrências pelo menu.
        </Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[
      styles.occurrencesContainer,
      { backgroundColor: theme.colors.background }
    ]}>
      <View style={styles.inputContainer}>
        <EslTextInput 
          label='Pesquisar'
          icon='search'
          onChangeText={setSearch}
        />
      </View>
      <FlashList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => 
          <OccurrenceCard occurrence={item}/>
        }
      />
    </SafeAreaView>
  );
})