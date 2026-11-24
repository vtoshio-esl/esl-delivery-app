import React from 'react';
import { 
  View, 
  Text, 
  TextInput,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextInputInstance
} from 'react-native';

import { styles } from './styles';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../../themes/AppPaperTheme';
import Lucide, { LucideIconName } from '@react-native-vector-icons/lucide';

export interface EslTextInputProps extends TextInputProps {
  ref?: React.Ref<TextInputInstance>,
  label?: string;
  fontSize?: number;
  icon?: LucideIconName;
  color?: string;
  disabled?: boolean;
  textInputStyle?: StyleProp<ViewStyle>;
}

export function EslTextInput(props: EslTextInputProps) {
  const theme = useTheme<AppTheme>();
  const {
    ref,
    label,
    fontSize = 14,
    icon,
    color,
    disabled = false,
    style,
    textInputStyle,
    ...rest
  } = props
  
  const renderLabel = (): React.ReactNode => {
    if (label && icon) {
      return (
        <View style={styles.labelWithIconContainer}>
          <Lucide 
            name={icon}
            size={fontSize}
            color={color ?? theme.colors.textSecondary}
          />
          <Text style={[
            styles.labelText,
            { color: color ?? theme.colors.textSecondary }
          ]}>
            { label }
          </Text>
        </View>
      )
    } else {
      return (
        <Text style={[
          styles.labelText,
          { color: color ?? theme.colors.textSecondary }
        ]}>
          { label }
        </Text>
      )
    }
  }

  return (
    <View style={[
      styles.inputGroup,
      style
    ]}>
      { label && (
        renderLabel()
      ) }
      <TextInput
        style={[
          styles.textInput,
          { backgroundColor: theme.colors.background },
          disabled && styles.disabled,
          textInputStyle
        ]}
        { ...rest }
        ref={ref}
        editable={!disabled}
        placeholderTextColor={theme.colors.textSecondary}
      />
    </View>
  );
}