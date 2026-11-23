import { createMaterialTopTabNavigator, MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';

import { OccurrenceTab } from '../screens/DeliveryDraft/Tabs/OccurrenceTab';
import { ImagesTab } from '../screens/DeliveryDraft/Tabs/ImagesTab';
import { ConfirmationTab } from '../screens/DeliveryDraft/Tabs/ConfirmationTab';
import { RootNativeStackScreenProps } from './RootNavigator';
import { CompositeScreenProps } from '@react-navigation/native';

export type DeliveryDraftTabParamList = {
  occurrence: undefined;
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
        name='images'
        component={ImagesTab}
        options={{ title: 'Imagens' }}
      />
      <Tab.Screen 
        name='confirmation'
        component={ConfirmationTab}  
        options={{ title: 'Confirmação' }}
      />
    </Tab.Navigator>
  )
}