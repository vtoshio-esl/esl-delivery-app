import { types, SnapshotIn, SnapshotOut, Instance } from "mobx-state-tree";

import { getManifestItemTypeLabel, MANIFEST_ITEM_TYPES, ManifestItemType } from "../types/ManifestItemType";
import { ManifestServiceBaseModel, ManifestServiceContract } from "./BaseManifestService";

import { FreightModel } from "../Freight";
import { PickModel } from "../Pick";
import { AddressModel } from "../Address";
import { formatDateTimeToLocale } from "../../helpers/dateFormat";

export interface Sender {
    id: number,
    name: string | null,
    nickname: string | null,
}

export const ManifestItemModel = ManifestServiceBaseModel
    .named('ManifestItem')
    .props({
        id: types.identifierNumber,
        type: types.optional(
            types.union(
                types.enumeration<ManifestItemType>('ManifestItemType', [...MANIFEST_ITEM_TYPES]),
                types.string,
            ), 
            'ManifestItem::Transfer'
        ),
        attempt_number: types.optional(types.number, 0),

        manifest_id: types.optional(types.number, 0),
        manifestable_type: types.optional(types.string, 'Freight::Base'),
        manifestable_id: types.maybeNull(types.number),
        recipient_id: types.maybeNull(types.number),
        
        // Associações
        sender: types.maybeNull(types.frozen<Sender>()),
        freight: types.maybeNull(FreightModel),
        pick: types.maybeNull(PickModel),
        destination_address: types.maybeNull(AddressModel),
        
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
        read_volumes_count: types.maybeNull(types.number),

        // Geolocalização
        latitude: types.maybeNull(types.number),
        longitude: types.maybeNull(types.number),
        arrived_latitude: types.maybeNull(types.number),
        arrived_longitude: types.maybeNull(types.number),
        exited_at: types.maybeNull(types.string),
        exited_latitude: types.maybeNull(types.number),
        exited_longitude: types.maybeNull(types.number),

        created_at: types.optional(types.string, ''),
        updated_at: types.optional(types.string, ''),
    })
    .views((self): ManifestServiceContract<'manifest_item'> => ({
        get kind() { return 'manifest_item' as const },
        get resourceRoute() { return 'items' as const},
    }))
    .views((self) => ({
        get isTransfer(): boolean {
            return self.type === 'ManifestItem::Transfer' && self.manifestable_type !== 'container'
        },
        get deliveryAddress() {
            return self.recipient?.main_address;
        },
        get typeLabel() {
            return getManifestItemTypeLabel(self.type);
        },
        get formattedExitedAt() {
            if (!self.exited_at) return null;

            return formatDateTimeToLocale(self.exited_at);
        },
    }))

export interface ManifestItem extends Instance<typeof ManifestItemModel>{};
export interface ManifestItemSnapshotIn extends SnapshotIn<typeof ManifestItemModel>{};
export interface ManifestItemSnapshotOut extends SnapshotOut<typeof ManifestItemModel>{};
