import { types } from "mobx-state-tree";

// [TODO] Implementar fila de sincronização para:
// - arrival_at
// - set_occurrence
// - exited_at
export const SyncStoreModel = types
    .model('SyncStore')
    .volatile(() => ({
        isProcessing: false,
        isModalVisible: false,
    }))
    .actions((self) => ({
        setProcessing: (value: boolean) => self.isProcessing = value,
        openModal: () => { self.isModalVisible = true },
        closeModal: () => { self.isModalVisible = false },
    }))
    .actions((self) => ({
        sendJobs: () => {
            if (self.isProcessing) return;
            self.setProcessing(true);

            try {
                console.log('[SYNC] Processando fila com o TMS...')
            } finally {
                self.setProcessing(false);
            }
        }
    }))
