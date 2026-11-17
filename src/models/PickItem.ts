import { types, SnapshotIn, SnapshotOut, Instance } from "mobx-state-tree";

export const PickItemModel = types
    .model('PickItem')
    .props({
        id: types.identifierNumber,
        comments: types.maybeNull(types.string),
        receiver_nickname: types.maybeNull(types.string),
        courier_receiver_name: types.maybeNull(types.string),
        courier_receiver_document_number: types.maybeNull(types.string),
        courier_comments: types.maybeNull(types.string),
        contact_name: types.maybeNull(types.string),

        package_id: types.maybeNull(types.number),
        package_name: types.optional(types.string, ''),
        taxed_weight: types.optional(types.string, ''),
        invoices_real_weight: types.optional(types.string, ''),
        invoices_volumes: types.optional(types.number, 0),
    })

export interface PickItem extends Instance<typeof PickItemModel>{}; 