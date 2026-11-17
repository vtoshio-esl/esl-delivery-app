import React from 'react';
import { 
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps 
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../../themes/AppPaperTheme';


export interface EslValueLabeledButtonProps extends TouchableOpacityProps {
  title?: string
  value?: string | number | null | undefined
  fontSize?: number
}

export function EslValueLabeledButton(props: EslValueLabeledButtonProps) {
  const {
    title,
    value = 'Não inf.',
    fontSize = 12,
    ...rest
  } = props

  const theme = useTheme<AppTheme>();

  return (
    <TouchableOpacity 
      style={[
        styles.buttonContainer,
        { backgroundColor: theme.colors.primary100 }
      ]}
      {...rest}
    >
        <Text style={[
          { fontSize, fontWeight: 'bold' },
          {  color: theme.colors.primary300 }
        ]}>
          { title }
        </Text>
        <Text style={{ fontSize }}>
          { (value === null || !value || value === 0) ? 'Não inf.' : value }
        </Text>
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',

    paddingVertical: 5,
    paddingHorizontal: 10,

    borderRadius: 10
  }
})