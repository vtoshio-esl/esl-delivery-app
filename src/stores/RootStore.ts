import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { storage } from "../storage";

export const RootStoreModel = types
    .model("RootStoreModel")
    .props({
        counter: 0
    })
    .actions((self) => ({
        incrementToCounter() {
            self.counter++;
        }
    }));

export interface RootStore extends Instance<typeof RootStoreModel> {};
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {};