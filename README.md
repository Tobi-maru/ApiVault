# API Vault

Securely manage and store your API keys in an obsidian-themed dashboard. Built with a Node.js/Express backend and a React (Vite) frontend.

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (Recommended package manager)
- Node.js

### Installation

1. Clone the repository
2. Install dependencies for both backend and frontend:
   ```bash
   bun install
   cd client && bun install
   ```
3. Set up the database:
   ```bash
   bunx prisma generate
   bunx prisma db push
   ```

### Running the Application

Start both the backend API and frontend dev server with a single command:
```bash
bun run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, TypeScript, Prisma (SQLite)
- **Frontend**: React, Vite, Tailwind CSS v4, Lucide React
- **Package Manager**: Bun
