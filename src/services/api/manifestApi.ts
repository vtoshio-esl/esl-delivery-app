import { AxiosRequestConfig } from "axios";
import { Api } from "./base";
import { ManifestSnapshotIn } from "../../models/Manifest";


export class ManifestApi {
    api: Api

    constructor(api: Api) {
        this.api = api;
    }

    async fetchManifests(config?: AxiosRequestConfig): Promise<ManifestSnapshotIn[]> {
        const response = await this.api.client.get(
            '/api/manifests', 
            config
        );
    
        return response.data
    }

    async fetchManifest(manifestId: number, config?: AxiosRequestConfig): Promise<ManifestSnapshotIn> {
        const response = await this.api.client.get(
            `/api/manifests/${manifestId}`, 
            config,
        );

        return response.data;
    }

    async acceptManifest(manifestId: number, config?: AxiosRequestConfig) {
        await this.api.client.post(
            `/api/manifests/${manifestId}/accept`,
            { accepted_at: new Date().toISOString() },
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