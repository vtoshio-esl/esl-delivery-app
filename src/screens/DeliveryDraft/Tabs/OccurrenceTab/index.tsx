import React from 'react';
import { Text, View } from 'react-native';
import { observer } from 'mobx-react-lite';

export const OccurrenceTab = observer(() => {
  return (
    <View>
      <Text>
        Recebedor
      </Text>
      <Text>
        Documento
      </Text>
    </View>
  );
})