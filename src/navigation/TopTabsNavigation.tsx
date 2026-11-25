import { createMaterialTopTabNavigator, MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';

import { OccurrenceTab } from '../screens/DeliveryDraft/Tabs/OccurrenceTab';
import { ImagesTab } from '../screens/DeliveryDraft/Tabs/ImagesTab';
import { ConfirmationTab } from '../screens/DeliveryDraft/Tabs/ConfirmationTab';
import { RootNativeStackScreenProps } from './RootNavigator';
import { CompositeScreenProps } from '@react-navigation/native';
import { EventsTab } from '../screens/DeliveryDraft/Tabs/EventsTab';

export type DeliveryDraftTabParamList = {
  occurrence: undefined;
  events: undefined;
  images: undefined;
  confirmation: undefined;
}

export type DeliveryDraftTabScreenProps<T extends keyof DeliveryDraftTabParamList> = CompositeScreenProps<
  MaterialTopTabScreenProps<DeliveryDraftTabParamList, T>,
  RootNativeStackScreenProps<'deliveryDraft'>
>;
export interface DeliveryDraftTabsProps {
  initialRouteName?: keyof DeliveryDraftTabParamList;
}

const Tab = createMaterialTopTabNavigator<DeliveryDraftTabParamList>();

export function DeliveryDraftTabs(props: DeliveryDraftTabsProps) {
  const { initialRouteName = 'occurrence' } = props;

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      tabBarPosition='bottom'
      screenOptions={{
        lazy: true,
        tabBarScrollEnabled: false,
      }}
    >
      <Tab.Screen 
        name='occurrence'
        component={OccurrenceTab}
        options={{ title: 'Dados' }}
      />
      <Tab.Screen
        name='events'
        component={EventsTab}
        options={{ title: 'Eventos' }}
      />
      <Tab.Screen 
        name='images'
        component={ImagesTab}
        options={{ title: 'Imagens' }}
      />
      <Tab.Screen 
        name='confirmation'
        component={ConfirmationTab}  
        options={{ title: 'Confirm.' }}
      />
    </Tab.Navigator>
  )
}