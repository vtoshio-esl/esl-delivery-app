import React from 'react';
import { View } from 'react-native';
import { DrawerHeaderProps, DrawerToggleButton } from '@react-navigation/drawer';
import { getHeaderTitle, Header } from '@react-navigation/elements';

import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../../themes/AppPaperTheme';

import { SyncButton } from '../SyncButton';

export function EslDrawerHeader(props: DrawerHeaderProps) {
  const theme = useTheme<AppTheme>();
  const {
    route,
    options,
    layout,
  } = props
  
  return (
    <Header 
      layout={layout}
      title={getHeaderTitle(options, route.name)}
      headerTintColor={theme.colors.white}
      headerStyle={{ backgroundColor: theme.colors.eslBlue }}
      headerLeft={
        options.headerLeft ??
          ((props) => <DrawerToggleButton tintColor={props.tintColor} />)
      }
      headerRight={
        options.headerRight ??
          (() => <SyncButton />)
      }
    />
  );
}