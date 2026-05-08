import 'dotenv/config';

function getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key];
    if (value === undefined || value === '') {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

function getEnvVarAsNumber(key: string, defaultValue?: number): number {
    const raw = process.env[key];
    if (raw === undefined || raw === '') {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new Error(`Missing required environment variable: ${key}`);
    }
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
        throw new Error(`Environment variable ${key} must be a valid number.`);
    }
    return parsed;
}

export const config = {
    nodeEnv: getEnvVar('NODE_ENV', 'development'),
    port: getEnvVarAsNumber('PORT', 3001),
    databaseUrl: getEnvVar('DATABASE_URL'),
    clerkSecretKey: getEnvVar('CLERK_SECRET_KEY'),
    clerkPublishableKey: getEnvVar('CLERK_PUBLISHABLE_KEY'),
    corsOrigin: getEnvVar('CORS_ORIGIN', ''),
    isDevelopment: getEnvVar('NODE_ENV', 'development') === 'development',
    isProduction: getEnvVar('NODE_ENV', 'development') === 'production',
} as const;
