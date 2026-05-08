export type ApiKey = {
    id: string;
    userId: string;
    service: string;
    projectName: string;
    modelName: string | null;
    key: string;
    currentUsage: number;
    usageLimit: number | null;
    createdAt: string;
    updatedAt: string;
};

export type CreateApiKeyPayload = {
    service: string;
    projectName: string;
    modelName?: string;
    usageLimit?: number;
    key: string;
};
