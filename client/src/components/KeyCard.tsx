import { useState } from "react";
import { Trash2, Copy, Check, Eye, EyeOff, Activity, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

interface KeyCardProps {
    keyData: {
        id: string;
        service: string;
        projectName: string;
        modelName?: string | null;
        currentUsage: number;
        usageLimit?: number | null;
        key: string;
        createdAt: string;
    };
    onDelete: (id: string) => void;
    onUpdateUsage: (id: string, newUsage: number) => void;
}

export default function KeyCard({ keyData, onDelete, onUpdateUsage }: KeyCardProps) {
    const [copied, setCopied] = useState(false);
    const [showKey, setShowKey] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const { getToken } = useAuth();

    function copyToClipboard() {
        navigator.clipboard.writeText(keyData.key);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    async function handleSimulate() {
        try {
            setIsSimulating(true);
            const token = await getToken();
            const res = await fetch(`/api/proxy/simulate/${keyData.id}`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                onUpdateUsage(keyData.id, data.newTotalUsage);
            } else {
                alert(data.error || "Simulation failed");
            }
        } catch (error) {
            console.error("Simulation error", error);
        } finally {
            setIsSimulating(false);
        }
    }

    return (
        <div className="bg-obsidian-bg border border-gray-700 rounded-lg p-4 shadow-lg hover:border-obsidian-accent transition-colors duration-300 relative group animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-xl font-bold text-obsidian-accent">{keyData.service}</h3>
                    <p className="text-xs text-gray-400">{keyData.projectName}</p>
                    {keyData.modelName && (
                        <p className="text-xs text-gray-500 mt-1">Model: {keyData.modelName}</p>
                    )}
                </div>
                <button
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    onClick={() => onDelete(keyData.id)}
                    aria-label="Delete key"
                >
                    <Trash2 className="h-5 w-5" />
                </button>
            </div>

            <div className="bg-black/30 p-2 rounded border border-gray-800 mb-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Vault ID</p>
                <code className="text-xs text-purple-400 font-mono break-all">{keyData.id}</code>
            </div>

            <div className="bg-black/30 p-2 rounded font-mono text-sm text-gray-300 break-all flex justify-between items-center group-hover:bg-black/50 transition-colors shadow-inner mt-2">
                <span className="truncate mr-2">
                    {showKey ? keyData.key : '•'.repeat(Math.min(keyData.key.length, 24))}
                </span>
                <div className="flex items-center flex-shrink-0 gap-2">
                    <button
                        className="text-gray-400 hover:text-white transition-colors focus:outline-none"
                        onClick={() => setShowKey(!showKey)}
                        title={showKey ? "Hide key" : "Show key"}
                    >
                        {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                        className="text-gray-400 hover:text-white transition-colors focus:outline-none"
                        onClick={copyToClipboard}
                        title="Copy to clipboard"
                    >
                        {copied ? (
                            <span className="text-green-400 flex items-center animate-in fade-in zoom-in duration-200">
                               <Check className="h-4 w-4"/>
                            </span>
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>

            {keyData.usageLimit && (
                <div className="mt-4 animate-in fade-in duration-300">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-400">Usage</span>
                        <span className="text-xs text-gray-400">
                            ${keyData.currentUsage} / ${keyData.usageLimit}
                        </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                                (keyData.currentUsage / keyData.usageLimit) > 0.8 
                                    ? 'bg-red-500' 
                                    : 'bg-obsidian-accent'
                            }`}
                            style={{ width: `${Math.min(100, (keyData.currentUsage / keyData.usageLimit) * 100)}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="mt-3 flex justify-between items-center text-xs text-gray-500 border-t border-gray-800 pt-3">
                <span>Created: {new Date(keyData.createdAt).toLocaleDateString()}</span>
                <button 
                    onClick={handleSimulate}
                    disabled={isSimulating || (keyData.usageLimit ? keyData.currentUsage >= keyData.usageLimit : false)}
                    className="flex items-center text-obsidian-accent hover:text-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Simulate API Request"
                >
                    {isSimulating ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                        <Activity className="h-3 w-3 mr-1" />
                    )}
                    Test Route
                </button>
            </div>
        </div>
    );
}
