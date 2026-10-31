import { 
  createNativeStackNavigator,
  NativeStackScreenProps
} from "@react-navigation/native-stack";
import { observer } from "mobx-react-lite";

import { useStores } from "../stores/useStores";
import { LoginScreen } from "../screens/LoginScreen";
import { AppDrawerNavigator, AppDrawerParamList } from "./DrawerNavigation";
import { NavigatorScreenParams } from "@react-navigation/native";

export type RootNativeStackParamList = {
  login: undefined,
  home: NavigatorScreenParams<AppDrawerParamList>,
}

export type RootNativeStackScreenProps<T extends keyof RootNativeStackParamList> = NativeStackScreenProps<
  RootNativeStackParamList,
  T
>

const Stack = createNativeStackNavigator<RootNativeStackParamList>();

export const AppNativeStackNavigator = observer(function AppNativeStackNavigator() {
  const { userStore } = useStores();

  return (
    <Stack.Navigator>
      { userStore.isAuthenticated ? (
        <Stack.Screen 
          name="home" 
          component={AppDrawerNavigator} 
          options={{ headerShown: false }}
        />
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