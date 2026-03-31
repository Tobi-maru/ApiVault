import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
import App from './App.tsx'
import './index.css'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      afterSignOutUrl="/"
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#a855f7', // purple-500
          colorBackground: '#000000',
          colorInputBackground: '#111827',
          colorInputText: '#ffffff',
          colorTextSecondary: '#9ca3af',
        },
        elements: {
          card: 'bg-black/40 border border-gray-700/50 shadow-2xl shadow-purple-500/10 rounded-2xl backdrop-blur-xl',
          formButtonPrimary: 'bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 transition-all text-white',
          userButtonAvatarBox: 'w-10 h-10 border-2 border-purple-500/30',
          userButtonPopoverCard: 'bg-black/90 border border-gray-700/50 shadow-xl rounded-2xl backdrop-blur-xl mt-2',
        }
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
