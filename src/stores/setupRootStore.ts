import { IDisposer } from "mobx-state-tree";
import { RootStore } from "./RootStore";
import { persist } from "../persist";
import { storage } from "../storage";

const ROOT_STATE_STORAGE_KEY = 'root-store';
const ROOT_STATE_VERSION = 1;

export async function setupRootStore(rootStore: RootStore) {
    const dispose: IDisposer = persist(rootStore, ROOT_STATE_STORAGE_KEY, storage, ROOT_STATE_VERSION);

    // Passos assíncronos antes da primeira tela entram aqui, por exemplo:
    // await rootStore.userStore.restoreSession();

    return { rootStore, dispose };
}