import React from 'react';
import { observer } from 'mobx-react-lite';
import { 
  Alert,
  Image,
  Linking,
  Text, 
  View 
} from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { launchImageLibraryAsync, useMediaLibraryPermissions } from 'expo-image-picker';

import { styles } from './styles';
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

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [galleryPermission, requestGalleryPermission] = useMediaLibraryPermissions();   
  const service = deliveryDraftStore.selectedService;
  
  const openCamera = (kind: CameraKind) => {
    navigation.navigate('camera', { kind })
  }

  const openGallery = async (kind: CameraKind) => {
    const result = await launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    }) 

    if (!result.canceled) {
      if (kind === 'deliveryReceipt') 
         deliveryDraftStore.setDeliveryReceipt(result.assets[0].uri);
      else 
        deliveryDraftStore.setAttachment(result.assets[0].uri); 
    }
  }

  const handleRedirectCamera = async (kind: CameraKind) => {
    if (cameraPermission?.granted) {
      return openCamera(kind);
    }

    if (cameraPermission?.canAskAgain !== false) {
      const result = await requestCameraPermission();
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

  const handleOpenGallery = async (kind: CameraKind) => {
    if (galleryPermission?.granted) {
      return openGallery(kind);
    }

    if (galleryPermission?.canAskAgain !== false) {
      const result = await requestGalleryPermission();
      
      if (result.granted) 
        return openGallery(kind);
      if (result.canAskAgain) 
        return;
    }

    Alert.alert(
      'Galeria bloqueada',
      'Para acessar fotos de comprovantes pela galeria, libere o acesso à galeria nas configurações do aparelho',
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
                onPress={() => handleOpenGallery(kind)}
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
