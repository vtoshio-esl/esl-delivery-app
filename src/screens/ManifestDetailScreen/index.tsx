import React, { useEffect, useMemo, useState } from 'react';
import { 
  ActivityIndicator,
  Text,
  View,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootNativeStackScreenProps } from '../../navigation/RootNavigator';
import { FlashList } from '@shopify/flash-list';

import { useStores } from '../../stores/useStores';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../themes/AppPaperTheme';
import { styles } from './styles';

import { ToastMessage } from '../../helpers/toastMessage';
import { ApiError } from '../../services/api/errors';

import { EslButton } from '../../components/shared/EslButton';
import { LabeledValue } from '../../components/LabeledValue';
import { ManifestItemCard } from '../../components/ManifestItemCard';
import { EslModal } from '../../components/EslModal';
import { EslTextInput } from '../../components/shared/EslTextInput';

type Props = RootNativeStackScreenProps<'manifestDetail'>;

export const ManifestDetailScreen = observer(function ManifestDetailScreen( { navigation, route }: Props) {
  const manifestId = route.params.manifestId;
  const manifestSequenceCode = route.params.sequenceCode;

  const theme = useTheme<AppTheme>();
  
  const { manifestStore } = useStores();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [commentsVisible, setCommentsVisible] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const manifest = manifestStore.selectedManifest;
  const manifestItems = manifest?.allManifestItems;

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return manifestItems;

    return manifestItems?.filter((item) => {
      const cte = item.freight?.cte_number?.toString() ?? '';
      const draft = item.freight?.draft_number?.toString() ?? '';

      return cte.includes(query) || draft.includes(query);
    })
  }, [search, manifestItems])

  useEffect(() => {
    let isActive = true;

    const loadManifest = async () => {
      try {
        await manifestStore.fetchSelectedManifest(manifestId);
      } catch (e) {
        console.log('[ManifestDetail]', e);
        if (!isActive) return;
        const message = e instanceof ApiError ? e.message : 'Erro ao carregar dados do manifesto.'
        
        ToastMessage.error(`Manifest ${manifestSequenceCode}`, message);
        navigation.goBack();
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    loadManifest();
    return () => { isActive = false; };
  }, [manifestStore, manifestSequenceCode, manifestId, navigation])
  
  if (!manifest || isLoading) {
    return (
      <SafeAreaView style={[
        styles.loadingContainer
      ]}>
        <ActivityIndicator color={theme.colors.primary300} size={60} />
        <Text style={[
          styles.loadingText,
          { color: theme.colors.primary300 }
        ]}>
          Carregando dados do manifesto
        </Text>
      </SafeAreaView>
    )
  }

  const renderDatesCard = (title: string, value: string | null) => (
    <View style={[
      styles.datesCardContainer,
      { backgroundColor: theme.colors.success }
    ]}>
      <Text style={
        { fontWeight: 'bold', color: theme.colors.white }
      }>
        { title }
      </Text>
      <Text style={
        { color: theme.colors.white }
      }>
        { (value) ? value : '-' }
      </Text>
    </View>
  )

  return (
    <SafeAreaView style={[
      styles.screenContainer,
      { backgroundColor: theme.colors.background }
    ]}>
      <EslModal
        title='Comentários do TMS' 
        visible={commentsVisible}
        onDismiss={() => setCommentsVisible(false)}
      >
        { manifest.mobile_comments && (
          <Text>
            { manifest.mobile_comments }
          </Text>
        )} 
        { !manifest.mobile_comments && (
          <Text style={{ color: theme.colors.textSecondary }}>
            Nenhum comentário fornecido pelo TMS.
          </Text>
        )}
      </EslModal>
      <View style={styles.serviceInformationContainer}>
        <View style={styles.datesContainer}>
          {(!manifest.mobile_accepted_at) ? (
            <EslButton 
              title='Aceitar Serviço'
              icon='thumbs-up' 
              fontSize={14}
              style={{ flex: 1 }}
              backgroundColor={theme.colors.warning}
            />) : renderDatesCard('Serviço aceito', manifest.getMobileAcceptedAt) }
          
          {(!manifest.departured_at) ? (
            <EslButton 
              title='Iniciar Serviço'
              icon='truck'
              fontSize={14}
              style={{ flex: 1 }}
              backgroundColor={theme.colors.warning} 
            />) : renderDatesCard('Serviço iniciado', manifest.getDeparturedAt) }
        </View>

        <View style={styles.topDataContainer}>
          <View style={styles.manifestDataContainer}>
            <LabeledValue 
              title='Veículo'
              value={manifest.vehicle_license_plate}
              titleColor={theme.colors.primary300}
            />
            <LabeledValue 
              title='Data do Manifesto'
              value={manifest.getServiceDate}
              titleColor={theme.colors.primary300}
            />
          </View>

          <EslButton
            fontSize={20}
            lightTitle={true}
            icon='message-circle-warning'
            onPress={() => setCommentsVisible(true)}
          />
        </View>
      </View>
      
      <EslTextInput
        label='Pesquisar'
        icon='search'
        placeholder='Ex: N° CT-e, N° Minuta' 
        onChangeText={setSearch}
        style={styles.searchBar}
        textInputStyle={{ paddingHorizontal: 10, paddingVertical: 5 }}
      />
      <FlashList 
        data={filteredItems}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 15, }}>
            Nenhum serviço foi encontrado.
          </Text>
        }
        renderItem={({ item }) => (
          <ManifestItemCard
            manifestItem={item}
            documentNumber={item.freight?.documentNumber}
            mapsLabel={item.recipient?.name}
            latitude={item.recipient?.main_address.lat}
            longitude={item.recipient?.main_address.lng}
          />
        )}
      />
    </SafeAreaView>
  );
})

