import { AxiosInstance, isAxiosError } from "axios";
import { toApiError } from "./errors";

declare module 'axios' {
    interface AxiosRequestConfig {
        skipUnauthorizedHandler?: boolean
        skipLoading?: boolean
    }
}

interface InterceptorOptions {
    onUnauthorized: () => void
    onRequestStart: () => void
    onRequestEnd: () => void
}

function logError(error: unknown) {
    if (!isAxiosError(error)) return;

    console.log(
        '[API]',
        error.config?.method?.toUpperCase(),
        `${error.config?.baseURL}${error.config?.url}`,
        error.response?.status,
        error.response?.data
    );
}

export function setupInterceptors(client: AxiosInstance, options: InterceptorOptions) {
    client.interceptors.request.use((config) => {
        if (!config.skipLoading) options.onRequestStart();
        return config;
    });

    client.interceptors.response.use(
        (response) => {
            if (!response.config.skipLoading) options.onRequestEnd();
            return response;
        },
        (error) => {
            const config = isAxiosError(error) ? error.config : undefined;
            if (config && !config.skipLoading) options.onRequestEnd();

            logError(error);

            const apiError = toApiError(error);
            const skip = isAxiosError(error) && error.config?.skipUnauthorizedHandler;

            if (apiError.kind === 'unauthorized' && !skip) {
                options.onUnauthorized();
            }

            return Promise.reject(apiError);
        }
    );
}
