export type ApiKey = {
    id: string;
    service: string;
    projectName: string;
    modelName?: string | null;
    currentUsage: number;
    usageLimit?: number | null;
    key: string;
    createdAt: string;
};

export type CreateApiKeyPayload = {
    service: string;
    projectName: string;
    modelName?: string;
    usageLimit?: number;
    key: string;
};
