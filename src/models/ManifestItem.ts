import { types, SnapshotIn, SnapshotOut, Instance } from "mobx-state-tree";
import { getManifestItemTypeLabel, MANIFEST_ITEM_TYPES, ManifestItemType } from "./types/ManifestItemType";
import { FreightModel } from "./Freight";
import { PersonModel } from "./Person";

export interface Sender {
    id: number,
    name: string | null,
    nickname: string | null,
}

export const ManifestItemModel = types
    .model('ManifestItem')
    .props({
        id: types.optional(types.identifierNumber, 0),
        type: types.optional(
            types.union(
                types.enumeration<ManifestItemType>('ManifestItemType', [...MANIFEST_ITEM_TYPES]),
                types.string,
            ), 
            'ManifestItem::Delivery'
        ),
        attempt_number: types.optional(types.number, 0),
        position: types.optional(types.number, 0),
        comments: types.maybeNull(types.string),

        manifest_id: types.optional(types.number, 0),
        manifestable_type: types.optional(types.string, 'Freight::Base'),
        manifestable_id: types.optional(types.number, 0),
        recipient_id: types.maybeNull(types.number),
        
        // Associações
        freight: types.maybeNull(FreightModel),
        recipient: types.maybeNull(PersonModel),
        sender: types.maybeNull(types.frozen<Sender>()),
        
        // Data Início/Fim entrega
        destination_start_at: types.maybeNull(types.string),
        destination_finish_at: types.maybeNull(types.string),
        
        // Validações
        payer_requires_volume_check_on_mobile: false,

        // Mobile flags
        mobile_image: types.optional(types.boolean, false),
        mobile_receipt: types.optional(types.boolean, false),
        mobile_occurrence: types.optional(types.boolean, false),

        // Volumes
        read_volumes_count: types.optional(types.number, 0),

        // Geolocalização
        latitude: types.maybeNull(types.number),
        longitude: types.maybeNull(types.number),
        arrived_latitude: types.maybeNull(types.number),
        arrived_longitude: types.maybeNull(types.number),
        exited_latitude: types.maybeNull(types.number),
        exited_longitude: types.maybeNull(types.number),

        created_at: types.optional(types.string, ''),
        updated_at: types.optional(types.string, ''),
    })
    .views((self) => ({
        get isTransfer(): boolean {
            return self.type === 'ManifestItem::Transfer'
        },
        get deliveryAddress() {
            return self.recipient?.main_address;
        },
        get typeLabel() {
            return getManifestItemTypeLabel(self.type);
        }
    }))

export interface ManifestItem extends Instance<typeof ManifestItemModel>{};
export interface ManifestItemSnapshotIn extends SnapshotIn<typeof ManifestItemModel>{};
export interface ManifestItemSnapshotOut extends SnapshotOut<typeof ManifestItemModel>{};
