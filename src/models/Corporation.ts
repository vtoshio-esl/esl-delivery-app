import { types, SnapshotIn, SnapshotOut, Instance } from "mobx-state-tree";
import { AddressModel } from "./Address";

export const CorporationModel = types
    .model('Corporation')
    .props({
        id: types.optional(types.number, 0),
        name: types.optional(types.string, ''),
        main_address: types.optional(AddressModel, {}),
        latitude: types.maybeNull(types.number),
        longitude: types.maybeNull(types.number)
    })

export interface Corporation extends Instance<typeof CorporationModel> {};
export interface CorporationSnapshotIn extends SnapshotIn<typeof CorporationModel> {};
export interface CorporationSnapshotOut extends SnapshotOut<typeof CorporationModel> {};
export const createDefaultCorporationModel = () => types.optional(CorporationModel, {});