import { prisma } from '../utils/prisma.js';
import { SimulateProxyResult } from '../types/index.js';

export async function simulateProxyRequest(
    userId: string,
    keyId: string,
): Promise<SimulateProxyResult> {
    const apiKey = await prisma.apiKey.findFirst({
        where: { id: keyId, userId },
    });

    if (!apiKey) {
        throw new Error('API Key not found or access denied.');
    }

    // Simulate API cost between $0.01 and $2.50
    const simCost = parseFloat((Math.random() * 2.5 + 0.01).toFixed(2));
    const newUsage = parseFloat((apiKey.currentUsage + simCost).toFixed(2));

    if (apiKey.usageLimit !== null && newUsage > apiKey.usageLimit) {
        throw new Error('Usage limit reached for this API key.');
    }

    const updatedKey = await prisma.apiKey.update({
        where: { id: keyId },
        data: { currentUsage: newUsage },
    });

    return {
        success: true,
        simulatedCost: simCost,
        newTotalUsage: updatedKey.currentUsage,
        message: `Successfully proxied request to ${apiKey.service}.`,
    };
}
