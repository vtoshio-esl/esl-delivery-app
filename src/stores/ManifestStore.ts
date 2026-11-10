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
        },
        updateDepartureKm: async (manifestId: number, departureKm: number) => {
            const { manifestApi } = getEnv<Environment>(self);
            
            await manifestApi.updateDepartureKm(manifestId, departureKm);
        },
        updateClosingKm: async (manifestId: number, closingKm: number) => {
            const { manifestApi } = getEnv<Environment>(self);
            
            await manifestApi.updateClosingKm(manifestId, closingKm);
        }
    }))
    .actions((self) => ({
        acceptManifest: async (manifestId: number) => {
            const { manifestApi } = getEnv<Environment>(self);
    
            await manifestApi.acceptManifest(manifestId);
            await self.fetchSelectedManifest(manifestId);
        },
        startTransport: async (manifestId: number) => {
            const { manifestApi } = getEnv<Environment>(self);
    
            if (!self.selectedManifest?.canStartTransport) {
                throw new Error('O manifesto precisa ser aceito antes de iniciar o serviço.')
            };

            await manifestApi.startTransport(manifestId);
            await self.fetchSelectedManifest(manifestId);
        },
        // [TODO] Ajustar erro 500 no request
        confirmArrival: async (manifestId: number, arrivalDate: string, itemIds: number[]) => {
            const { manifestItemApi } = getEnv<Environment>(self);
            const items = itemIds
                .map((id) => self.selectedManifest?.getManifestItemById(id))
                .filter((item): item is NonNullable<typeof item> => !!item)
            
            if (items.length === 0)
                throw new Error('Nenhum item encontrado para dar baixa.')
            
            await Promise.all(items.map((item) => {
                const params = { manifestId, itemId: item.id, itemType: item.type }
                const body = { arrivalAt: arrivalDate }

                console.log('[ManifestApi] Confirm Arrival Params:', params);
                console.log('[ManifestApi] Confirm Arrival Body:', body);

                return manifestItemApi.updateArrivalAt(params, body)
            }))

            await self.fetchSelectedManifest(manifestId);
        }
    }))