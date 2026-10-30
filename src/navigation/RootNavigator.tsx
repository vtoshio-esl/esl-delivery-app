import { 
  createNativeStackNavigator,
  NativeStackScreenProps
} from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/HomeScreen";
import { useStores } from "../stores/useStores";
import { LoginScreen } from "../screens/LoginScreen";
import { observer } from "mobx-react-lite";

export type RootNativeStackParamList = {
  home: undefined,
  login: undefined,
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
          component={HomeScreen} 
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