export type ApiKeyWriteInput = {
    service: string;
    projectName: string;
    environment: string | null;
    key: string;
    usageLimit: number | null;
};

export type ApiKeyResponse = {
    id: string;
    userId: string;
    service: string;
    projectName: string;
    environment: string | null;
    key: string;
    currentUsage: number;
    usageLimit: number | null;
    createdAt: Date;
    updatedAt: Date;
};

export type SimulateProxyResult = {
    success: boolean;
    simulatedCost: number;
    newTotalUsage: number;
    message: string;
};
