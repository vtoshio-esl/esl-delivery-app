import { createDrawerNavigator, DrawerScreenProps } from '@react-navigation/drawer'; 
import { observer } from 'mobx-react-lite';
import { CompositeScreenProps } from '@react-navigation/native';
import Lucide from '@react-native-vector-icons/lucide';

import { RootNativeStackScreenProps } from './RootNavigator';
import { EslDrawer } from '../components/EslDrawer';

import { useTheme } from 'react-native-paper';
import { AppTheme } from '../themes/AppPaperTheme';

import { ManifestsScreen } from '../screens/Drawer/ManifestsScreen';
import { OccurrencesScreen } from '../screens/Drawer/OccurrencesScreen';
import { SyncHistoryScreen } from '../screens/Drawer/SyncHistoryScreen';
import { useStores } from '../stores/useStores';
import { useEffect } from 'react';
import { AppState } from 'react-native';

export type AppDrawerParamList = {
  manifests: undefined;
  occurrences: undefined;
  syncHistory: undefined;
}

export type AppDrawerScreenProps<T extends keyof AppDrawerParamList> = CompositeScreenProps<
  DrawerScreenProps<AppDrawerParamList, T>,
  RootNativeStackScreenProps<'home'>
>;

const Drawer = createDrawerNavigator<AppDrawerParamList>()

export const AppDrawerNavigator = observer(function AppDrawerNavigator() {
  const theme = useTheme<AppTheme>();
  const { userStore } = useStores();

  useEffect(() => {
    userStore.validateSession();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') userStore.validateSession();
    })

    return () => subscription.remove();
  }, [userStore])

  return (
    <Drawer.Navigator 
      initialRouteName='manifests'
      drawerContent={(props) => <EslDrawer {...props}/>}
      screenOptions={{
        drawerActiveBackgroundColor: theme.colors.primary100,
        drawerActiveTintColor: theme.colors.primary300,
        drawerItemStyle: {
          borderRadius: 10
        }
      }}
    >
      <Drawer.Screen 
        name='manifests' 
        component={ManifestsScreen}
        options={{
          headerShown: true,
          headerTintColor: theme.colors.white,
          headerStyle: { backgroundColor: theme.colors.eslBlue },
          title: 'Manifestos',
          drawerLabel: 'Manifestos',
          drawerIcon: ({color, size}) => (
            <Lucide name='truck' size={size} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name='occurrences' 
        component={OccurrencesScreen}
        options={{
          headerShown: true,
          headerTintColor: theme.colors.white,
          headerStyle: { backgroundColor: theme.colors.eslBlue },
          title: 'Ocorrências',
          drawerLabel: 'Ocorrências',
          drawerIcon: ({color, size}) => (
            <Lucide name='clock' size={size} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name='syncHistory'
        component={SyncHistoryScreen}
        options={{
          headerShown: true,
          headerTintColor: theme.colors.white,
          headerStyle: { backgroundColor: theme.colors.eslBlue },
          title: 'Histórico de Integrações',
          drawerLabel: 'Histórico de Integrações',
          drawerIcon: ({color, size}) => (
            <Lucide name='history' size={size} color={color} />
          )
        }}
      />
    </Drawer.Navigator>
  )
});