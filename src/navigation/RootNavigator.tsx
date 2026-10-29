import { 
  createNativeStackNavigator,
  NativeStackScreenProps
} from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/HomeScreen";

export type RootNativeStackParamList = {
  home: undefined
}

export type RootNativeStackScreenProps<T extends keyof RootNativeStackParamList> = NativeStackScreenProps<
  RootNativeStackParamList,
  T
>

const Stack = createNativeStackNavigator<RootNativeStackParamList>();

export function AppNativeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="home" 
        component={HomeScreen} 
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}