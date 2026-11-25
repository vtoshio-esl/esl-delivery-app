import { AxiosRequestConfig } from "axios";
import { Api } from "./base";
import { 
    addDeliveryReceiptRequest,
    addImageRequest,
    SetEventRequest,
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

    async addDeliveryReceipt(
        { manifestId, service, base64, isSignature }: addDeliveryReceiptRequest, 
        config?: AxiosRequestConfig
    ) {
        const url = `${this.baseUrl}/${manifestId}/${service.resourceRoute}/${service.id}/add_delivery_receipt`;
        
        await this.api.client.post(
            url, 
            { image: base64, signature: isSignature }, 
            config
        );
    }

    async addReversePickReceipt(
        { manifestId, service, base64, isSignature }: addDeliveryReceiptRequest, 
        config?: AxiosRequestConfig
    ) {
        const url = `${this.baseUrl}/${manifestId}/${service.resourceRoute}/${service.id}/add_reverse_pick_receipt`;
        
        await this.api.client.post(
            url, 
            { image: base64, signature: isSignature },
            config
        );
    }

    async addImage(
        { manifestId, service, uri }: addImageRequest,
        config?: AxiosRequestConfig
    ) {
        const form = new FormData();
        form.append(
            'image', 
            { uri, name: 'anexo.jpg', type: 'image/jpeg' } as any
        );
        
        const url = `${this.baseUrl}/${manifestId}/${service.resourceRoute}/${service.id}/add_image`;
        
        await this.api.client.post(
            url, 
            form, 
            { 
                ...config,  
                headers: { 
                    'Content-Type': 'multipart/form-data' 
                },
            },
        );
    }

    async setEvent(
        { manifestId, service, payload }: SetEventRequest, 
        config?: AxiosRequestConfig
    ) {
        const url = `${this.baseUrl}/${manifestId}/${service.resourceRoute}/${service.id}/set_events`;

        await this.api.client.post(
            url, 
            { item_occurrence: payload }, 
            config
        );
    }
}
