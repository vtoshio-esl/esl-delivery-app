import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { UserStoreModel } from "./UserStore";
import { OccurrencesStoreModel } from "./OccurrencesStore";

export const RootStoreModel = types
    .model("RootStoreModel")
    .props({
        userStore: types.optional(UserStoreModel, {}),
        occurrencesStore: types.optional(OccurrencesStoreModel, {})
    })
    .actions((self) => ({
        logout: () => {
            self.userStore.logout()
        }
    }))

export interface RootStore extends Instance<typeof RootStoreModel> {};
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {};