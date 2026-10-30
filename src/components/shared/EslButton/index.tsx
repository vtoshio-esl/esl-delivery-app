import React from 'react';
import { 
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps
} from 'react-native';

import { styles } from './styles';
import Lucide, { LucideIconName } from '@react-native-vector-icons/lucide';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../../themes/AppPaperTheme';

export interface EslButtonProps extends TouchableOpacityProps {
  title: string,
  fontSize?: number,
  icon?: LucideIconName
  backgroundColor?: string
  lightTitle?: boolean
}

const DEFAULT_FONT_SIZE = 14

export function EslButton(props: EslButtonProps) {
  const theme = useTheme<AppTheme>();
  const {
    title,
    fontSize,
    icon,
    backgroundColor,
    lightTitle,
    disabled,
    ...rest
  } = props

  const titleColor = lightTitle ? '#F2F2F2' : '#0000';

  const renderButtonTitle = () => {
    if (title && icon) {
      return (
        <View style={[
          styles.titleTextContainer,
          styles.withIconContainer
        ]}>
          <Lucide 
            name={icon}
            size={fontSize ?? DEFAULT_FONT_SIZE}
            color={titleColor}
          />
          <Text style={[
            styles.titleText,
            { color: titleColor, fontSize: fontSize ?? DEFAULT_FONT_SIZE}
          ]}>
            { title.toUpperCase() }
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.titleTextContainer}>
          <Text style={[
            styles.titleText,
            { color: titleColor, fontSize: fontSize ?? DEFAULT_FONT_SIZE }
          ]}>
            { title.toUpperCase() }
          </Text>
        </View>
      )
    }
  }

  return (
    <TouchableOpacity 
      disabled={disabled}
      style={[
        styles.buttonContainer,
        { backgroundColor: backgroundColor ?? theme.colors.eslDarkBlue },
        disabled && styles.disabled
      ]} 
      { ...rest }
    >
      { renderButtonTitle() }
    </TouchableOpacity>
  );
}