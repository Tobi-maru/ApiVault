import { prisma } from '../utils/prisma.js';
import { ApiKeyWriteInput, ApiKeyResponse } from '../types/index.js';

export async function getApiKeysByUser(userId: string): Promise<ApiKeyResponse[]> {
    return prisma.apiKey.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
}

export async function createApiKey(
    userId: string,
    data: ApiKeyWriteInput,
): Promise<ApiKeyResponse> {
    return prisma.apiKey.create({
        data: {
            userId,
            service: data.service,
            projectName: data.projectName,
            environment: data.environment,
            key: data.key,
            usageLimit: data.usageLimit,
            currentUsage: 0,
        },
    });
}

export async function updateApiKey(
    userId: string,
    keyId: string,
    data: Partial<ApiKeyWriteInput>,
): Promise<ApiKeyResponse> {
    const existing = await prisma.apiKey.findFirst({
        where: { id: keyId, userId },
    });
    if (!existing) {
        throw new Error('Key not found');
    }
    return prisma.apiKey.update({
        where: { id: keyId },
        data,
    });
}

export async function deleteApiKey(userId: string, keyId: string): Promise<void> {
    const existing = await prisma.apiKey.findFirst({
        where: { id: keyId, userId },
    });
    if (!existing) {
        throw new Error('Key not found');
    }
    await prisma.apiKey.delete({
        where: { id: keyId },
    });
}
