# API Vault 🔐

API Vault is a secure, full-stack application designed to help developers centralize, manage, and monitor their API keys. It features robust user authentication, usage limit tracking, and a sleek, dark-themed user interface to keep your credentials perfectly organized.

## ✨ Features

- **Secure Authentication:** Complete login and user management powered by [Clerk](https://clerk.dev/). Note: Users only have access to their own keys.
- **Key Management:** Add, delete, block, and filter API keys based on the service name, project name, or machine learning model.
- **Usage Tracking & Limits:** Specify spending limits for your keys. The intuitive dashboard displays visual progress bars to track current usage safely.
- **API Simulation:** Built-in proxy endpoint to test keys and increment usage numbers seamlessly.
- **Security-first UI:** Keys are masked by default to prevent shoulder-surfing, with single-click copy-to-clipboard functionality.

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Lucide React (Icons)
- Clerk (`@clerk/clerk-react`, `@clerk/themes`)

**Backend:**
- Node.js & Express
- Prisma ORM (SQLite for local development)
- Clerk Middleware (`@clerk/express`)
- Bun (Package Manager & Runner)

##  Getting Started

### Prerequisites
- [Bun](https://bun.sh/) installed on your machine.
- A free [Clerk](https://clerk.com/) account for authentication keys.

### 1. Clone & Install Dependencies
First, clone the repository and install the required packages:

```bash
# Install root (backend) dependencies
bun install

# Install client (frontend) dependencies
cd client
bun install
cd ..
```

### 2. Environment Variables
You will need to configure environmental variables for both the backend and frontend.

**Backend (`/.env`):**
Create a `.env` file in the root directory:
```env
PORT=3001
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
```

**Frontend (`/client/.env.local`):**
Create a `.env.local` file in the `client/` directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```
*(Retrieve these keys from your Clerk Dashboard under **API Keys**).*

### 3. Database Setup
Push the predefined schema to your newly created local SQLite database:

```bash
bunx prisma db push
bunx prisma generate
```

### 4. Run the Application
You can run both the frontend and backend concurrently using the dev script:

```bash
bun run dev
```

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001

## 📁 Project Structure

```text
├── client/                # React (Vite) frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components (Modals, KeyCards)
│   │   ├── App.tsx        # Main application logic & state
│   │   └── main.tsx       # Entry point & Clerk provider setup
├── prisma/                # Prisma ORM schema & SQLite database
├── src/                   # Node.js Express backend
│   ├── routes/            # API endpoints (keys, proxy)
│   ├── db.ts              # Prisma client initialization
│   └── index.ts           # Server entry point & middleware setup
└── package.json           # Workspace configurations
```

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).