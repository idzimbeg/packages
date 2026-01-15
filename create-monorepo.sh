#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_step() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}!${NC} $1"
}

# Check if project name is provided
if [ -z "$1" ]; then
    print_error "Please provide a project name"
    echo "Usage: ./create-monorepo.sh <project-name> [app-name]"
    exit 1
fi

PROJECT_NAME=$1
APP_NAME=${2:-my-app}

# Step 1-2: Create root directory and initialize git
print_step "Creating $PROJECT_NAME directory and initializing git..."
mkdir "$PROJECT_NAME"
cd "$PROJECT_NAME" || exit 1
git init
print_success "Git repository initialized"

# Step 3: Initialize pnpm
print_step "Initializing pnpm workspace..."
pnpm init -y
print_success "pnpm initialized"

# Step 4: Create pnpm-workspace.yaml
print_step "Creating pnpm-workspace.yaml..."
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - "packages/packages/*"
  - "apps/*"
EOF
print_success "pnpm-workspace.yaml created"

# Step 5: Update root package.json
print_step "Updating root package.json..."
cat > package.json << EOF
{
  "name": "$PROJECT_NAME",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter \"./apps/*\" dev",
    "build": "pnpm --filter \"./apps/*\" build"
  }
}
EOF
print_success "Root package.json updated"

# Step 6: Add packages as git submodule
print_step "Adding packages repository as git submodule..."
git submodule add https://github.com/idzimbeg/packages.git packages
git submodule update --init --recursive
print_success "Packages submodule added"

# Step 6.1: Fix auth-module tsup.config.ts
print_step "Updating auth-module external dependencies..."
TSUP_CONFIG="packages/packages/auth-module/tsup.config.ts"
if [ -f "$TSUP_CONFIG" ]; then
    sed -i.bak "s/external: \['react', 'react-dom'\]/external: ['react', 'react-dom', '@tanstack\/react-query', 'clsx', 'tailwind-merge']/" "$TSUP_CONFIG"
    rm "${TSUP_CONFIG}.bak"
    print_success "tsup.config.ts updated"
else
    print_warning "tsup.config.ts not found, skipping..."
fi

# Step 6.2: Add dependencies to auth-module
print_step "Adding dependencies to auth-module..."
cd packages/packages/auth-module || exit 1
pnpm add @tanstack/react-query clsx tailwind-merge
cd ../../..
print_success "Auth-module dependencies added"

# Step 7: Install dependencies and build auth-module
print_step "Installing all dependencies..."
pnpm install
print_success "Dependencies installed"

print_step "Building auth-module..."
pnpm --filter @packages/auth-module build
print_success "Auth-module built successfully"

# Step 8-9: Create apps directory and Vite app
print_step "Creating Vite app in apps/$APP_NAME..."
mkdir -p "apps/$APP_NAME"
cd "apps/$APP_NAME" || exit 1
printf "n\nn\n" | pnpm create vite@latest . --template react-ts
print_success "Vite app created"

cd ../..

# Step 10: Update app package.json
print_step "Updating app package.json..."
cat > "apps/$APP_NAME/package.json" << EOF
{
  "name": "$APP_NAME",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@packages/auth-module": "workspace:*",
    "@tailwindcss/vite": "^4.1.18",
    "@tanstack/react-query": "^5.90.17",
    "clsx": "^2.1.1",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "tailwind-merge": "^3.4.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "tailwindcss": "^4.1.18",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.46.4",
    "vite": "^7.2.4"
  }
}
EOF
print_success "App package.json updated"

# Step 11: Configure Vite
print_step "Configuring Vite with Tailwind CSS v4..."
cat > "apps/$APP_NAME/vite.config.ts" << 'EOF'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ["@packages/auth-module"],
  },
});
EOF
print_success "vite.config.ts created"

# Step 12: Update index.css for Tailwind v4
print_step "Updating index.css for Tailwind CSS v4..."
echo '@import "tailwindcss";' > "apps/$APP_NAME/src/index.css"
print_success "index.css updated"

# Step 13: Create auth.config.ts
print_step "Creating auth.config.ts..."
cat > "apps/$APP_NAME/src/auth.config.ts" << 'EOF'
import { createAuthModule } from "@packages/auth-module";

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
}

const TOKEN_KEY = "app_auth_token";

const routes = {
  login: "/login",
  register: "/register",
  afterLogin: "/dashboard",
  afterLogout: "/login",
};

const theme = {
  card: "w-full max-w-md mx-auto rounded-lg border bg-gray-800 p-6 shadow-sm",
  cardHeader: "space-y-1 mb-6",
  cardTitle: "text-2xl font-bold tracking-tight",
  cardDescription: "text-sm text-gray-600",
  cardContent: "",
  form: "space-y-4",
  field: "space-y-2",
  label: "text-sm font-medium leading-none",
  input:
    "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  inputError: "border-red-500",
  button:
    "inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  buttonLoading: "opacity-70",
  error: "rounded-md bg-red-50 p-3 text-sm text-red-600",
  link: "text-sm text-blue-600 hover:underline cursor-pointer",
  socialContainer: "space-y-3",
  socialButton:
    "inline-flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  socialButtonLoading: "opacity-70",
  divider: "relative my-6",
  dividerText: "relative flex justify-center text-xs uppercase",
};

const apiClient = {
  login: async (credentials: { email: string; password: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      user: {
        id: "1",
        email: credentials.email,
        name: "Test User",
        role: "user",
      },
      token: "mock-jwt-token-" + Date.now(),
    };
  },
  register: async (data: {
    email: string;
    password: string;
    name?: string;
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      user: {
        id: "1",
        email: data.email,
        name: data.name || "New User",
        role: "user",
      },
      token: "mock-jwt-token-" + Date.now(),
    };
  },
  logout: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
  getCurrentUser: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error("No token found");
    return {
      id: "1",
      email: "user@example.com",
      name: "Test User",
      role: "user",
    };
  },
  refreshToken: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { token: "mock-jwt-token-refreshed-" + Date.now() };
  },
};

export const authModule = createAuthModule<User>(
  {
    apiClient,
    storage: {
      getToken: () => localStorage.getItem(TOKEN_KEY),
      setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
      removeToken: () => localStorage.removeItem(TOKEN_KEY),
    },
    routes,
    theme,
  },
  {
    hasRole: (user: User, role: string) => user.role === role,
  }
);

export const {
  AuthProvider,
  useAuth,
  LoginForm,
  RegisterForm,
  ProtectedRoute,
} = authModule;
EOF
print_success "auth.config.ts created"

# Step 14: Update App.tsx
print_step "Updating App.tsx..."
cat > "apps/$APP_NAME/src/App.tsx" << 'EOF'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, LoginForm } from "./auth.config";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <LoginForm />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
EOF
print_success "App.tsx updated"

# Step 15: Install app dependencies
print_step "Installing app dependencies..."
cd "apps/$APP_NAME" || exit 1
pnpm install
cd ../..
print_success "App dependencies installed"

# Final message
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Monorepo setup completed!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "To start the development server:"
echo -e "  ${BLUE}cd $PROJECT_NAME${NC}"
echo -e "  ${BLUE}pnpm dev${NC}"
echo ""
echo "Your app will be available at http://localhost:5173"
