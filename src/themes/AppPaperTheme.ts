import { DefaultTheme, Theme } from "@react-navigation/native";
import { MD3LightTheme, adaptNavigationTheme } from "react-native-paper";
import { defaultColors } from "./DefaultColors";

export const AppPaperTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        ...defaultColors,
        
        eslBlue: '#475CC7',
        eslDarkBlue: '#102050',

        primary100: '#E1E5F6',
        primary200: '#7588EC',
        primary300: '#3649AC',
        primary400: '#0F2480',
    }
};

const { LightTheme } = adaptNavigationTheme({
  reactNavigationLight: DefaultTheme,
  materialLight: AppPaperTheme,
});

export const navigationTheme: Theme = {
    ...DefaultTheme,
    ...LightTheme
}

export type AppTheme = typeof AppPaperTheme;