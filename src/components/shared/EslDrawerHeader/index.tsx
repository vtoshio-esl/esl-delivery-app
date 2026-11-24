import React from 'react';
import { View } from 'react-native';
import { DrawerHeaderProps, DrawerToggleButton } from '@react-navigation/drawer';
import { getHeaderTitle, Header } from '@react-navigation/elements';

import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../../themes/AppPaperTheme';

import { SyncButton } from '../SyncButton';

export interface EslDrawerHeaderProps extends DrawerHeaderProps {
  showSync?: boolean;
}

export function EslDrawerHeader(props: EslDrawerHeaderProps) {
  const theme = useTheme<AppTheme>();
  const {
    route,
    options,
    layout,
    showSync = true,
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
      headerRight={() => (
        showSync 
          ? <SyncButton />
          : null
      )}
    />
  );
}