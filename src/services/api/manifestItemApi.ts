import { AxiosRequestConfig } from "axios";
import { Api } from "./base";
import { ManifestService } from "../../models/ManifestDetailed";

export interface UpdateArrivalAtRequest {
    manifestId: number
    service: ManifestService,
    arrivedAt: string
}

export class ManifestItemApi {
    api: Api
    baseUrl: string = '/api/manifests'

    constructor(api: Api) {
        this.api = api;
    }

    async updateArrivalAt(
        request: UpdateArrivalAtRequest,
        config?: AxiosRequestConfig
    ) {
        const { manifestId, service, arrivedAt } = request
        const route = service.resourceRoute

        const url = `${this.baseUrl}/${manifestId}/${route}/${service.id}` 

        await this.api.client.patch(
            url, 
            { manifest_item: { arrived_at: arrivedAt } }, 
            config
        ) 
    }
}