import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { useTheme } from 'react-native-paper';
import { AppTheme } from '../themes/AppPaperTheme';
import { OccurrenceTab } from '../screens/DeliveryDraft/Tabs/OccurrenceTab';
import { ConfirmationTab } from '../screens/DeliveryDraft/Tabs/ConfirmationTab';

export type DeliveryDraftTabParamList = {
  occurrence: undefined;
  confirmation: undefined;
}

const Tab = createMaterialTopTabNavigator<DeliveryDraftTabParamList>();

export function DeliveryDraftTabs() {
  const theme = useTheme<AppTheme>();

  return (
    <Tab.Navigator
      initialRouteName='occurrence'
      tabBarPosition='bottom'
      screenOptions={{
        lazy: true,
        tabBarScrollEnabled: true,
      }}
    >
      <Tab.Screen 
        name='occurrence'
        component={OccurrenceTab}
        options={{ title: 'Dados' }}
      />
      <Tab.Screen 
        name='confirmation'
        component={ConfirmationTab}  
        options={{ title: 'Confirmação' }}
      />
    </Tab.Navigator>
  )
}