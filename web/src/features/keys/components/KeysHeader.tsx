import { UserButton } from '@clerk/clerk-react';
import { Database, Plus, Search } from 'lucide-react';

type KeysHeaderProps = {
    onOpenAddModal: () => void;
    onSearchTermChange: (value: string) => void;
    searchTerm: string;
};

export default function KeysHeader({
    onOpenAddModal,
    onSearchTermChange,
    searchTerm,
}: KeysHeaderProps) {
    return (
        <header className="mx-auto mb-12 max-w-6xl animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between gap-6">
                <div>
                    <h1 className="mb-2 inline-flex items-center bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
                        <Database className="mr-3 h-8 w-8 text-purple-500" />
                        API Vault
                    </h1>
                    <p className="text-lg text-gray-400">Securely manage and store your API keys</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className="flex items-center gap-2 rounded-xl bg-obsidian-accent px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple-600 hover:shadow-purple-500/40"
                        onClick={onOpenAddModal}
                        type="button"
                    >
                        <Plus className="h-5 w-5" />
                        Add New Key
                    </button>
                    <div className="rounded-full border border-gray-700/50 bg-black/40 p-1.5 shadow-lg transition-colors hover:border-purple-500/50">
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: 'h-10 w-10',
                                },
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="relative mt-8 max-w-xl">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-500" />
                </div>
                <input
                    className="w-full rounded-xl border border-gray-700/50 bg-black/40 py-3 pr-4 pl-10 text-white transition-all placeholder:text-gray-600 focus:border-obsidian-accent focus:ring-1 focus:ring-obsidian-accent focus:outline-none"
                    onChange={(event) => onSearchTermChange(event.target.value)}
                    placeholder="Search keys by service, project, or environment..."
                    type="text"
                    value={searchTerm}
                />
            </div>
        </header>
    );
}
