import { useState } from "react";
import { Trash2, Copy, Check } from "lucide-react";

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
}

export default function KeyCard({ keyData, onDelete }: KeyCardProps) {
    const [copied, setCopied] = useState(false);

    function copyToClipboard() {
        navigator.clipboard.writeText(keyData.key);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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

            <div className="bg-black/30 p-2 rounded font-mono text-sm text-gray-300 break-all flex justify-between items-center group-hover:bg-black/50 transition-colors shadow-inner">
                <span>{keyData.key}</span>
                <button
                    className="ml-2 text-gray-400 hover:text-white transition-colors focus:outline-none"
                    onClick={copyToClipboard}
                    title="Copy to clipboard"
                >
                    {copied ? (
                        <span className="text-green-400 flex items-center animate-in fade-in zoom-in duration-200">
                           <Check className="h-4 w-4 mr-1"/> Copied!
                        </span>
                    ) : (
                        <Copy className="h-4 w-4" />
                    )}
                </button>
            </div>

            <div className="mt-2 text-xs text-gray-500">
                Created: {new Date(keyData.createdAt).toLocaleDateString()}
            </div>
        </div>
    );
}
