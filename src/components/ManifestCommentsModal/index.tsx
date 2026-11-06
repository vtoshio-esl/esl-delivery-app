import React from 'react';
import { Text } from 'react-native';
import { EslModal } from '../EslModal';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../themes/AppPaperTheme';

export interface ManifestCommentsModalProps {
  comments?: string | null,
  visible: boolean,
  onDismiss: () => void;
}

export function ManifestCommentsModal(props: ManifestCommentsModalProps) {
  const theme = useTheme<AppTheme>();
  
  const {
    comments,
    visible,
    onDismiss
  } = props;

  return (
    <EslModal
      title='Comentários do TMS' 
      visible={visible}
      onDismiss={onDismiss}
    >
      { (comments) ? (
        <Text>{ comments }</Text>
      ) : (
        <Text style={{ color: theme.colors.textSecondary }}>
          Nenhum comentário fornecido pelo TMS.
        </Text>
      )}
    </EslModal>
  );
}