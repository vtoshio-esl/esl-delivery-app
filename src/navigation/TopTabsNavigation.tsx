import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { useTheme } from 'react-native-paper';
import { AppTheme } from '../themes/AppPaperTheme';
import { OccurrenceTab } from '../screens/DeliveryDraft/Tabs/OccurrenceTab';
import { ConfirmationTab } from '../screens/DeliveryDraft/Tabs/ConfirmationTab';

export type DeliveryDraftTabParamList = {
  occurrence: undefined;
  confirmation: undefined;
}

export interface DeliveryDraftTabsProps {
  initialRouteName?: keyof DeliveryDraftTabParamList;
}

const Tab = createMaterialTopTabNavigator<DeliveryDraftTabParamList>();

export function DeliveryDraftTabs(props: DeliveryDraftTabsProps) {
  const theme = useTheme<AppTheme>();
  const { initialRouteName = 'occurrence' } = props;

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
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