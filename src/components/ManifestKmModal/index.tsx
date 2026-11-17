import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { EslModal } from '../EslModal';
import { EslButton } from '../forms/EslButton';
import { EslTextInput } from '../forms/EslTextInput';

import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../themes/AppPaperTheme';

export type KmKind = 'departure' | 'closing'

const LABELS = {
  departure: 'KM Inicial',
  closing: 'KM Final'
}

export interface ManifestKmModalProps {
  label?: string;
  kind: KmKind;
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (km: number) => Promise<void> | void;
}

export function ManifestKmModal(props: ManifestKmModalProps) {
  const theme = useTheme<AppTheme>();
  const {
    label,
    kind,
    visible,
    onDismiss,
    onConfirm,
  } = props;
  
  const [km, setKm] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  const parsedKm = parseInt(km, 10)
  
  const kmLabel = LABELS[kind];
  
  const handleSave = async () => {
    setSaving(true);
    try {
      await onConfirm(parsedKm);
    } finally {
      setSaving(false);
    }
  }

  return (
    <EslModal 
      title={label}
      visible={visible}
      onDismiss={onDismiss}
      actions={
        <View style={styles.modalFooter}>
          <EslButton 
            title='Cancelar'
            icon='x'
            lightTitle
            fontSize={12}
            onPress={onDismiss}
          />
          <EslButton 
            title='Enviar'
            icon='save'
            lightTitle
            fontSize={12}
            backgroundColor={theme.colors.success}
            disabled={saving}
            onPress={handleSave}
          />
        </View>
      }
    >
      <Text style={{ marginBottom: 10 }}>
        Informe o valor do hodômetro do veículo:
      </Text>
      <EslTextInput 
        label={kmLabel}
        value={km}
        onChangeText={setKm}
        keyboardType='number-pad'
      />
    </EslModal>
  );
}

export const styles = StyleSheet.create({
  modalFooter: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    gap: 5, 
    padding: 5 
  }
})