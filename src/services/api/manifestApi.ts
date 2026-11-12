import { AxiosRequestConfig } from "axios";
import { Api } from "./base";
import { ManifestSnapshotIn } from "../../models/Manifest";


export class ManifestApi {
    api: Api

    constructor(api: Api) {
        this.api = api;
    }

    async fetchManifests(page=1, per=20, config?: AxiosRequestConfig): Promise<ManifestSnapshotIn[]> {
        const response = await this.api.client.get(
            '/api/manifests', 
            { 
                ...config, 
                params: { ...config?.params, page, per, use_unloading_recipient: true }
            }
        );
    
        return response.data
    }

    async fetchManifest(manifestId: number, useUnloadingRecipient: boolean, config?: AxiosRequestConfig): Promise<ManifestSnapshotIn> {
        const response = await this.api.client.get(
            `/api/manifests/${manifestId}`, 
            { 
                ...config, 
                params: { ...config?.params, use_unloading_recipient: useUnloadingRecipient }
            }
        );

        return response.data;
    }

    async acceptManifest(manifestId: number, acceptedAt: string, config?: AxiosRequestConfig) {
        await this.api.client.post(
            `/api/manifests/${manifestId}/accept`,
            { accepted_at: acceptedAt },
            config
        )
    }

    async startTransport(manifestId: number, config?: AxiosRequestConfig) {
        await this.api.client.post(
            `/api/manifests/${manifestId}/start_transport`,
            { departured_at: new Date().toISOString() },
            config
        )
    }

    async updateDepartureKm(manifestId: number, departureKm: number, config?: AxiosRequestConfig) {
        await this.api.client.put(
            `/api/manifests/${manifestId}`,
            { vehicle_departure_km: departureKm },
            config
        )
    }

    async updateClosingKm(manifestId: number, closingKm: number, config?: AxiosRequestConfig) {
        await this.api.client.put(
            `/api/manifests/${manifestId}`,
            { closing_km: closingKm },
            config
        )
    }
}