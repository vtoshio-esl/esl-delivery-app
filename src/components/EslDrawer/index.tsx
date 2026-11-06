import React, { useState } from 'react';
import { 
  DrawerContentComponentProps, 
  DrawerContentScrollView, 
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import { 
  View, 
  Text,
  Image
} from 'react-native';
import Lucide from '@react-native-vector-icons/lucide';

import { useStores } from '../../stores/useStores';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../themes/AppPaperTheme';
import { styles } from './styles';

import { EslButton } from '../shared/EslButton';
import { openMaps } from '../../helpers/openMaps';
import { ToastMessage } from '../../helpers/toastMessage';
import { observer } from 'mobx-react-lite';

export const EslDrawer = observer(function EslDrawer(props: DrawerContentComponentProps) {
  const { userStore, occurrencesStore } = useStores();
  const theme = useTheme<AppTheme>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const userPfp = (userStore.driver?.logo) ?
    userStore.driver.logo :
    require('../../../assets/images/user_placeholder.png');

  const handleFetchOcccurrences = async () => {
    setIsLoading(true);

    try {
      await occurrencesStore.fetchOccurrences();
      ToastMessage.success('Ocorrências', 'Ocorrências sincronizadas com sucesso.')
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro ao registrar ocorrências'
      ToastMessage.error('Ocorrências', message);
      console.log('[API ERROR] Erro da api: ', e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNavigateToCorporation = () => {
    const latitude = userStore.corporation?.main_address?.lat
    const longitude = userStore.corporation?.main_address?.lng
    const label = `Filial Destino - ${userStore.corporation?.name}`

    console.log(userStore.corporation)

    if (!latitude || !longitude) {
      ToastMessage.error(
        'Navegação',
        'Erro ao acessar app para navegar para filial.'
      )
      return;
    }

    try {
      openMaps({ latitude, longitude, label });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro ao redirecionar para o aplicativo de navegação.'
    
      ToastMessage.error(
        'Navegação',
        message
      )
    }
  }

  return (
    <View style={styles.drawerContainer}>
      <View style={[
        { backgroundColor: theme.colors.eslBlue, borderTopRightRadius: 15 }
      ]}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/logo/logo_branca.png')} 
            style={styles.logoImage}
            resizeMode='contain'
          />
        </View>
        <View style={styles.userDataContainer}>
          <Image 
            source={userPfp}
            style={styles.userPfp}
            resizeMode='contain'
          />
          <View>
            <Text style={[
              styles.usernameText,
              { color: theme.colors.white }
            ]}>
              { userStore.driver?.name }
            </Text>
            <Text style={[
              styles.emailText,
              { color: theme.colors.primary100 }
            ]}>
              { userStore.email }
            </Text>
            <Text
              style={[
                styles.emailText,
                { color: theme.colors.primary100 }
              ]}
            >
              { userStore.tenant }
            </Text>
          </View>
        </View>
      </View>

      <DrawerContentScrollView {...props}>
        <DrawerItemList 
          {...props}
        />
        <DrawerItem 
          label='Atualizar Ocorrências'
          icon={({color, size}) => (
            <Lucide name='loader' size={size} color={color}/>
          )}
          onPress={handleFetchOcccurrences}
          style={{ borderRadius: 10 }}
          inactiveTintColor={theme.colors.textSecondary}
        />
        <DrawerItem 
          label='Navegar para Filial'
          icon={({color, size}) => (
            <Lucide name='map' size={size} color={color}/>
          )}
          onPress={handleNavigateToCorporation}
          style={{ borderRadius: 10 }}
          inactiveTintColor={theme.colors.textSecondary}
        />
      </DrawerContentScrollView>
      
      <View style={styles.footerContainer}>
        <View style={styles.appDataContainer}>
          <Text style={[styles.appVersionLabel]}>
            VERSÃO APP
          </Text>
          <Text style={[styles.appVersion]}>
            0.0.1
          </Text>
        </View>
        <EslButton 
          title='Logout'
          icon='log-out'
          backgroundColor={theme.colors.danger}
          lightTitle={true}
          style={{ width: '100%' }}
          fontSize={12}
          onPress={userStore.logout}
        />
      </View>
    </View>
  );
})
