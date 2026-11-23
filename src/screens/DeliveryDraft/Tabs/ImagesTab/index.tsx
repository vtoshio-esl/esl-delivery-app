import { observer } from 'mobx-react-lite';
import React from 'react';
import { 
  Alert,
  Image,
  Linking,
  StyleSheet, 
  Text, 
  View 
} from 'react-native';
import { useCameraPermissions } from 'expo-camera';

// import { styles } from './styles';
import { useTheme } from 'react-native-paper';
import { useStores } from '../../../../stores/useStores';
import { AppTheme } from '../../../../themes/AppPaperTheme';
import { CameraKind } from '../../../../navigation/RootNavigator';
import { DeliveryDraftTabScreenProps } from '../../../../navigation/TopTabsNavigation';

import { EslButton } from '../../../../components/forms/EslButton';
import Lucide from '@react-native-vector-icons/lucide';


export const ImagesTab = observer(({ navigation }: DeliveryDraftTabScreenProps<'images'>) => {
  const theme = useTheme<AppTheme>();
  const { deliveryDraftStore } = useStores();

  const [permission, requestPermission] = useCameraPermissions();
  const service = deliveryDraftStore.selectedService;
  
  const openCamera = (kind: CameraKind) => {
    navigation.navigate('camera', { kind })
  }

  const handleRedirectCamera = async (kind: CameraKind) => {
    if (permission?.granted) {
      return openCamera(kind);
    }

    if (permission?.canAskAgain !== false) {
      const result = await requestPermission();
      if (result.granted) return openCamera(kind);
      if (result.canAskAgain) return
    }

    Alert.alert(
      'Câmera bloqueada',
      'Para fotografar o comprovante, libere o acesso à câmera nas configurações do aparelho.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Abrir configurações', onPress: () => Linking.openSettings() }
      ]
    )
  }

  const renderImageView = (
    title: string,
    imageUri: string | null,
    kind: CameraKind
  ) => {
    return (
      <View style={[
        styles.imageSectionContainer,
        { backgroundColor: theme.colors.background }
      ]}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: theme.colors.primary300
        }}>
          { title }
        </Text>

        <View style={styles.photoContainer}>
          { imageUri && (
            <Image 
              source={{  
                uri: imageUri
              }}
              style={styles.imageSize}
              resizeMode='contain' 
            />
          )}
          { !imageUri && (
            <View style={[
              styles.noImageContainer,
              styles.imageSize,
              { backgroundColor: theme.colors.primary100 }
            ]}>
              <Lucide name='image-off' size={35} color={theme.colors.primary400} />
              <Text style={[
                  styles.noImageText,
                  { color: theme.colors.primary400 }
                ]}
              >
                { service?.hasOccurrence 
                  ? 'Foto não pôde ser trazida do TMS.'
                  : 'Foto ainda não foi capturada.'
                }
              </Text>
            </View>
          )}
        </View>

        <View style={styles.buttonGroupContainer}>
          { !service?.hasOccurrence && (
            <>
              <EslButton 
                title='Tirar Foto' 
                icon='camera' 
                style={{ width: '50%' }}
                lightTitle 
                onPress={() => handleRedirectCamera(kind)}
              />
              <EslButton 
                title='Galeria'
                icon='images'
                style={{ width: '50%' }}
                lightTitle
              />
            </>
          ) }
        </View>
      </View>
    )
  }

  if (service?.kind === 'unloading_recipient') {
    return (
      <View style={styles.unloadingRecipientsContainer}>
        <Lucide name='ban' size={30} color={theme.colors.danger} />

        <Text style={[
          styles.unloadingRecipientsText,
          { color: theme.colors.textSecondary }
        ]}>
          Imagens não são permitidas para itens de transferência.
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.imagesTabContainer}>
      { renderImageView(
          'Comprovante de Entrega', 
          deliveryDraftStore.deliveryReceipt,
          'deliveryReceipt'
        ) }
      { renderImageView(
          'Anexos',
          deliveryDraftStore.attachment,
          'attachment',
      ) }
    </View>
  );
})

export const styles = StyleSheet.create({
  imagesTabContainer: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    gap: 10
  },
  imageSectionContainer: {
    gap: 5,
    padding: 20,
    elevation: 3,
    borderRadius: 15,
  },
  photoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  imageSize: {
    height: 150,
    width: '100%',
    borderRadius: 10,
  },
  noImageContainer: {
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,

    padding: 20,
    borderRadius: 10,
  },
  noImageText: {
    fontSize: 16,
    textAlign: 'center'
  },
  buttonGroupContainer: {
    flexDirection: 'row',
    gap: 5
  },
  unloadingRecipientsContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    gap: 10,
  },
  unloadingRecipientsText: { 
    width: '80%', 
    textAlign: 'center',
    fontSize: 16,
  }
});