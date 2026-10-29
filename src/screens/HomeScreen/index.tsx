import React from 'react';
import { Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from 'react-native-paper';
import type { AppTheme } from '../../themes/AppPaperTheme';
import { useStores } from '../../stores/useStores';
import { observer } from 'mobx-react-lite';

export const HomeScreen = observer(function HomeScreen() {
  const theme = useTheme<AppTheme>()
  const rootStore = useStores();

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 25, color: theme.colors.textPrimary }}>
        Hello Application!
      </Text>
      <Text style={{ fontSize: 15, color: theme.colors.textSecondary }}>
        { rootStore.counter }
      </Text>
      <Button
        title='Incrementar'
        onPress={rootStore.incrementToCounter}
      />
    </SafeAreaView>
  );
})