import { AxiosRequestConfig } from "axios";
import { Api } from "./base";
import { ManifestService } from "../../models/ManifestServices/types";

export interface UpdateArrivalAtRequest {
    manifestId: number
    service: ManifestService,
    arrivedAt: string
}

export type SetOccurrenceManifestItemData = {
    mobile_uuid?: string;
    occurrence_id?: number;
    occurrence_at?: string;
    receiver?: string;
    document_number?: string;
    comments?: string;
    latitude?: string;
    longitude?: string;
}

export interface SetOccurrenceRequest {
    manifestId: number,
    service: ManifestService,
    payload: SetOccurrenceManifestItemData;
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

    async setOccurrence(request: SetOccurrenceRequest, config?: AxiosRequestConfig) {
        const { manifestId, service, payload } = request;

        const url = `${this.baseUrl}/${manifestId}/${service.resourceRoute}/${service.id}/set_occurrences`
        
        await this.api.client.post(url, { item_occurrence: payload }, config)
    }
}