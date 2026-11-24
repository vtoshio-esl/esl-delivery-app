import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Lucide from '@react-native-vector-icons/lucide';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../../stores/useStores';

import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../../../themes/AppPaperTheme';
import { styles } from './styles';

import { ToastMessage } from '../../../../helpers/toastMessage';
import { EslSelect2 } from '../../../../components/forms/EslSelect2';
import { EslTextInput } from '../../../../components/forms/EslTextInput';
import { ManifestServiceCard } from '../../../../components/ManifestServiceCard';

type OccurrenceKind = 'finish' | 'treatment'

export const OccurrenceTab = observer(() => {
  const theme = useTheme<AppTheme>();
  const { deliveryDraftStore, occurrencesStore } = useStores()
  
  const [occurrenceKind, setOccurrenceKind] = useState<OccurrenceKind>('finish');
  
  const service = deliveryDraftStore.selectedService;
  const disabledInputs = service?.hasOccurrence ?? true;
  
  const finishOccurrences = occurrencesStore.occurrencesForFinish;
  const dealingOccurrences = occurrencesStore.occurrencesForDealing;

  useEffect(() => {
    if (finishOccurrences.length === 0 || dealingOccurrences.length === 0) {
      ToastMessage.info(
        'Ocorrências',
        'Nenhuma ocorrência de baixa encontrada. Por gentileza sincronize as ocorrências no menu.'
      )
    }
  }, [finishOccurrences.length, dealingOccurrences.length])

  const occurrencesOptions =  (): {label: string, value: number}[] => {
    const data = (occurrenceKind === 'finish') ? finishOccurrences : dealingOccurrences; 

    return data.map((o) => ({ label: `${o.code} - ${o.description}`, value: o.id }))
  } 

  const handleOccurrenceKindChange = (kind: OccurrenceKind) => {
    deliveryDraftStore.clearForm();
    setOccurrenceKind(kind);
  }

  const renderOccurrenceKindOption = (kind: OccurrenceKind, label: string, color: string, disabled?: boolean) => {
    const isSelected = (kind === occurrenceKind)
    
    return (
      <TouchableOpacity 
        style={[
          styles.occurrenceKindContainer,
          disabled && { opacity: 0.7 }
        ]}
        disabled={disabled}
        onPress={() => handleOccurrenceKindChange(kind)}
      >
        <Lucide
          name={ isSelected ? 'circle-dot' : 'circle' }
          size={25}
          color={color} 
        />
        <Text>
          { label }
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.tabContainer}>
      { service && (
        <View style={{ width: '100%' }}>
          <ManifestServiceCard 
            key={`${service.kind}:${service.id}`} 
            service={service} 
            simplified 
          />
        </View>
      )}

      <View style={styles.occurrenceKindOptionsContainer}>
        { renderOccurrenceKindOption(
            'finish', 
            'Entrega com Sucesso',
            theme.colors.success,
            disabledInputs,
        )}
        { renderOccurrenceKindOption(
          'treatment',
          'Tratativa de Entrega',
          theme.colors.danger,
          disabledInputs,
        )}
      </View>

      <View style={styles.mainFormDataContainer}>
        <EslSelect2 
          label='Ocorrência'
          icon='triangle-alert'
          placeholder='Selecionar ocorrência...'
          searchPlaceholder='Pesquisar ocorrência...'
          labelFontSize={12}
          searchable
          value={deliveryDraftStore.occurrenceId}
          onChange={(v) => deliveryDraftStore.setOccurrence(v)}
          disabled={disabledInputs}
          options={occurrencesOptions()}
        />
        
        { occurrenceKind !== 'treatment' && (
          <>
            <EslSelect2 
              label='Grau de Parentesco'
              icon='person-standing'
              searchable
              value={deliveryDraftStore.receiverKinship}
              onChange={deliveryDraftStore.setKinship}
              disabled={disabledInputs}
              options={deliveryDraftStore.kinshipForSelect}
            />
            <EslTextInput 
              label='Recebedor'
              icon='user'
              fontSize={12}
              value={deliveryDraftStore?.receiverName ?? ''}
              onChangeText={deliveryDraftStore.setReceiverName}
              disabled={disabledInputs}
            />
            <EslTextInput 
              label='Documento'
              icon='id-card'
              fontSize={12}
              value={deliveryDraftStore.receiverDocument ?? ''}
              onChangeText={deliveryDraftStore.setReceiverDocument}
              disabled={disabledInputs}
            />
          </>
        ) }

        <EslTextInput 
          label='Comentários'
          icon='message-circle'
          fontSize={12}
          value={deliveryDraftStore.comments}
          onChangeText={deliveryDraftStore.setComments}
          numberOfLines={3}
          disabled={disabledInputs}
        />
      </View>
    </View>
  );
})