import { useState, useEffect } from "react";
import KeyCard from "./components/KeyCard";
import Modal from "./components/Modal";
import { Plus, Database, AlertCircle, X, Loader2 } from "lucide-react";

type ApiKey = {
    id: string;
    service: string;
    projectName: string;
    modelName?: string | null;
    currentUsage: number;
    usageLimit?: number | null;
    key: string;
    createdAt: string;
};

const API_BASE = "http://localhost:3001/api";

export default function App() {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [newKey, setNewKey] = useState({
        service: "",
        projectName: "",
        key: "",
    });

    useEffect(() => {
        loadKeys();
    }, []);

    async function loadKeys() {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/keys`);
            if (!res.ok) throw new Error("Failed to load keys");
            const data = await res.json();
            setKeys(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }

    async function addKey(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/keys`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newKey),
            });
            if (!res.ok) throw new Error("Failed to add key");
            const addedKey = await res.json();
            setKeys((prev) => [addedKey, ...prev]);
            setShowModal(false);
            setNewKey({
                service: "",
                projectName: "",
                key: "",
            });
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to add key");
        }
    }

    async function deleteKey(id: string) {
        try {
            const res = await fetch(`${API_BASE}/keys/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete key");
            setKeys((prev) => prev.filter((k) => k.id !== id));
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to delete key");
        }
    }

    return (
        <div className="min-h-screen bg-obsidian-bg p-8 font-sans selection:bg-obsidian-accent/30 selection:text-white">
            <header className="max-w-6xl mx-auto mb-12 animate-in slide-in-from-top-4 duration-500">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent inline-flex items-center">
                            <Database className="mr-3 text-purple-500 h-8 w-8" />
                            API Vault
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Securely manage and store your API keys
                        </p>
                    </div>
                    <button
                        className="bg-obsidian-accent hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 flex items-center gap-2"
                        onClick={() => setShowModal(true)}
                    >
                        <Plus className="h-5 w-5" />
                        Add New Key
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 flex items-start justify-between animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 mr-3 text-red-500" />
                            {error}
                        </div>
                        <button
                            className="text-red-400 hover:text-red-300 transition-colors p-1"
                            onClick={() => setError(null)}
                            aria-label="Dismiss error"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-32 animate-in fade-in duration-300">
                        <Loader2 className="animate-spin h-12 w-12 text-obsidian-accent" />
                    </div>
                ) : keys.length === 0 ? (
                    <div className="text-center py-20 bg-black/20 rounded-2xl border border-gray-800/50 animate-in fade-in duration-300">
                        <Database className="h-16 w-16 mx-auto mb-6 text-gray-700" />
                        <h3 className="text-xl font-medium text-gray-300 mb-2">No API keys stored</h3>
                        <p className="text-gray-500 mb-6">Click "Add New Key" to get started</p>
                        <button
                            className="text-obsidian-accent hover:text-purple-400 font-medium transition-colors inline-flex items-center group"
                            onClick={() => setShowModal(true)}
                        >
                            <Plus className="h-4 w-4 mr-1 group-hover:scale-125 transition-transform" />
                            Add Key Now
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {keys.map((keyData) => (
                            <KeyCard key={keyData.id} keyData={keyData} onDelete={deleteKey} />
                        ))}
                    </div>
                )}
            </main>

            <Modal isOpen={showModal} title="Add New API Key" onClose={() => setShowModal(false)}>
                <form onSubmit={addKey} className="space-y-5">
                    <div>
                        <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-1.5">
                            Service Name
                        </label>
                        <input
                            type="text"
                            id="service"
                            value={newKey.service}
                            onChange={(e) => setNewKey({ ...newKey, service: e.target.value })}
                            required
                            className="w-full bg-black/40 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white focus:border-obsidian-accent focus:ring-1 focus:ring-obsidian-accent focus:outline-none transition-all placeholder:text-gray-600"
                            placeholder="e.g., OpenAI, Anthropic"
                        />
                    </div>
                    <div>
                        <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-1.5">
                            Project Name
                        </label>
                        <input
                            type="text"
                            id="projectName"
                            value={newKey.projectName}
                            onChange={(e) => setNewKey({ ...newKey, projectName: e.target.value })}
                            required
                            className="w-full bg-black/40 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white focus:border-obsidian-accent focus:ring-1 focus:ring-obsidian-accent focus:outline-none transition-all placeholder:text-gray-600"
                            placeholder="e.g., My Chat App"
                        />
                    </div>
                    <div>
                        <label htmlFor="key" className="block text-sm font-medium text-gray-300 mb-1.5">
                            API Key
                        </label>
                        <input
                            type="password"
                            id="key"
                            value={newKey.key}
                            onChange={(e) => setNewKey({ ...newKey, key: e.target.value })}
                            required
                            className="w-full bg-black/40 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white focus:border-obsidian-accent focus:ring-1 focus:ring-obsidian-accent focus:outline-none transition-all placeholder:text-gray-600 font-mono tracking-wider"
                            placeholder="sk-..."
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-obsidian-accent hover:bg-purple-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 mt-6 shadow-lg shadow-purple-500/20"
                    >
                        Save API Key
                    </button>
                </form>
            </Modal>
        </div>
    );
}
