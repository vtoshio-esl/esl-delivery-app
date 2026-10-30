import React, { useState } from 'react';
import { 
  Text, 
  View,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../themes/AppPaperTheme';
import { useStores } from '../../stores/useStores';
import { ToastMessage } from '../../helpers/toastMessage';

import { styles } from './styles';
import { EslTextInput } from '../../components/shared/EslTextInput';
import { EslButton } from '../../components/shared/EslButton';

type LoginData = {
  tenant: string;
  email: string;
  password: string;
}

export function LoginScreen() {
  const theme = useTheme<AppTheme>();
  const { userStore } = useStores();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [tenant, setTenant] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const validateFields = (): LoginData | null => {
    const data = {
      tenant: tenant.trim().toLowerCase(),
      email: email.trim().toLocaleLowerCase(),
      password,
    }

    if (!data.tenant || !data.email || !data.password) {
      ToastMessage.error(
        'Formulário',
        'Os campos não podem estar em branco. Por favor, tente novamente.'
      )

      return null
    }

    return data;
  }

  const handleLogin = async() => {
    const data = validateFields();
    if (!data) return;
    
    setTenant(data.tenant);
    setEmail(data.email);
    setIsLoading(true);

    try {
      await userStore.login(tenant, email, password);
    } catch (e) {
      const error_message = e instanceof Error ? e.message : 'Erro desconhecido.'

      ToastMessage.error(
        'Autenticação', 
        'Erro ao realizar login. Por gentileza, tente novamente.'
      )
      console.log('[LOGIN] Erro login: ', error_message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={[
      styles.viewContainer,
      { backgroundColor: theme.colors.eslBlue }
    ]}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../../assets/logo/logo_branca.png')}
          style={styles.logoImage}
          resizeMode='contain'
        />
      </View>
      <View style={styles.formContainer}> 
        <View style={styles.tenantInfoContainer}>
          <Text style={[
            styles.tenantLabel,
            { color: theme.colors.textSecondary }
          ]}>
            URL BASE
          </Text>
          <Text style={{ color: theme.colors.textSecondary }}>
            tmsweb.com.br
          </Text>
        </View>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <EslTextInput
              label='Empresa'
              icon='building-2'
              placeholder='beta1'
              value={tenant}
              onChangeText={setTenant}
              disabled={isLoading}
            />
            <EslTextInput
              label='E-mail'
              icon='mail'
              keyboardType='email-address'
              placeholder="exemplo@email.com.br"
              value={email}
              onChangeText={setEmail}
              disabled={isLoading}
            />
            <EslTextInput
              label='Senha'
              icon='key-round'
              placeholder='************'
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              disabled={isLoading}
            />
          </View>

          <EslButton 
            title='Login'
            icon='lock-keyhole-open'
            lightTitle={true}
            onPress={handleLogin}
            disabled={
              isLoading
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}