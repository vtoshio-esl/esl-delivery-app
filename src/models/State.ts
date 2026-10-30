import { types, SnapshotIn, SnapshotOut, Instance } from "mobx-state-tree";

export const StateModel = types
    .model('State')
    .props({
        id: types.optional(types.number, 0),
        name: types.optional(types.string, ""),
        code: types.optional(types.string, ""),
    })

export interface State extends Instance<typeof StateModel> {};
export interface StateSnapshotIn extends SnapshotIn<typeof StateModel> {};
export interface StateSnapshotOut extends SnapshotOut<typeof StateModel> {};
export const createDefaultStateModel = () => types.optional(StateModel, {});