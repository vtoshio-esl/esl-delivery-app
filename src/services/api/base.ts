import { AxiosInstance, create, isAxiosError } from "axios"

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


        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (isAxiosError(error)) {
                    console.log(
                        '[API]',
                        error.config?.method?.toUpperCase(),
                        `${error.config?.baseURL}${error.config?.url}`,
                        error.response?.status,
                        error.response?.data
                    );

                    if (error.response?.status === 401) {
                        this.onUnauthorized?.();
                    }
                }
                return Promise.reject(error);
            }
        );

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