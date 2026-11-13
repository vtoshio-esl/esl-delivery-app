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
import { EslTextInput } from '../../components/shared/EslTextInput';
import { ManifestCommentsModal } from '../../components/ManifestCommentsModal';
import { ManifestKmModal } from '../../components/ManifestKmModal';
import { ManifestServiceCard } from '../../components/ManifestServiceCard';
import { ManifestService, ManifestServiceKind } from '../../models/ManifestServices/types';

type Props = RootNativeStackScreenProps<'manifestDetail'>;

export const ManifestDetailScreen = observer(function ManifestDetailScreen( { navigation, route }: Props) {
  const manifestId = route.params.manifestId;
  const manifestSequenceCode = route.params.sequenceCode;

  const theme = useTheme<AppTheme>();
  
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [commentsVisible, setCommentsVisible] = useState<boolean>(false);
  const [departureKmVisible, setDepartureKmVisible] = useState<boolean>(false);

  const { manifestStore, deliveryDraftStore } = useStores();
  const manifest = manifestStore.selectedManifest;
  const manifestItems = manifest?.allManifestItems;

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return manifestItems;

    return manifestItems?.filter((item) => {
      if (item.kind === 'unloading_recipient') {
        const name = item.recipient?.name?.toLowerCase() ?? '';
        const nickname = item.recipient?.name?.toLowerCase() ?? '';
        
        return name.includes(query) || nickname.includes(query);
      }
      
      const cte = item.freight?.cte_number?.toString() ?? '';
      const draft = item.freight?.draft_number?.toString() ?? '';
      const nickname = item.recipient?.nickname?.toLowerCase() ?? '';

      return cte.includes(query) || draft.includes(query) || nickname.includes(query);
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
        
        ToastMessage.error(`Manifesto ${manifestSequenceCode}`, message);
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

  // Handlers
  const handleAcceptManifest = async () => {
    try {
      await manifestStore.acceptManifest(manifestId, new Date().toISOString());
    } catch (e) {
      console.log(e)
      const message = e instanceof ApiError ? e.message : 'Erro ao aceitar o serviço'
    
      ToastMessage.error(`Manifesto ${manifestSequenceCode}`, message)
    }
  }
  
  const handleStartTransport = async (km: number) => {
    try {
      await manifestStore.startTransportWithKm(manifestId, km);
      setDepartureKmVisible(false);
    } catch (e) {
      console.log(e)
      const message = e instanceof ApiError ? e.message : 'Erro ao iniciar o serviço'
    
      ToastMessage.error(`Manifesto ${manifestSequenceCode}`, message)
    }
  }

  const handleSelectItem = (service: ManifestService) => {
    const id = service.id;
    const kind = service.kind;

    deliveryDraftStore.clearSelectedServices();
    deliveryDraftStore.selectService({ id, kind });
    
    if (service.hasArrived) {
      navigation.navigate('deliveryDraft', { manifestSequenceCode });
    } else {
      navigation.navigate('manifestItemArrival', {
        manifestId,
        manifestSequenceCode,
        itemId: id,
        itemKind: kind,
      });
    }
  }

  // SubComponentes

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
      <ManifestCommentsModal 
        comments={manifest.mobile_comments}
        visible={commentsVisible}
        onDismiss={() => setCommentsVisible(false)}
      />

      <ManifestKmModal 
        kind='departure'
        label={`Manifesto ${manifestSequenceCode}`}
        visible={departureKmVisible}
        onDismiss={() => setDepartureKmVisible(false)}
        onConfirm={handleStartTransport}
      />

      <View style={styles.serviceInformationContainer}>
        <View style={styles.datesContainer}>
          {(!manifest.isAccepted) ? (
            <EslButton 
              title='Aceitar Serviço'
              icon='thumbs-up' 
              fontSize={14}
              style={{ flex: 1 }}
              backgroundColor={theme.colors.warning}
              onPress={handleAcceptManifest}
            />) : renderDatesCard('Serviço aceito', manifest.getMobileAcceptedAt) }
          
          {(!manifest.isStarted) ? (
            <EslButton 
              title='Iniciar Serviço'
              icon='truck'
              fontSize={14}
              style={{ flex: 1 }}
              backgroundColor={theme.colors.warning} 
              disabled={!manifest.canStartTransport}
              onPress={() => setDepartureKmVisible(true) }
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
              title='Data Serviço'
              value={manifest.getServiceDate}
              titleColor={theme.colors.primary300}
            />
            <LabeledValue 
              title='KM Inicial'
              value={manifest.vehicle_departure_km === 0 ? 'Não inf.' : manifest.vehicle_departure_km}
              titleColor={theme.colors.primary300}
            />
            <LabeledValue 
              title='KM Final'
              value={manifest.closing_km === 0 ? 'Não inf.' : manifest.closing_km}
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
          <ManifestServiceCard
            service={item}
            disabled={!manifest.isStarted}
            mapsLabel={item.recipient?.name}
            latitude={item.recipient?.main_address.lat}
            longitude={item.recipient?.main_address.lng}
            onPress={() => handleSelectItem(item)}
          />
        )}
      />
    </SafeAreaView>
  );
})

