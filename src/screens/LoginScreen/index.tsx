import React, { useState } from 'react';
import { TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../themes/AppPaperTheme';
import { useStores } from '../../stores/useStores';
import { ToastMessage } from '../../helpers/toastMessage';

export function LoginScreen() {
  const theme = useTheme<AppTheme>();
  const { userStore } = useStores();

  const [tenant, setTenant] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async() => {
    if (!tenant.trim() || !email.trim() || !password) {
      ToastMessage.info('Autenticação', "O formulário de login não pode conter valores em branco. Por gentileza, tente novamente")
      return;
    }
    
    try {
      await userStore.login(tenant.trim(), email.trim(), password)
    } catch (e) {
      const error_message = e instanceof Error ? e.message : 'Erro desconhecido.'

      ToastMessage.error(
        'Autenticação', 
        'Erro ao realizar login. Por gentileza, tente novamente.'
      )
      console.log('[LOGIN] Erro login: ', error_message);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', gap: 15, alignItems: 'center'}}>
      <TextInput
        style={{ borderWidth: 1, borderColor: '#000000', width: '80%' }}
        value={tenant}
        onChangeText={setTenant}
      />
      <TextInput
        style={{ borderWidth: 1, borderColor: '#000000', width: '80%' }}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={{ borderWidth: 1, borderColor: '#000000', width: '80%' }}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button 
        title='Login'
        onPress={handleLogin}
      />
    </SafeAreaView>
  );
}