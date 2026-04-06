import { Loader2 } from 'lucide-react';

import type { ApiKey } from '../../../types/api-key';
import EmptyKeysState from './EmptyKeysState';
import KeyCard from './KeyCard';

type KeysGridProps = {
    filteredKeys: ApiKey[];
    keys: ApiKey[];
    loading: boolean;
    onDelete: (id: string) => void;
    onError: (message: string | null) => void;
    onOpenAddModal: () => void;
    onUpdateUsage: (id: string, newUsage: number) => void;
    searchTerm: string;
};

export default function KeysGrid({
    filteredKeys,
    keys,
    loading,
    onDelete,
    onError,
    onOpenAddModal,
    onUpdateUsage,
    searchTerm,
}: KeysGridProps) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-32 animate-in fade-in duration-300">
                <Loader2 className="h-12 w-12 animate-spin text-obsidian-accent" />
            </div>
        );
    }

    if (keys.length === 0) {
        return <EmptyKeysState onOpenAddModal={onOpenAddModal} />;
    }

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredKeys.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-400">
                    No keys found matching &quot;{searchTerm}&quot;
                </div>
            ) : (
                filteredKeys.map((keyData) => (
                    <KeyCard
                        key={keyData.id}
                        keyData={keyData}
                        onDelete={onDelete}
                        onError={onError}
                        onUpdateUsage={onUpdateUsage}
                    />
                ))
            )}
        </div>
    );
}
