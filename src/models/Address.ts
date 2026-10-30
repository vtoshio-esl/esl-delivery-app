import { types, SnapshotIn, SnapshotOut, Instance } from "mobx-state-tree";
import { CityModel } from "./City";

export const AddressModel = types
    .model('Address')
    .props({
        id: types.optional(types.number, 0),
        line_1: types.maybeNull(types.string),
        number: types.maybeNull(types.string),
        line_2: types.maybeNull(types.string),
        postal_code: types.maybeNull(types.string),
        neighborhood: types.maybeNull(types.string),
        lat: types.maybeNull(types.string),
        lng: types.maybeNull(types.string),
        is_default: types.optional(types.boolean, false),
        city: types.optional(CityModel, {}),
    })

export interface Address extends Instance<typeof AddressModel> {};
export interface AddressSnapshotIn extends SnapshotIn<typeof AddressModel> {};
export interface AddressSnapshotOut extends SnapshotOut<typeof AddressModel> {};
export const createDefaultAddressModel = () => types.optional(AddressModel, {});