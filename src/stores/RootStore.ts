import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { UserStoreModel } from "./UserStore";

export const RootStoreModel = types
    .model("RootStoreModel")
    .props({
        userStore: types.optional(UserStoreModel, {}),
    })
    .actions((self) => ({
        logout: () => {
            self.userStore.logout()
        }
    }))

export interface RootStore extends Instance<typeof RootStoreModel> {};
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {};