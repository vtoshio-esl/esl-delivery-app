import { Instance, types } from "mobx-state-tree";

export const UiStoreModel = types
    .model('UiStore')
    .volatile(() => ({
        // Volatile: não entra no snapshot, então não é persistido
        pendingRequests: 0,
    }))
    .views((self) => ({
        get isLoading() {
            return self.pendingRequests > 0;
        }
    }))
    .actions((self) => ({
        requestStarted() {
            self.pendingRequests += 1;
        },
        requestFinished() {
            self.pendingRequests = Math.max(0, self.pendingRequests - 1);
        }
    }));

export interface UiStore extends Instance<typeof UiStoreModel> {};
