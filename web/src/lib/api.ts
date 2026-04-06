type TokenGetter = () => Promise<string | null>;

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
    body?: unknown;
};

function extractErrorMessage(payload: unknown): string | null {
    if (!payload || typeof payload !== 'object') {
        return null;
    }

    const maybeError = (payload as { error?: unknown }).error;
    return typeof maybeError === 'string' ? maybeError : null;
}

export async function apiRequest<T>(
    path: string,
    getToken: TokenGetter,
    options: ApiRequestOptions = {},
): Promise<T> {
    const token = await getToken();
    const headers = new Headers(options.headers);

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    let body: BodyInit | undefined;

    if (options.body !== undefined) {
        headers.set('Content-Type', 'application/json');
        body = JSON.stringify(options.body);
    }

    const response = await fetch(`/api${path}`, {
        ...options,
        headers,
        body,
    });

    const payload = (await response.json().catch(() => null)) as T | { error?: unknown } | null;

    if (!response.ok) {
        throw new Error(
            extractErrorMessage(payload) ?? `Request failed with status ${response.status}.`,
        );
    }

    return payload as T;
}
