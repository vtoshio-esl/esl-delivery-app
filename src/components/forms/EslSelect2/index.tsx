import React, { useMemo, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Text,
  Pressable, 
} from 'react-native';
import Lucide from '@react-native-vector-icons/lucide';
import { LucideIconName } from '@react-native-vector-icons/lucide';

import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../../themes/AppPaperTheme';

import { EslModal } from '../../EslModal';
import { EslTextInput } from '../EslTextInput';
import { FlashList, FlashListProps } from '@shopify/flash-list';

export interface EslSelectOption {
  label: string;
  value: number;
}

export interface EslSelect2Props {
  label?: string;
  value?: string | number | null;
  labelFontSize?: number;
  textFontSize?: number;
  labelColor?: string;
  icon?: LucideIconName;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  modalTitle?: string;
  options?: EslSelectOption[];
  emptyListComponent?: FlashListProps<EslSelectOption>['ListEmptyComponent'];
  onChange?: (v: number) => void;
}

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export function EslSelect2(props: EslSelect2Props) {
  const theme = useTheme<AppTheme>();
  const {
    label,
    value,
    labelFontSize = 12,
    textFontSize = 14,
    labelColor = theme.colors.textSecondary,
    icon,
    placeholder = 'Selecionar...',
    searchable,
    searchPlaceholder = 'Pesquisar...',
    options = [],
    emptyListComponent,
    onChange
  } = props;

  const [visible, setVisible] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  
  const filtered = useMemo(() => {
    const term = normalize(search.trim());
    if (!searchable || !term) return options;

    return options.filter((opt) => normalize(opt.label).includes(term))
  }, [searchable, options, search])

  const selected = options.find((o) => o.value === value) ?? null;

  // Handlers
  const handleOpen = () => setVisible(true);
  
  const handleClose = () => {
    setSearch('');
    setVisible(false);
  }

  const handleSelect = (item: EslSelectOption) => {
    onChange?.(item.value);
  }

  // Renders
  const renderEmptyList = () => {
    return (
      <Text style={[
        styles.emptyListText,
        { color: theme.colors.textSecondary }
      ]}>
        Nenhum item encontrado...
      </Text>
    )
  }
  const renderOption = (item: EslSelectOption) => {
    const isSelected = item.value === value;
    
    return (
      <Pressable
        style={[
          styles.optionView,
          isSelected && { backgroundColor: theme.colors.primary100 }
        ]}
        onPress={() => handleSelect(item)}
        android_ripple={{ color: theme.colors.primary100 }}
      >
        <Lucide 
          name={isSelected ? 'circle-check' : 'circle' } 
          size={textFontSize + 6}
          color={isSelected ? theme.colors.primary300 : theme.colors.gray300 }
        />
        <Text 
          numberOfLines={2}
          style={[
            styles.optionText,
            isSelected && { color: theme.colors.primary300 }
          ]}
        >
          { item.label }
        </Text>
      </Pressable>
    )
  }

  const renderModal = () => {
    return (
      <EslModal
        title={label}
        visible={visible}
        onDismiss={handleClose}
      >
        { searchable && (
          <EslTextInput 
            label='Pesquisar'
            icon='search'
            placeholder={searchPlaceholder}
            value={search}
            onChangeText={setSearch}
            style={{ marginBottom: 5 }}
          />
        )}
        <View style={{ height: 300 }}>
          <FlashList 
            data={filtered}
            keyExtractor={(item) => String(item.value)}
            renderItem={({item}) => renderOption(item) }
            ListEmptyComponent={emptyListComponent ?? renderEmptyList()}
            ItemSeparatorComponent={() => (
              <View style={[ styles.separator, { backgroundColor: theme.colors.divider }]}/>
            )}
          />
        </View>
      </EslModal>
    )
  }

  const renderLabel = () => {
    if (!label) return null;

    return (
      <View style={[
        styles.labelContainer
      ]}>
        { icon && 
          <Lucide name={icon} size={labelFontSize} color={labelColor} />
        }
        <Text style={[
          styles.labelText,
          { color: labelColor, fontSize: labelFontSize }
        ]}>
          { label }
        </Text>
      </View>
    )
  }

  const renderTrigger = () => {
    return (
      <TouchableOpacity 
        onPress={handleOpen}
        style={[
          styles.triggerContainer,
          { backgroundColor: theme.colors.background }
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            { fontSize: textFontSize }
          ]}
        >
          { selected?.label ?? placeholder }
        </Text>
        <Lucide name='chevron-down' size={textFontSize + 4} color={labelColor} />
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.inputGroup}>
      { renderModal() }
      { renderLabel() }
      { renderTrigger() }
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    gap: 5,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  labelText: {
    fontWeight: 'bold',
    letterSpacing: 1.3
  },
  triggerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    elevation: 5,
    borderRadius: 10,
    padding: 10,
  },
  optionView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    
    minHeight: 48,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  optionText: {
    flex: 1,
  },
  separator: {
    height: 1,
    marginHorizontal: 12,
  },
  emptyListText: {
    width: '100%',
    textAlign: 'center',
    paddingVertical: 10,
  },
})