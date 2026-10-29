import { createMMKV, Configuration } from "react-native-mmkv";

const mmkvConfiguration: Configuration = {
    id: 'esl-delivery-storage',
    encryptionType: 'AES-256',
    encryptionKey: 'teste-desenvolvimento',
    readOnly: false,
    compareBeforeSet: false,
}

export const mmkv = createMMKV(mmkvConfiguration)

export interface Storage {
  load<T>(key: string): T | undefined
  save<T>(key: string, value: T): boolean
  remove(key: string): boolean
}

export const storage: Storage = {
    load: (key) => {
        const raw = mmkv.getString(key);
        if (!raw) return undefined;

        try {
            return JSON.parse(raw);
        } catch (error) {
            const error_message = error instanceof Error ? error.message : 'Erro desconhecido';
            console.log('[MMK] Erro ao carregar: ', error_message);

            return undefined
        }
    },
    save: (key, value) => {
        try {
            const valueToSave = JSON.stringify(value);
            mmkv.set(key, valueToSave);

            return true;
        } catch (error) {
            const error_message = error instanceof Error ? error.message : 'Erro desconhecido';
            console.log('[MMK] Erro ao salvar: ', error_message);
            return false;
        }
    },
    remove: (key) => {
        try {
            return mmkv.remove(key);
        } catch (error) { 
            const error_message = error instanceof Error ? error.message : 'Erro desconhecido';
            console.log('[MMK] Erro ao remover: ', error_message);
            return false;
        }
    }
}