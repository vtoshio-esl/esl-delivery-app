import React from 'react';
import { Text } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores/useStores';

import { EslModal } from '../../EslModal';
import { EslButton } from '../../forms/EslButton';

export const SyncModal = observer(() => {
  const { syncStore } = useStores();
  
  return (
    <EslModal
      title='Fila de sincronização'
      visible={syncStore.isModalVisible}
      onDismiss={syncStore.closeModal}
      actions={
        <EslButton 
          title='Sincronizar Agora' 
          icon='refresh-cw' 
          lightTitle
          onPress={syncStore.sendJobs}
        />
      }
    >
      <Text>
        Temporário
      </Text>
    </EslModal>
  );
});