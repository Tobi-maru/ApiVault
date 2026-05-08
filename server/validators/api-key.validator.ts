import { ApiKeyWriteInput } from '../types/index.js';

export class PayloadValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PayloadValidationError';
    }
}

function parseRecord(payload: unknown): Record<string, unknown> {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        throw new PayloadValidationError('Invalid request body.');
    }
    return payload as Record<string, unknown>;
}

function parseRequiredString(
    payload: Record<string, unknown>,
    field: string,
    label: string,
): string {
    const value = payload[field];
    if (typeof value !== 'string') {
        throw new PayloadValidationError(`${label} is required.`);
    }
    const trimmedValue = value.trim();
    if (!trimmedValue) {
        throw new PayloadValidationError(`${label} is required.`);
    }
    return trimmedValue;
}

function parseOptionalString(
    payload: Record<string, unknown>,
    field: string,
    label: string,
): string | null {
    const value = payload[field];
    if (value === undefined || value === null || value === '') {
        return null;
    }
    if (typeof value !== 'string') {
        throw new PayloadValidationError(`${label} must be a string.`);
    }
    const trimmedValue = value.trim();
    return trimmedValue ? trimmedValue : null;
}

function parseOptionalNumber(
    payload: Record<string, unknown>,
    field: string,
    label: string,
): number | null {
    const value = payload[field];
    if (value === undefined || value === null || value === '') {
        return null;
    }
    const parsedValue =
        typeof value === 'number'
            ? value
            : typeof value === 'string'
              ? Number(value)
              : Number.NaN;
    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
        throw new PayloadValidationError(`${label} must be a non-negative number.`);
    }
    return parsedValue;
}

export function parseCreateApiKeyInput(payload: unknown): ApiKeyWriteInput {
    const record = parseRecord(payload);
    return {
        service: parseRequiredString(record, 'service', 'Service name'),
        projectName: parseRequiredString(record, 'projectName', 'Project name'),
        environment: parseOptionalString(record, 'environment', 'Environment'),
        key: parseRequiredString(record, 'key', 'API key'),
        usageLimit: parseOptionalNumber(record, 'usageLimit', 'Usage limit'),
    };
}

export function parseUpdateApiKeyInput(payload: unknown): Partial<ApiKeyWriteInput> {
    const record = parseRecord(payload);
    const data: Partial<ApiKeyWriteInput> = {};

    if ('service' in record) {
        data.service = parseRequiredString(record, 'service', 'Service name');
    }
    if ('projectName' in record) {
        data.projectName = parseRequiredString(record, 'projectName', 'Project name');
    }
    if ('environment' in record) {
        data.environment = parseOptionalString(record, 'environment', 'Environment');
    }
    if ('key' in record) {
        data.key = parseRequiredString(record, 'key', 'API key');
    }
    if ('usageLimit' in record) {
        data.usageLimit = parseOptionalNumber(record, 'usageLimit', 'Usage limit');
    }

    if (Object.keys(data).length === 0) {
        throw new PayloadValidationError('Provide at least one supported field to update.');
    }

    return data;
}
