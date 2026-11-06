import React from 'react';
import { 
  StyleSheet, 
  StyleProp, 
  ViewStyle,
  View, 
  Text
 } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../themes/AppPaperTheme';

export interface LabeledValueProps {
  title: string;
  value: string | number | null | undefined;
  fontSize?: number;
  titleColor?: string;
  fallback?: string;
  style?: StyleProp<ViewStyle>;
}

export function LabeledValue(props: LabeledValueProps) {
  const theme = useTheme<AppTheme>();
  
  const {
    title,
    value,
    fontSize = 14,
    titleColor = theme.colors.textPrimary,
    style,
    fallback = '-',
    ...rest
  } = props;
  
  return (
    <View style={[style, styles.container]} {...rest}>
      <Text style={[
        styles.title, 
        { color: titleColor, fontSize }
      ]}>
        { title }
      </Text>
      <Text style={{ fontSize }}>
        { value ?? fallback }
      </Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontWeight: 'bold'
  }
})