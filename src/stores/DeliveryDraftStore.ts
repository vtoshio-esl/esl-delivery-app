import { getRoot, types } from "mobx-state-tree";

import { ManifestService, ManifestServiceKind } from "../models/ManifestServices/types";
import { RootStore } from "./RootStore";

export type ServiceKey = {
    id: number;
    kind: ManifestServiceKind;
}

export const DeliveryDraftStore = types
    .model('DeliveryDraftStore')
    .props({
        selectedKeys: types.array(types.frozen<ServiceKey>()),
    })
    .views((self) => ({
        get countSelectedServices(): number {
            return self.selectedKeys.length;
        },
        get getSelectedServices(): ManifestService[] {
            const manifest = getRoot<RootStore>(self).manifestStore.selectedManifest;
            if (!manifest) return [];

            return self.selectedKeys
                .map((k) => manifest.getServiceById(k.id, k.kind))
                .filter((s): s is ManifestService => s !== undefined)
        }
    }))
    .actions((self) => ({
        selectService: (service: ServiceKey) => {
            self.selectedKeys.push(service); 
        },
        clearSelectedServices: () => {
            self.selectedKeys.clear();
        }
    }))