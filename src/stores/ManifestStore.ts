import { types, getEnv, cast } from "mobx-state-tree";
import { ManifestModel, ManifestSnapshotIn } from "../models/Manifest";
import { Environment } from "../services/environment";
import { ManifestDetailedModel } from "../models/ManifestDetailed";

import { ManifestService } from "../models/ManifestServices/types";
import { withStep } from "../services/api/errors";

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

            const known_manifest = self.manifests.find((m) => m.id === manifestId) ?? 
                (self.selectedManifest?.id === manifestId ? self.selectedManifest : undefined)

            const manifest = await manifestApi.fetchManifest(
                manifestId,
                !(known_manifest?.isContainer ?? false),
                { skipLoading: true }
            );

            self.setSelectedManifest(manifest);
        },
        updateDepartureKm: async (manifestId: number, departureKm: number) => {
            const { manifestApi } = getEnv<Environment>(self);
            
            await manifestApi.updateDepartureKm(manifestId, departureKm);
        },
        updateClosingKm: async (manifestId: number, closingKm: number) => {
            const { manifestApi } = getEnv<Environment>(self);
            
            await manifestApi.updateClosingKm(manifestId, closingKm);
        },
        startTransport: async (manifestId: number) => {
            const { manifestApi } = getEnv<Environment>(self);
    
            await manifestApi.startTransport(manifestId);
        },
    }))
    .actions((self) => ({
        acceptManifest: async (manifestId: number, acceptedAt: string) => {
            const { manifestApi } = getEnv<Environment>(self);
    
            await manifestApi.acceptManifest(manifestId, acceptedAt);
            await self.fetchSelectedManifest(manifestId);
        },
        startTransportWithKm: async (manifestId: number, km: number) => {
            const { manifestApi } = getEnv<Environment>(self);

            if (!self.selectedManifest?.canStartTransport) {
                throw new Error('O manifesto precisa ser aceito antes de iniciar o serviço')
            }

            try {
                await manifestApi.startTransport(manifestId);
            } catch (e) { 
                throw withStep(e,'Erro ao iniciar serviço');
            }

            try {
                await manifestApi.updateDepartureKm(manifestId, km);
            } catch (e) { 
                throw withStep(e, 'Serviço iniciado, mas não foi possível salvar o KM.');
            } finally {
                await self.fetchSelectedManifest(manifestId);
            }
        },
    }))