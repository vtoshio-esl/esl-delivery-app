import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { UserStoreModel } from "./UserStore";
import { OccurrencesStoreModel } from "./OccurrencesStore";
import { UiStoreModel } from "./UiStore";
import { ManifestStoreModel } from "./ManifestStore";

export const RootStoreModel = types
    .model("RootStoreModel")
    .props({
        uiStore: types.optional(UiStoreModel, {}),
        userStore: types.optional(UserStoreModel, {}),
        occurrencesStore: types.optional(OccurrencesStoreModel, {}),
        manifestStore: types.optional(ManifestStoreModel, {}),
    })
    .actions((self) => ({
        logout: () => {
            self.userStore.logout()
        }
    }))

export interface RootStore extends Instance<typeof RootStoreModel> {};
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {};