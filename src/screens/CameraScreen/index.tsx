import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { CameraView, CameraType } from 'expo-camera';

// import { styles } from './styles';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../themes/AppPaperTheme';
import { RootNativeStackScreenProps } from '../../navigation/RootNavigator';
import Lucide from '@react-native-vector-icons/lucide';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EslButton } from '../../components/forms/EslButton';
import { useStores } from '../../stores/useStores';

export const CameraScreen = observer(({ navigation, route }: RootNativeStackScreenProps<'camera'>) => {
  const theme = useTheme<AppTheme>();
  const { kind } = route.params;
  const { deliveryDraftStore } = useStores();

  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flashlight, setFlashlight] = useState<boolean>(false);

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.popTo('home', { screen: 'manifests' }); 
    }
  }

  const handleFacing = () => {
    return (facing === 'back') ? setFacing('front') : setFacing('back');
  }

  const handleTakePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync({
      quality: 0.7,
      base64: false,
    })

    console.log('[PHOTO] URI da foto capturada:', photo?.uri)
    console.log('[PHOTO] Tipo da foto: ', kind);

    if (photo) {
      if (kind === 'deliveryReceipt')
        deliveryDraftStore.setDeliveryReceipt(photo.uri);
      else
        deliveryDraftStore.setAttachment(photo.uri);
    }

    handleGoBack();
  }

  return (
    <View style={styles.cameraScreenContainer}>
      <CameraView 
        ref={cameraRef}
        facing={facing} 
        enableTorch={flashlight}
        style={styles.cameraView} 
      />
      
      <SafeAreaView style={styles.layoutView}>
        <View style={styles.headerContainer}>
          <Lucide 
            name='chevron-left' 
            size={40} 
            color={theme.colors.white} 
            onPress={handleGoBack}
          />
          
          <Text style={[
            styles.photoKindText,
            { color: theme.colors.white }
          ]}>
            { (kind === 'deliveryReceipt' 
              ? 'Comprovante de Entrega' 
              : 'Anexo')
            }
          </Text>
        </View>
        <View style={styles.actionsContainer}>
          <EslButton 
            icon={(flashlight) ? 'flashlight-off' : 'flashlight'}
            fontSize={25}
            lightTitle
            onPress={() => setFlashlight(!flashlight)}
          />
          
          <TouchableOpacity 
            style={[
              styles.takePhotoButton,
              { backgroundColor: theme.colors.primary100, borderColor: theme.colors.primary200 }
            ]}
            onPress={async () => await handleTakePicture()}
          />

          <EslButton 
            icon='refresh-ccw'
            fontSize={25}
            lightTitle
            onPress={handleFacing}
          />
        </View>
      </SafeAreaView>
    </View>
  );
})

const styles = StyleSheet.create({
  cameraScreenContainer: { 
    flex: 1,
    width: '100%',
  },
  cameraView: {
    flex: 1
  },
  layoutView: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    
    width: '100%',
    padding: 20,
    position: 'relative',
    top: 0,
  },
  photoKindText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1.3,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    
    gap: 20,
    width: '100%',
    position: 'relative',
    bottom: 10,
  },
  takePhotoButton: {
    height: 70,
    width: 70,
    borderRadius: '100%',
    borderWidth: 5,
  }
})