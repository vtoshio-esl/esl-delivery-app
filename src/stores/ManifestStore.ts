import { types, SnapshotIn, SnapshotOut, Instance, getEnv, cast } from "mobx-state-tree";
import { ManifestModel, ManifestSnapshotIn } from "../models/Manifest";
import { Environment } from "../services/environment";
import { ManifestDetailedModel } from "../models/ManifestDetailed";

export const ManifestStoreModel = types
    .model('ManifestStore')
    .props({
        manifests: types.optional(types.array(ManifestModel), []),
        selectedManifest: types.maybeNull(ManifestDetailedModel),
    })
    .actions((self) => ({
        setManifests: (manifests: ManifestSnapshotIn[]) => {
            self.manifests = cast(manifests);
        },
        setSelectedManifest: (manifest: ManifestSnapshotIn) => {
            self.selectedManifest = cast(manifest);
        }
    }))
    .actions((self) => ({
        syncAvailableManifests: async () => {
            const { manifestApi } = getEnv<Environment>(self);
            const manifests = await manifestApi.fetchManifests();

            self.setManifests(manifests);
        },
        fetchSelectedManifest: async (manifestId: number) => {
            const { manifestApi } = getEnv<Environment>(self);
            const manifest = await manifestApi.fetchManifest(manifestId, { skipLoading: true });

            self.setSelectedManifest(manifest);
        }
    }))