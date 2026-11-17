import { 
  createNativeStackNavigator,
  NativeStackScreenProps
} from "@react-navigation/native-stack";
import { observer } from "mobx-react-lite";

import { useStores } from "../stores/useStores";
import { LoginScreen } from "../screens/LoginScreen";
import { AppDrawerNavigator, AppDrawerParamList } from "./DrawerNavigation";
import { NavigatorScreenParams } from "@react-navigation/native";
import { ManifestDetailScreen } from "../screens/ManifestDetailScreen";

import { useTheme } from "react-native-paper";
import { AppTheme } from "../themes/AppPaperTheme";
import { ManifestItemArrivalScreen } from "../screens/ManifestItemArrivalScreen";
import { ManifestServiceKind } from "../models/ManifestServices/types";
import { DeliveryDraftScreen } from "../screens/DeliveryDraft/DeliveryDraftScreen";
import { EslStackHeader } from "../components/shared/EslStackHeader";

export type RootNativeStackParamList = {
  login: undefined,
  home: NavigatorScreenParams<AppDrawerParamList>,
  manifestDetail: { manifestId: number; sequenceCode: number },
  manifestItemArrival: { 
    manifestId: number, 
    manifestSequenceCode: number, 
    itemId: number,
    itemKind: ManifestServiceKind,
  },
  deliveryDraft: { manifestSequenceCode: number },
}

export type RootNativeStackScreenProps<T extends keyof RootNativeStackParamList> = NativeStackScreenProps<
  RootNativeStackParamList,
  T
>

const Stack = createNativeStackNavigator<RootNativeStackParamList>();

export const AppNativeStackNavigator = observer(function AppNativeStackNavigator() {
  const theme = useTheme<AppTheme>();
  const { userStore, syncStore } = useStores();

  return (
    <Stack.Navigator>
      { userStore.isAuthenticated ? (
        <>
          <Stack.Screen 
            name="home" 
            component={AppDrawerNavigator} 
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='manifestDetail'
            component={ManifestDetailScreen}
            options={({ route}) => ({
              title: `Manifesto ${route.params.sequenceCode}`,
              header: (props) => <EslStackHeader {...props}/>,
            })}
          />
          <Stack.Screen 
            name="manifestItemArrival"
            component={ManifestItemArrivalScreen}
            options={{
              title: 'Confirmar Chegada',
              header: (props) => <EslStackHeader showSync={false} {...props}/>,
            }}
          />
          <Stack.Screen 
            name="deliveryDraft"
            component={DeliveryDraftScreen}
            options={({route}) => ({
              title: `Manifesto ${route.params.manifestSequenceCode}`,
              header: (props) => <EslStackHeader {...props}/>,
            })}
          />
        </>
      ) : (
        <Stack.Screen 
          name="login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
});