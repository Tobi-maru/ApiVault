import { AlertCircle, X } from 'lucide-react';

type ErrorBannerProps = {
    message: string;
    onDismiss: () => void;
};

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
    return (
        <div className="mb-6 flex items-start justify-between rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-red-200 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center">
                <AlertCircle className="mr-3 h-5 w-5 text-red-500" />
                {message}
            </div>
            <button
                aria-label="Dismiss error"
                className="p-1 text-red-400 transition-colors hover:text-red-300"
                onClick={onDismiss}
                type="button"
            >
                <X className="h-5 w-5" />
            </button>
        </div>
    );
}
