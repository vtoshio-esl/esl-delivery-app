import { createContext, useContext, useEffect, useState } from "react";
import { IDisposer } from "mobx-state-tree";

import { createEnvironment } from "../helpers/environment";
import { RootStore, RootStoreModel } from "./RootStore";
import { setupRootStore } from "./setupRootStore";

// Criação do Root Store
export const createRootStore = () => RootStoreModel.create({}, createEnvironment());
export const rootStore = createRootStore();


// Criação do useContext do RootStore
export const RootStoreContext = createContext<RootStore>(rootStore);
export const RootStoreProvider = RootStoreContext.Provider;
export const useStores = () => useContext(RootStoreContext);

export function useInitialRootStore() { 
    const [rehydrated, setRehydrated] = useState(false);

    useEffect(() => {
        let dispose: IDisposer | undefined;
        let cancelled = false;

        setupRootStore(rootStore)
            .then((result) => {
                dispose = result.dispose;
                if (cancelled) dispose();
            })
            .catch((error) => {
                const message = error instanceof Error ? error.message : 'Erro desconhecido.';
                console.log('[RootStore] Erro no setup:', error)
            })
            .finally(() => { 
                if (!cancelled) setRehydrated(true)
            })
            
        return () => {
            cancelled = true;
            dispose?.();
        };
    }, []);

    return { rootStore, rehydrated }
}
