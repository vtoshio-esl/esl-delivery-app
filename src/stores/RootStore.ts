import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { UserStoreModel } from "./UserStore";
import { OccurrencesStoreModel } from "./OccurrencesStore";
import { UiStoreModel } from "./UiStore";
import { ManifestStoreModel } from "./ManifestStore";
import { DeliveryDraftStore } from "./DeliveryDraftStore";
import { SyncStoreModel } from "./SyncStore";
import { EventsStoreModel } from "./EventsStore";

export const RootStoreModel = types
    .model("RootStoreModel")
    .props({
        uiStore: types.optional(UiStoreModel, {}),
        userStore: types.optional(UserStoreModel, {}),
        occurrencesStore: types.optional(OccurrencesStoreModel, {}),
        manifestStore: types.optional(ManifestStoreModel, {}),
        deliveryDraftStore: types.optional(DeliveryDraftStore, {}),
        eventsStore: types.optional(EventsStoreModel, {}),
        syncStore: types.optional(SyncStoreModel, {}),
    })
    .actions((self) => ({
        logout: () => {
            self.userStore.logout();
            self.eventsStore.logout();
            self.occurrencesStore.logout();
            self.deliveryDraftStore.clearForm();
        }
    }))

export interface RootStore extends Instance<typeof RootStoreModel> {};
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {};