import { Instance, types, SnapshotIn, SnapshotOut } from "mobx-state-tree";
import { CorporationModel } from "./Corporation";

export const DriverModel = types
    .model("Driver")
    .props({
        id: types.optional(types.number, 0),
        name: types.optional(types.string, ''),
        logo: types.maybeNull(types.string),
        mobile_type: types.maybeNull(types.string),
        corporation: types.optional(CorporationModel, {}),
    })

export interface Driver extends Instance<typeof DriverModel> {};
export interface DriverSnapshotIn extends SnapshotIn<typeof DriverModel> {};
export interface DriverSnapshotOut extends SnapshotOut<typeof DriverModel> {};
export const createDefaultDriverModel = () => types.optional(DriverModel, {});