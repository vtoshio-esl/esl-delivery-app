import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View 
} from 'react-native';

import { useTheme, Portal, Modal } from 'react-native-paper';
import { AppTheme } from '../../themes/AppPaperTheme';
import Lucide from '@react-native-vector-icons/lucide';

export interface EslModalProps {
  title?: string;
  visible: boolean;
  onDismiss: () => void;
  children?: React.ReactNode,
  actions?: React.ReactNode,
}

export function EslModal(props: EslModalProps) {
  const theme = useTheme<AppTheme>();
  
  const {
    title = '',
    visible,
    children,
    actions,
    onDismiss
  } = props

  return (
    <Portal>
      <Modal 
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalView,
        ]}
      >
        <View 
          style={[ 
            styles.modalHeader,
            { backgroundColor: theme.colors.primary300 }
          ]}
        >
          <Text style={[
            styles.titleText,
            { color: theme.colors.white },
          ]}>
            { title }
          </Text>

          <Lucide 
            name='x'
            size={20}
            color={theme.colors.white}
            onPress={onDismiss}
            style={{ alignSelf: 'flex-end' }}
          />
        </View>
        
        <View style={[
          styles.modalBody,
          { backgroundColor: theme.colors.background },
        ]}>
          { children }
        </View>

        { actions && (
          <View style={[
            styles.modalFooter,
            { backgroundColor: theme.colors.background, borderColor: theme.colors.primary300 },
          ]}>
            { actions }
          </View>
        )}
      </Modal>
    </Portal>
  );
}

export const styles = StyleSheet.create({
  modalView: {
    width: '80%',
    alignSelf: 'center',
    borderRadius: 10,
    overflow: 'hidden'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  titleText: {
    fontWeight: 'bold',
  },
  modalBody: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  modalFooter: {
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    padding: 5
  },
})
