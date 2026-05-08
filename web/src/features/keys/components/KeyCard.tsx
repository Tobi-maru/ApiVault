import { useState } from 'react';

import { useAuth } from '@clerk/clerk-react';
import { Activity, Check, Copy, Eye, EyeOff, Loader2, Trash2 } from 'lucide-react';

import { apiRequest } from '@/lib/api';
import type { ApiKey } from '@/types/api-key';
import { formatCurrency } from '@/utils/format';

type KeyCardProps = {
    keyData: ApiKey;
    onDelete: (id: string) => void;
    onError: (message: string | null) => void;
    onUpdateUsage: (id: string, newUsage: number) => void;
};

export default function KeyCard({
    keyData,
    onDelete,
    onError,
    onUpdateUsage,
}: KeyCardProps) {
    const [copied, setCopied] = useState(false);
    const [showKey, setShowKey] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const { getToken } = useAuth();

    const usageLimit = keyData.usageLimit ?? null;
    const hasUsageLimit = usageLimit !== null;
    const isLimitReached = hasUsageLimit && keyData.currentUsage >= usageLimit;
    const usageProgress = hasUsageLimit
        ? usageLimit === 0
            ? 100
            : Math.min(100, (keyData.currentUsage / usageLimit) * 100)
        : 0;

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(keyData.key);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            onError('Failed to copy the API key to your clipboard.');
        }
    }

    async function handleSimulate() {
        try {
            onError(null);
            setIsSimulating(true);

            const data = await apiRequest<{ success: boolean; newTotalUsage: number }>(
                `/proxy/simulate/${keyData.id}`,
                getToken,
                { method: 'POST' },
            );

            if (data.success) {
                onUpdateUsage(keyData.id, data.newTotalUsage);
            }
        } catch (requestError) {
            onError(
                requestError instanceof Error ? requestError.message : 'Simulation failed.',
            );
        } finally {
            setIsSimulating(false);
        }
    }

    return (
        <div className="group relative rounded-lg border border-gray-700 bg-obsidian-bg p-4 shadow-lg transition-colors duration-300 animate-in slide-in-from-bottom-4 hover:border-obsidian-accent">
            <div className="mb-3 flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-bold text-obsidian-accent">{keyData.service}</h3>
                    <p className="text-xs text-gray-400">{keyData.projectName}</p>
                    {keyData.environment ? (
                        <p className="mt-1 text-xs text-gray-500">Environment: {keyData.environment}</p>
                    ) : null}
                </div>
                <button
                    aria-label="Delete key"
                    className="text-gray-500 transition-colors hover:text-red-500"
                    onClick={() => onDelete(keyData.id)}
                    type="button"
                >
                    <Trash2 className="h-5 w-5" />
                </button>
            </div>

            <div className="mb-3 rounded border border-gray-800 bg-black/30 p-2">
                <p className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">Vault ID</p>
                <code className="break-all font-mono text-xs text-purple-400">{keyData.id}</code>
            </div>

            <div className="mt-2 flex items-center justify-between rounded bg-black/30 p-2 font-mono text-sm text-gray-300 shadow-inner transition-colors group-hover:bg-black/50 break-all">
                <span className="mr-2 truncate">
                    {showKey ? keyData.key : '•'.repeat(Math.min(keyData.key.length, 24))}
                </span>
                <div className="flex flex-shrink-0 items-center gap-2">
                    <button
                        className="text-gray-400 transition-colors hover:text-white focus:outline-none"
                        onClick={() => setShowKey((currentState) => !currentState)}
                        title={showKey ? 'Hide key' : 'Show key'}
                        type="button"
                    >
                        {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                        className="text-gray-400 transition-colors hover:text-white focus:outline-none"
                        onClick={() => void copyToClipboard()}
                        title="Copy to clipboard"
                        type="button"
                    >
                        {copied ? (
                            <span className="flex items-center text-green-400 animate-in fade-in zoom-in duration-200">
                                <Check className="h-4 w-4" />
                            </span>
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>

            {hasUsageLimit ? (
                <div className="mt-4 animate-in fade-in duration-300">
                    <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs text-gray-400">Usage</span>
                        <span className="text-xs text-gray-400">
                            {formatCurrency(keyData.currentUsage)} / {formatCurrency(usageLimit)}
                        </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
                        <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                                isLimitReached || usageProgress > 80
                                    ? 'bg-red-500'
                                    : 'bg-obsidian-accent'
                            }`}
                            style={{ width: `${usageProgress}%` }}
                        />
                    </div>
                </div>
            ) : null}

            <div className="mt-3 flex items-center justify-between border-t border-gray-800 pt-3 text-xs text-gray-500">
                <span>Created: {new Date(keyData.createdAt).toLocaleDateString()}</span>
                <button
                    className="flex items-center text-obsidian-accent transition-colors hover:text-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSimulating || isLimitReached}
                    onClick={() => void handleSimulate()}
                    title="Simulate API Request"
                    type="button"
                >
                    {isSimulating ? (
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    ) : (
                        <Activity className="mr-1 h-3 w-3" />
                    )}
                    Test Route
                </button>
            </div>
        </div>
    );
}
