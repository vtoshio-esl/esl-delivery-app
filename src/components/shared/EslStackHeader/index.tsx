import React from 'react';
import { observer } from 'mobx-react-lite';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Header, HeaderBackButton, getHeaderTitle } from '@react-navigation/elements';
import { SyncButton } from '../SyncButton';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../../themes/AppPaperTheme';

// import { styles } from './styles';
interface EslStackHeaderProps extends NativeStackHeaderProps {
  showSync?: boolean;
}

export const EslStackHeader = observer((props: EslStackHeaderProps) => {
  const theme = useTheme<AppTheme>();
  const {
    navigation,
    route,
    options,
    back,
    showSync = true,
  } = props
  
  return (
    <Header 
      title={getHeaderTitle(options, route.name)}
      headerTintColor={theme.colors.white}
      headerStyle={{ backgroundColor: theme.colors.eslBlue }}
      headerTitleStyle={options.headerTitleStyle}
      headerTitleAlign={options.headerTitleAlign}
      headerLeft={
        back ? (props) => <HeaderBackButton {...props} onPress={navigation.goBack}/>
        : undefined
      }
      headerRight={() => 
        showSync ? <SyncButton />
        : null
      }
    />
  );
})