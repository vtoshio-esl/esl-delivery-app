import { types, SnapshotIn, SnapshotOut, Instance, getEnv, cast } from "mobx-state-tree";
import { ManifestModel, ManifestSnapshotIn } from "../models/Manifest";
import { Environment } from "../services/environment";

export const ManifestStoreModel = types
    .model('ManifestStore')
    .props({
        manifests: types.optional(types.array(ManifestModel), [])
    })
    .actions((self) => ({
        setManifests: (manifests: ManifestSnapshotIn[]) => {
            self.manifests = cast(manifests);
        }
    }))
    .actions((self) => ({
        syncAvailableManifests: async () => {
            const { manifestApi } = getEnv<Environment>(self);
            const manifests = await manifestApi.fetchManifests();

            self.setManifests(manifests);
        }
    }))