import { useEffect, useState } from 'react';

import { apiRequest } from '../../../lib/api';
import type { ApiKey, CreateApiKeyPayload } from '../../../types/api-key';

type UseApiKeysOptions = {
    getToken: () => Promise<string | null>;
    isLoaded: boolean;
    isSignedIn: boolean | undefined;
};

function getErrorMessage(error: unknown, fallbackMessage: string) {
    return error instanceof Error ? error.message : fallbackMessage;
}

export function useApiKeys({ getToken, isLoaded, isSignedIn }: UseApiKeysOptions) {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isCancelled = false;

        async function loadKeys() {
            if (!isLoaded) {
                return;
            }

            if (!isSignedIn) {
                if (!isCancelled) {
                    setKeys([]);
                    setError(null);
                    setLoading(false);
                }
                return;
            }

            try {
                if (!isCancelled) {
                    setLoading(true);
                }

                const data = await apiRequest<ApiKey[]>('/keys', getToken);

                if (!isCancelled) {
                    setKeys(data);
                    setError(null);
                }
            } catch (requestError) {
                if (!isCancelled) {
                    setError(getErrorMessage(requestError, 'Failed to load keys.'));
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        }

        void loadKeys();

        return () => {
            isCancelled = true;
        };
    }, [getToken, isLoaded, isSignedIn]);

    async function addKey(payload: CreateApiKeyPayload) {
        setError(null);

        try {
            const addedKey = await apiRequest<ApiKey>('/keys', getToken, {
                body: payload,
                method: 'POST',
            });

            setKeys((previousKeys) => [addedKey, ...previousKeys]);
            return true;
        } catch (requestError) {
            setError(getErrorMessage(requestError, 'Failed to add key.'));
            return false;
        }
    }

    async function deleteKey(id: string) {
        setError(null);

        try {
            await apiRequest<{ success: true }>(`/keys/${id}`, getToken, {
                method: 'DELETE',
            });

            setKeys((previousKeys) => previousKeys.filter((key) => key.id !== id));
        } catch (requestError) {
            setError(getErrorMessage(requestError, 'Failed to delete key.'));
        }
    }

    function updateKeyUsage(id: string, newUsage: number) {
        setKeys((previousKeys) =>
            previousKeys.map((key) =>
                key.id === id ? { ...key, currentUsage: newUsage } : key,
            ),
        );
    }

    return {
        addKey,
        deleteKey,
        error,
        keys,
        loading,
        setError,
        updateKeyUsage,
    };
}
