import { AxiosRequestConfig } from "axios";
import { Api } from "./base";

export class ManifestItemApi {
    api: Api
    baseUrl: string = '/api/manifests'

    constructor(api: Api) {
        this.api = api;
    }

    async updateArrivalAt(
        params: { manifestId: number, itemId: number, itemType: string },
        body: { arrivalAt: string },
        config?: AxiosRequestConfig
    ) {
        const { manifestId, itemId, itemType } = params
        const { arrivalAt } = body

        const route = itemType === 'ManifestItem::Transfer' ? 'unloading_recipients' : 'items'
        const url = `${this.baseUrl}/${manifestId}/${route}/${itemId}` 

        await this.api.client.patch(
            url, 
            {
                manifest_item: { 
                    arrived_at: arrivalAt 
                }
            }, 
            config
        ) 
    }
}