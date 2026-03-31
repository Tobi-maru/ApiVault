import { useState, useEffect, useCallback } from "react";
import KeyCard from "./components/KeyCard";
import Modal from "./components/Modal";
import { Plus, Database, AlertCircle, X, Loader2, Search } from "lucide-react";
import { SignedIn, SignedOut, SignIn, UserButton, useAuth } from "@clerk/clerk-react";

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
    const [searchTerm, setSearchTerm] = useState("");
    const { getToken, isSignedIn, isLoaded } = useAuth();

    // Form state
    const [newKey, setNewKey] = useState<{
        service: string;
        projectName: string;
        key: string;
        modelName?: string;
        usageLimit?: number;
    }>({
        service: "",
        projectName: "",
        key: "",
    });

    const loadKeys = useCallback(async () => {
        if (!isSignedIn) return;
        try {
            setLoading(true);
            const token = await getToken();
            const res = await fetch(`${API_BASE}/keys`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to load keys");
            const data = await res.json();
            setKeys(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [isSignedIn, getToken]);

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            loadKeys();
        } else if (isLoaded && !isSignedIn) {
            setLoading(false);
            setKeys([]);
        }
    }, [isLoaded, isSignedIn, loadKeys]);

    async function addKey(e: React.FormEvent) {
        e.preventDefault();
        try {
            const token = await getToken();
            const res = await fetch(`${API_BASE}/keys`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
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
                modelName: "",
                usageLimit: undefined,
            });
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to add key");
        }
    }

    async function deleteKey(id: string) {
        try {
            const token = await getToken();
            const res = await fetch(`${API_BASE}/keys/${id}`, { 
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to delete key");
            setKeys((prev) => prev.filter((k) => k.id !== id));
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to delete key");
        }
    }

    function updateKeyUsage(id: string, newUsage: number) {
        setKeys(prevKeys => 
            prevKeys.map(k => k.id === id ? { ...k, currentUsage: newUsage } : k)
        );
    }

    const filteredKeys = keys.filter(
        (k) =>
            k.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
            k.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (k.modelName && k.modelName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-obsidian-bg via-[#0a0a0a] to-[#000000] p-8 font-sans selection:bg-purple-500/30 selection:text-white">
            <SignedOut>
                <div className="flex flex-col items-center justify-center min-h-[85vh] animate-in fade-in zoom-in duration-700">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                        <Database className="h-20 w-20 text-purple-400 relative z-10" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-5xl font-extrabold text-white mb-4 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-500 bg-clip-text text-transparent transform transition-all hover:scale-105 duration-300">
                        API Vault
                    </h1>
                    <p className="text-gray-400 text-lg mb-10 max-w-md text-center">
                        Securely centralize, trace, and govern your project API keys with native usage limits.
                    </p>
                    <div className="transform scale-105 sm:scale-100 transition-all">
                        <SignIn />
                    </div>
                </div>
            </SignedOut>

            <SignedIn>
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
                        <div className="flex items-center gap-4">
                            <button
                                className="bg-obsidian-accent hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 flex items-center gap-2"
                                onClick={() => setShowModal(true)}
                            >
                                <Plus className="h-5 w-5" />
                                Add New Key
                            </button>
                            <div className="bg-black/40 p-1.5 rounded-full border border-gray-700/50 hover:border-purple-500/50 transition-colors shadow-lg">
                                <UserButton appearance={{
                                    elements: {
                                        userButtonAvatarBox: 'w-10 h-10',
                                    }
                                }} />
                            </div>
                        </div>
                    </div>
                
                <div className="mt-8 relative max-w-xl">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-gray-700/50 rounded-xl pl-10 pr-4 py-3 text-white focus:border-obsidian-accent focus:ring-1 focus:ring-obsidian-accent focus:outline-none transition-all placeholder:text-gray-600"
                        placeholder="Search keys by service, project, or model..."
                    />
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
                        {filteredKeys.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-gray-400">
                                No keys found matching "{searchTerm}"
                            </div>
                        ) : (
                            filteredKeys.map((keyData) => (
                                <KeyCard 
                                    key={keyData.id} 
                                    keyData={keyData} 
                                    onDelete={deleteKey} 
                                    onUpdateUsage={updateKeyUsage}
                                />
                            ))
                        )}
                    </div>
                )}
            </main>

                <Modal isOpen={showModal} title="Add New API Key" onClose={() => setShowModal(false)}>
                    <form onSubmit={addKey} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Service Name *
                                </label>
                                <input
                                    type="text"
                                    id="service"
                                    value={newKey.service}
                                    onChange={(e) => setNewKey({ ...newKey, service: e.target.value })}
                                    required
                                    className="w-full bg-black/40 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white focus:border-obsidian-accent focus:ring-1 focus:ring-obsidian-accent focus:outline-none transition-all placeholder:text-gray-600"
                                    placeholder="e.g., OpenAI"
                                />
                            </div>
                            <div>
                                <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Project Name *
                                </label>
                                <input
                                    type="text"
                                    id="projectName"
                                    value={newKey.projectName}
                                    onChange={(e) => setNewKey({ ...newKey, projectName: e.target.value })}
                                    required
                                    className="w-full bg-black/40 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white focus:border-obsidian-accent focus:ring-1 focus:ring-obsidian-accent focus:outline-none transition-all placeholder:text-gray-600"
                                    placeholder="e.g., My App"
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="modelName" className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Model Name (Optional)
                                </label>
                                <input
                                    type="text"
                                    id="modelName"
                                    value={newKey.modelName || ""}
                                    onChange={(e) => setNewKey({ ...newKey, modelName: e.target.value })}
                                    className="w-full bg-black/40 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white focus:border-obsidian-accent focus:ring-1 focus:ring-obsidian-accent focus:outline-none transition-all placeholder:text-gray-600"
                                    placeholder="e.g., GPT-4"
                                />
                            </div>
                            <div>
                                <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Usage Limit $ (Optional)
                                </label>
                                <input
                                    type="number"
                                    id="usageLimit"
                                    min="0"
                                    step="any"
                                    value={newKey.usageLimit || ""}
                                    onChange={(e) => setNewKey({ ...newKey, usageLimit: e.target.value ? parseFloat(e.target.value) : undefined })}
                                    className="w-full bg-black/40 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white focus:border-obsidian-accent focus:ring-1 focus:ring-obsidian-accent focus:outline-none transition-all placeholder:text-gray-600"
                                    placeholder="e.g., 50.00"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="key" className="block text-sm font-medium text-gray-300 mb-1.5">
                                API Key *
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
            </SignedIn>
        </div>
    );
}
