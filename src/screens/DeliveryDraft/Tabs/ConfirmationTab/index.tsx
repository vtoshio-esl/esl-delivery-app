import React from 'react';
import { Text, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import Lucide from '@react-native-vector-icons/lucide';

import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../../../themes/AppPaperTheme';
import { useStores } from '../../../../stores/useStores';
import { styles } from './styles';

import { EslButton } from '../../../../components/forms/EslButton';
import { ToastMessage } from '../../../../helpers/toastMessage';
import { ApiError } from '../../../../services/api/errors';
import { DeliveryDraftTabScreenProps } from '../../../../navigation/TopTabsNavigation';

const NO_IMAGE_FROM_TMS_MESSAGE = 'Verificar imagem no TMS.'

export const ConfirmationTab = observer(({ navigation }: DeliveryDraftTabScreenProps<'confirmation'>) => {
  const theme = useTheme<AppTheme>();
  const { deliveryDraftStore, manifestStore, occurrencesStore } = useStores();

  const service = deliveryDraftStore.selectedService;
  const selectedOccurrence = occurrencesStore.occurrenceFromId(deliveryDraftStore.occurrenceId);
  const selectedManifest = manifestStore.selectedManifest;

  // Validações e envio
  const validateOccurrenceData = (): boolean => {
    if (!selectedOccurrence) {
      ToastMessage.info('Occorrência', 'É necessário selecionar uma ocorrência para realizar a baixa.')
      return false;
    }

    if (selectedOccurrence?.require_receiver && !deliveryDraftStore.hasReceiverData) {
      ToastMessage.error('Baixa', 'É necessário preencher o nome e documento do recebedor.')
      return false;
    }

    if (selectedOccurrence?.require_photo_on_mobile && !deliveryDraftStore.hasPhotoTaken) {
      ToastMessage.error('Baixa', 'É necessário enviar ao menos uma foto.')
      return false;
    }
    
    return true;
  }
  
  const handleSubmit = async () => {
    if (!validateOccurrenceData()) return;

    try {
      await deliveryDraftStore.submitDelivery();
      ToastMessage.success('Baixa', 'Baixa realizada com sucesso.')
    } catch (e) {
      console.log(e);
      const message = e instanceof ApiError ? e.message : 'Erro ao realizar envio de dados da baixa.';
      ToastMessage.error('Baixa', message);
    }
  }

  const handleExit = async () => {
    try {
      await deliveryDraftStore.confirmExitedAt();
      ToastMessage.success('Saída', 'Saída registrada com sucesso.')

      if (selectedManifest) {
        navigation.popTo('manifestDetail', { 
          manifestId: selectedManifest.id,
          sequenceCode: selectedManifest.sequence_code,
        });
      } else {
        navigation.popTo('home', { screen: 'manifests' });
      }
    } catch (e) {
      console.log(e);
      const message = e instanceof ApiError ? e.message : 'Erro ao registrar saída do local.';
      ToastMessage.error('Saída', message);
    }
  }

  // Renders
  const renderRequiredItem = (
    label: string, 
    value: string | number | null | undefined, 
    placeholder: string,
    date?: string,
  ) => {
    const color = (value) ? theme.colors.success : theme.colors.warning; 

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10}}>
        <Lucide name='circle-check' size={40} color={color}/>
        <View>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.colors.primary300 }}>
            { label }
          </Text>
          
          { value ? (
            <Text>
              { value }
            </Text>
          ) : (
            <Text>
              { placeholder }
            </Text>
          )}

          { date && (
            <Text>
              Data: { date }
            </Text>
          )}
        </View>
      </View>
    )
  }

  const renderRequiredPhoto = (
    label: string, 
    photoUri: string | number | null | undefined, 
    placeholder: string,
    date?: string,
  ) => {
    const color = (photoUri) ? theme.colors.success : theme.colors.warning; 

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10}}>
        <Lucide name='circle-check' size={40} color={color}/>
        <View>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.colors.primary300 }}>
            { label }
          </Text>
          
          { photoUri ? (
            <Text>
              { label } capturada com sucesso.
            </Text>
          ) : (
            <Text>
              { placeholder }
            </Text>
          )}

          { date && (
            <Text>
              Data: { date }
            </Text>
          )}
        </View>
      </View>
    )
  };

  return (
    <View style={styles.confirmationTabContainer}>
      <View style={styles.confirmationHeader}>
        <Lucide name='check-check' size={18} color={theme.colors.primary300}/>
        <Text style={[
          styles.sectionTitleText,
          { color: theme.colors.primary300 }
        ]}>
          Confirmação de Dados
        </Text>
      </View>

      <View style={[
        styles.confirmationBodyContainer,
        { backgroundColor: theme.colors.background }
      ]}>
        { renderRequiredItem(
            'Ocorrência', 
            selectedOccurrence?.description, 
            'Ocorrência ainda não foi selecionada.',
            deliveryDraftStore.formattedOccurrenceAt
        )}
        { renderRequiredItem(
          'Recebedor',
          deliveryDraftStore.receiverName?.trim(),
          'Recebedor não foi preenchido.'
        )}
        { renderRequiredItem(
          'Documento do Recebedor',
          deliveryDraftStore.receiverDocument?.trim(),
          'Documento não foi preenchido.'
        )}
        { renderRequiredPhoto(
          'Comprovante de Entrega',
          deliveryDraftStore.deliveryReceipt,
          !(service?.hasOccurrence) ? 'Comprovante ainda não foi capturado.' : NO_IMAGE_FROM_TMS_MESSAGE
         )}
        { renderRequiredPhoto(
          'Assinatura',
          deliveryDraftStore.signature,
          !(service?.hasOccurrence) ? 'Assinatura ainda não foi capturada.' : NO_IMAGE_FROM_TMS_MESSAGE
        )}
        { renderRequiredPhoto(
          'Anexo',
          deliveryDraftStore.attachment,
          !(service?.hasOccurrence) ? 'Anexo ainda não foi capturado.' : NO_IMAGE_FROM_TMS_MESSAGE
        )}


        { !service?.hasOccurrence && (
          <View style={{ gap: 5 }}>
            { selectedOccurrence?.require_receiver && !deliveryDraftStore.hasReceiverData && (
              <Text style={[
                styles.validationWarningText,
                { color: theme.colors.danger }
              ]}>
                Essa ocorrência obriga o envio dos dados do recebedor.
              </Text>
            )}

            { selectedOccurrence?.require_photo_on_mobile && !deliveryDraftStore.hasPhotoTaken && (
              <Text style={[
                styles.validationWarningText,
                { color: theme.colors.danger }
              ]}>
                Essa ocorrência obriga o envio de pelo menos uma imagem (comprovante, assinatura ou anexo).
              </Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.confirmationFooter}>
        <View style={{ flexDirection: 'row', gap: 5 }}>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 12,
            color: theme.colors.primary300
          }}>
            Quantidade de itens: 
          </Text>
          <Text style={{ fontSize: 12, }}>
            { deliveryDraftStore.countSelectedServices } item(s) selecionado(s)
          </Text>
        </View>

        { !service?.hasOccurrence && (
          <EslButton 
            title='Confirmar Baixa'
            icon='check'
            lightTitle
            disabled={!(deliveryDraftStore.occurrenceId !== null && deliveryDraftStore.occurrenceAt !== null)}
            onPress={async () => await handleSubmit()}
          />
        )}
        { service?.canRegisterExit && service?.hasOccurrence && !(service.hasExited) && (
          <EslButton 
            title='Confirmar Saída do Local'
            icon='door-open'
            lightTitle
            disabled={!(deliveryDraftStore.occurrenceId !== null && deliveryDraftStore.occurrenceAt !== null)}
            onPress={async () => await handleExit()}
          />
        )}
      </View>
    </View>
  );
})