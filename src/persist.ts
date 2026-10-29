import { onSnapshot, applySnapshot, IAnyStateTreeNode, getSnapshot } from 'mobx-state-tree'

import { Storage } from './storage';

type PersistedSnapshot = { v: number, data: unknown }

export function persist(
    store: IAnyStateTreeNode, 
    key: string, 
    storage: Storage, 
    version = 1
) {
  const saved = storage.load<PersistedSnapshot>(key)
  
  if (saved?.v === version) {
    try { applySnapshot(store, saved.data) }
    catch { storage.remove(key) } // snapshot incompatível → descarta
  } else if (saved) {
    storage.remove(key);
  }

  let timeout: ReturnType<typeof setTimeout> | undefined
  const save = () => storage.save(key, { v: version, data: getSnapshot(store)})

  const unsubscribe = onSnapshot(store, () => {
    clearTimeout(timeout);
    timeout = setTimeout(save, 300);
  })

  return () => {
    if (timeout) {
      clearTimeout(timeout);
      save();
    }
    unsubscribe()
  }
}