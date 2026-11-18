import { observer } from 'mobx-react-lite';
import { ManifestItemCard } from '../ManifestItemCard';
import { ManifestUnloadingRecipientCard } from '../ManifestUnloadingRecipientCard';
import { TouchableOpacityProps } from 'react-native';
import { ManifestService } from '../../models/ManifestServices/types';

export interface ManifestServiceCardProps extends TouchableOpacityProps {
  service: ManifestService,
  mapsLabel?: string,
  simplified?: boolean,
  showNavigate?: boolean,
  latitude?: string | null,
  longitude?: string | null
}

export const ManifestServiceCard = observer((props: ManifestServiceCardProps) => {
  const {
    service,
    simplified,
    ...componentProps
  } = props;

  if (service.kind === 'unloading_recipient') {
    return (
      <ManifestUnloadingRecipientCard 
        unloadingRecipient={service}
        simplified={simplified}
        { ...componentProps } 
      />
    )
  }
  
  return (
    <ManifestItemCard 
      manifestItem={service}
      simplified={simplified}
      documentNumber={service.freight?.documentNumber}
      { ...componentProps }
    />
  )
})