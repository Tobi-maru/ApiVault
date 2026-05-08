import { useState } from 'react';

import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';

import AddKeyModal from '@/features/keys/components/AddKeyModal';
import ErrorBanner from '@/features/keys/components/ErrorBanner';
import KeysGrid from '@/features/keys/components/KeysGrid';
import KeysHeader from '@/features/keys/components/KeysHeader';
import SignedOutHero from '@/features/keys/components/SignedOutHero';
import { useApiKeys } from '@/features/keys/hooks/use-api-keys';

export default function App() {
    const [isAddKeyModalOpen, setIsAddKeyModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { getToken, isSignedIn, isLoaded } = useAuth();
    const { addKey, deleteKey, error, keys, loading, setError, updateKeyUsage } = useApiKeys({
        getToken,
        isLoaded,
        isSignedIn,
    });

    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const filteredKeys = keys.filter((key) => {
        if (!normalizedSearchTerm) return true;
        return (
            key.service.toLowerCase().includes(normalizedSearchTerm) ||
            key.projectName.toLowerCase().includes(normalizedSearchTerm) ||
            key.modelName?.toLowerCase().includes(normalizedSearchTerm)
        );
    });

    return (
        <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-obsidian-bg via-[#0a0a0a] to-[#000000] p-8 font-sans selection:bg-purple-500/30 selection:text-white">
            <SignedOut>
                <SignedOutHero />
            </SignedOut>

            <SignedIn>
                <KeysHeader
                    onOpenAddModal={() => setIsAddKeyModalOpen(true)}
                    onSearchTermChange={setSearchTerm}
                    searchTerm={searchTerm}
                />

                <main className="mx-auto max-w-6xl">
                    {error ? <ErrorBanner message={error} onDismiss={() => setError(null)} /> : null}

                    <KeysGrid
                        filteredKeys={filteredKeys}
                        keys={keys}
                        loading={loading}
                        onDelete={(id) => void deleteKey(id)}
                        onError={setError}
                        onOpenAddModal={() => setIsAddKeyModalOpen(true)}
                        onUpdateUsage={updateKeyUsage}
                        searchTerm={searchTerm}
                    />
                </main>

                <AddKeyModal
                    isOpen={isAddKeyModalOpen}
                    onClose={() => setIsAddKeyModalOpen(false)}
                    onSubmit={addKey}
                />
            </SignedIn>
        </div>
    );
}
