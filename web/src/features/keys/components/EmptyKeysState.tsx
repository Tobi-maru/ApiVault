import { Database, Plus } from 'lucide-react';

type EmptyKeysStateProps = {
    onOpenAddModal: () => void;
};

export default function EmptyKeysState({ onOpenAddModal }: EmptyKeysStateProps) {
    return (
        <div className="rounded-2xl border border-gray-800/50 bg-black/20 py-20 text-center animate-in fade-in duration-300">
            <Database className="mx-auto mb-6 h-16 w-16 text-gray-700" />
            <h3 className="mb-2 text-xl font-medium text-gray-300">No API keys stored</h3>
            <p className="mb-6 text-gray-500">Click &quot;Add New Key&quot; to get started</p>
            <button
                className="group inline-flex items-center font-medium text-obsidian-accent transition-colors hover:text-purple-400"
                onClick={onOpenAddModal}
                type="button"
            >
                <Plus className="mr-1 h-4 w-4 transition-transform group-hover:scale-125" />
                Add Key Now
            </button>
        </div>
    );
}
