import { AxiosRequestConfig } from "axios";
import { Api } from "./base";
import { 
    SetOccurrenceRequest, 
    UpdateArrivalAtRequest, 
    UpdateExitedAtRequest 
} from "./schemas/manifestItemSchemas";

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

    async setOccurrence(request: SetOccurrenceRequest, config?: AxiosRequestConfig) {
        const { manifestId, service, payload } = request;

        const url = `${this.baseUrl}/${manifestId}/${service.resourceRoute}/${service.id}/set_occurrences`
        
        await this.api.client.post(url, { item_occurrence: payload }, config)
    }

    async updateExitedAt(
        request: UpdateExitedAtRequest,
        config?: AxiosRequestConfig
    ) {
        const { manifestId, service, exitedAt } = request;
        const route = service.resourceRoute;

        const url = `${this.baseUrl}/${manifestId}/${route}/${service.id}`;

        await this.api.client.patch(
            url,
            { manifest_item: { exited_at: exitedAt } },
            config
        )
    }
}