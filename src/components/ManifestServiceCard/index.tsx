import { observer } from 'mobx-react-lite';
import { ManifestItemCard } from '../ManifestItemCard';
import { ManifestUnloadingRecipientCard } from '../ManifestUnloadingRecipientCard';
import { TouchableOpacityProps } from 'react-native';
import { ManifestService } from '../../models/ManifestServices/types';
import { useStores } from '../../stores/useStores';

export interface ManifestServiceCardProps extends TouchableOpacityProps {
  service: ManifestService,
  mapsLabel?: string,
  simplified?: boolean,
  showNavigate?: boolean,
  fontSize?: number,
  titleFontSize?: number,
  latitude?: string | null,
  longitude?: string | null
}

export const ManifestServiceCard = observer((props: ManifestServiceCardProps) => {
  const {
    service,
    simplified,
    fontSize,
    titleFontSize,
    ...componentProps
  } = props;
  
  const { manifestStore } = useStores();
  const errors = manifestStore.errorsFor(service);

  if (service.kind === 'unloading_recipient') {
    return (
      <ManifestUnloadingRecipientCard 
        unloadingRecipient={service}
        simplified={simplified}
        errors={errors}
        fontSize={fontSize}
        titleFontSize={titleFontSize}
        { ...componentProps } 
      />
    )
  }
  
  return (
    <ManifestItemCard 
      manifestItem={service}
      simplified={simplified}
      documentNumber={service.freight?.documentNumber}
      errors={errors}
      fontSize={fontSize}
      titleFontSize={titleFontSize}
      { ...componentProps }
    />
  )
})