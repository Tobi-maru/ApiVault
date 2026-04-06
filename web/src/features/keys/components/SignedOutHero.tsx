import { SignIn } from '@clerk/clerk-react';
import { Database } from 'lucide-react';

export default function SignedOutHero() {
    return (
        <div className="flex min-h-[85vh] w-full max-w-6xl mx-auto flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 px-4 animate-in fade-in zoom-in duration-700">
            <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
                <div className="relative mb-6">
                    <div className="absolute inset-0 rounded-full bg-purple-500 opacity-20 blur-3xl animate-pulse"></div>
                    <Database className="relative z-10 h-20 w-20 text-purple-400" strokeWidth={1.5} />
                </div>
                <h1 className="mb-4 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-500 bg-clip-text text-5xl font-extrabold text-transparent transition-all duration-300 hover:scale-105 xl:text-7xl">
                    API Vault
                </h1>
                <p className="mb-10 max-w-md text-lg text-gray-400">
                    Securely centralize, trace, and govern your project API keys with native usage limits.
                </p>
            </div>
            <div className="flex flex-1 transform justify-center transition-all scale-105 sm:scale-100 lg:justify-end">
                <SignIn />
            </div>
        </div>
    );
}
