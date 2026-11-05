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

export type RootNativeStackParamList = {
  login: undefined,
  home: NavigatorScreenParams<AppDrawerParamList>,
  manifestDetail: { manifestId: number; sequenceCode: number }
}

export type RootNativeStackScreenProps<T extends keyof RootNativeStackParamList> = NativeStackScreenProps<
  RootNativeStackParamList,
  T
>

const Stack = createNativeStackNavigator<RootNativeStackParamList>();

export const AppNativeStackNavigator = observer(function AppNativeStackNavigator() {
  const theme = useTheme<AppTheme>();
  const { userStore } = useStores();

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
              headerTintColor: theme.colors.white,
              headerStyle: { backgroundColor: theme.colors.eslBlue },
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