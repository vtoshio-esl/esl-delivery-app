import { types, SnapshotIn, SnapshotOut, Instance } from "mobx-state-tree";
import { StateModel } from "./State";

export const CityModel = types
    .model('City')
    .props({
        id: types.optional(types.number, 0),
        name: types.optional(types.string, ''),
        ibge_code: types.maybeNull(types.string),
        capital: types.optional(types.boolean, false),
        district: types.optional(types.boolean, false),
        latitude: types.maybeNull(types.number),
        longitude: types.maybeNull(types.number),
        state: types.optional(StateModel, {}),
    })

export interface City extends Instance<typeof CityModel> {};
export interface CitySnapshotIn extends SnapshotIn<typeof CityModel> {};
export interface CitySnapshotOut extends SnapshotOut<typeof CityModel> {};
export const createDefaultCityModel = () => types.optional(CityModel, {});