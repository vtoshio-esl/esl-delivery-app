import { AxiosRequestConfig } from "axios";
import { Api } from "./base";
import { ManifestSnapshotIn } from "../../models/Manifest";


export class ManifestApi {
    api: Api

    constructor(api: Api) {
        this.api = api;
    }

    async fetchManifests(config?: AxiosRequestConfig): Promise<ManifestSnapshotIn[]> {
        const response = await this.api.client.get('/api/manifests', config);
    
        return response.data
    }
}