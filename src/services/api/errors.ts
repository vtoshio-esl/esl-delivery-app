import { isAxiosError } from "axios";

export type ApiErrorKind = 'unauthorized' | 'timeout' | 'network' | 'server' | 'client' | 'unknown';

const DEFAULT_MESSAGES: Record<ApiErrorKind, string> = {
    unauthorized: 'Sessão inválida. Faça login novamente.',
    timeout: 'O servidor demorou para responder. Tente novamente.',
    network: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
    server: 'Erro no servidor. Tente novamente mais tarde.',
    client: 'Não foi possível concluir a requisição.',
    unknown: 'Erro desconhecido.',
};

interface ApiErrorBody {
    error?: string
}

export class ApiError extends Error {
    kind: ApiErrorKind
    status?: number

    constructor(kind: ApiErrorKind, message: string, status?: number) {
        super(message);
        this.name = 'ApiError';
        this.kind = kind;
        this.status = status;
    }
}

function resolveKind(status?: number, code?: string): ApiErrorKind {
    if (code === 'ECONNABORTED' || code === 'ETIMEDOUT') return 'timeout';
    if (!status) return 'network';
    if (status === 401) return 'unauthorized';
    if (status >= 500) return 'server';
    if (status >= 400) return 'client';
    return 'unknown';
}

export function toApiError(error: unknown): ApiError {
    if (error instanceof ApiError) return error;

    if (isAxiosError<ApiErrorBody>(error)) {
        const status = error.response?.status;
        const kind = resolveKind(status, error.code);
        const bodyMessage = error.response?.data?.error;
        const message = typeof bodyMessage === 'string' && bodyMessage.trim()
            ? bodyMessage
            : DEFAULT_MESSAGES[kind];

        return new ApiError(kind, message, status);
    }

    return new ApiError('unknown', DEFAULT_MESSAGES.unknown);
}
