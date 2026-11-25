import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { FlashList } from '@shopify/flash-list';

import { styles } from './styles';

import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../../../themes/AppPaperTheme';
import { useStores } from '../../../../stores/useStores';
import { EslSelect2 } from '../../../../components/forms/EslSelect2';
import { EslTextInput } from '../../../../components/forms/EslTextInput';
import { EslButton } from '../../../../components/forms/EslButton';
import { ToastMessage } from '../../../../helpers/toastMessage';
import { formatDateTimeToLocale } from '../../../../helpers/dateFormat';
import { ApiError } from '../../../../services/api/errors';

export const EventsTab = observer(() => {
  const { deliveryDraftStore, occurrencesStore, eventsStore } = useStores();
  const theme = useTheme<AppTheme>();

  const [occurrenceId, setOccurrenceId] = useState<number | null>(null);
  const [occurrenceAt, setOccurrenceAt] = useState<string | null>(null);
  const [comments, setComments] = useState('');
  const [sending, setSending] = useState(false);

  const service = deliveryDraftStore.selectedService;

  if (!service?.canRegisterEvent) {
    return (
      <View style={styles.container}>
        <Text>Este serviço não permite registro de eventos.</Text>
      </View>
    );
  }

  const options = occurrencesStore.occurrencesForEvents.map((o) => ({
    label: `${o.code} - ${o.description}`,
    value: o.id,
  }));

  const clearForm = () => {
    setOccurrenceId(null);
    setOccurrenceAt(null);
    setComments('');
  }

  const handleSelect = (id: number) => {
    setOccurrenceId(id);
    setOccurrenceAt(new Date().toISOString());
  };

  const handleSubmit = async () => {
    if (!occurrenceId || !occurrenceAt) return;

    setSending(true);
    try {
      await eventsStore.submitEvent({
        occurrence_id: occurrenceId,
        occurrence_at: occurrenceAt,
        comments: comments.trim() || undefined,
      });

      clearForm();
      ToastMessage.success('Evento', 'Evento registrado com sucesso.');
    } catch (e) {
      ToastMessage.error('Evento', e instanceof ApiError ? e.message : 'Erro ao registrar evento.');
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        <FlashList
          data={eventsStore.eventsFor(service)}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={{ alignSelf: 'center' }}>
              Nenhum evento registrado neste aparelho.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={[
              styles.event,
              { borderColor: theme.colors.primary300 }
            ]}>
              <Text style={[
                styles.eventTitle,
                { color: theme.colors.primary400 }
              ]}>
                {item.description}
              </Text>
              <Text>
                { formatDateTimeToLocale(item.occurrence_at) }
              </Text>
              {!!item.comments && 
                <Text>
                  {item.comments}
                </Text>
              }
            </View>
          )}
        />
      </View>

      
      <View style={{ gap: 10, marginBottom: 10, }}>
        <EslSelect2
          label='Evento'
          icon='calendar'
          searchable
          value={occurrenceId}
          onChange={handleSelect}
          options={options}
          disabled={sending || service.hasOccurrence }
        />
        <EslTextInput
          label='Comentários'
          icon='message-circle'
          fontSize={12}
          value={comments}
          onChangeText={setComments}
          disabled={sending || service.hasOccurrence}
        />
      </View>
      <EslButton
        title='Adicionar Evento'
        icon='plus'
        lightTitle
        disabled={!occurrenceId || sending}
        onPress={handleSubmit}
      />
    </View>
  );
});