import React, { useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';
import { FlashList } from '@shopify/flash-list';

import { useStores } from '../../../stores/useStores';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../../themes/AppPaperTheme';

import { OccurrenceCard } from '../../../components/OccurrenceCard';
import { EslTextInput } from '../../../components/forms/EslTextInput';
import { styles } from './styles';

export const OccurrencesScreen = observer(function OccurrencesScreen() {
  const { occurrencesStore } = useStores();
  const theme = useTheme<AppTheme>();
  const [search, setSearch] = useState<string>();

  const occurrences = occurrencesStore.occurrences;

  const filtered = useMemo(() => {
    const query = search;
    if (!query) return occurrences;

    return occurrences.filter((item) => 
      String(item.code).includes(query) || String(item.description).includes(query)
    );
  }, [occurrences, search]);

  if (occurrences.length === 0) {
    return (
      <SafeAreaView style={styles.emptyOccurrenceListContainer}>
        <Text style={[
          styles.notFoundOccurrenceText,
          { color: theme.colors.textSecondary }          
        ]}>
          Nenhuma ocorrência sincronizada. Por gentileza, atualize as ocorrências pelo menu.
        </Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView 
      edges={['bottom', 'left', 'right']}
      style={[
        styles.occurrencesContainer,
        { backgroundColor: theme.colors.background }
      ]}
    >
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
        onRefresh={occurrencesStore.fetchOccurrences}
        ListEmptyComponent={
          <Text style={[
            styles.notFoundOccurrenceText,
            { color: theme.colors.textSecondary }
          ]}>
            Nenhum item encontrado.
          </Text>
        }
        renderItem={({ item }) => 
          <OccurrenceCard occurrence={item}/>
        }
      />
    </SafeAreaView>
  );
})