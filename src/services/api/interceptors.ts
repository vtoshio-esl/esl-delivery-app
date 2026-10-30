import { AxiosInstance, isAxiosError } from "axios";
import { toApiError } from "./errors";

declare module 'axios' {
    interface AxiosRequestConfig {
        skipUnauthorizedHandler?: boolean
    }
}

interface InterceptorOptions {
    onUnauthorized: () => void
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
    client.interceptors.response.use(
        (response) => response,
        (error) => {
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
