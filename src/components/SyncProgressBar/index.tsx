import {
  StyleSheet,
  Text,
  View,
  ViewProps,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../themes/AppPaperTheme';

export interface SyncProgressBarProps extends ViewProps {
  /** Progresso entre 0 e 1 (ex.: 0.5 = 50%) */
  progress: number;
  label?: string;
  showPercentage?: boolean;
  height?: number;
}

export function SyncProgressBar(props: SyncProgressBarProps) {
  const theme = useTheme<AppTheme>();

  const {
    progress,
    label = 'Sincronização',
    showPercentage = true,
    height = 10,
    style,
    ...rest
  } = props;

  // Garante que o valor fique entre 0 e 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const percentage = Math.round(clampedProgress * 100);

  return (
    <View style={[styles.container, style]} {...rest}>
      <View style={styles.header}>
        <Text style={[styles.labelText, { color: theme.colors.primary300 }]}>
          { label }
        </Text>
        { showPercentage && (
          <Text style={[styles.percentageText, { color: theme.colors.primary300 }]}>
            { percentage }%
          </Text>
        )}
      </View>

      <View
        style={[
          styles.track,
          { height, borderRadius: height / 2, backgroundColor: theme.colors.primary100 },
        ]}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: percentage }}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              borderRadius: height / 2,
              backgroundColor: theme.colors.primary300,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  labelText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
