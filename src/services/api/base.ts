import { AxiosInstance, create } from "axios"
import { setupInterceptors } from "./interceptors"

const DEFAULT_TIMEOUT = 10000

export interface BaseApiConfig {
    tenant: string,
    token?: string,
    timeout?: number
}

export class Api {
    client: AxiosInstance
    onUnauthorized?: () => void

    constructor(config: BaseApiConfig) {
        this.client = create({
            baseURL: Api.buildBaseUrl(config.tenant),
            timeout: config.timeout ?? DEFAULT_TIMEOUT,
            withCredentials: false,
            headers: {
                Accept: 'application/json',
            }
        });


        setupInterceptors(this.client, {
            onUnauthorized: () => this.onUnauthorized?.(),
        })

        if (config.token) this.setToken(config.token);
    }

    static buildBaseUrl(tenant: string) {
        return `https://${tenant}.tmsweb.com.br`
    }

    setTenant(tenant: string) {
        this.client.defaults.baseURL = Api.buildBaseUrl(tenant);
    }

    setToken(token?: string) {
        if (token) {
            this.client.defaults.headers.common.Authorization = `Bearer ${token}`
        } else {
            delete this.client.defaults.headers.common.Authorization
        }
    }
}