# Installing Your Packages in Another Project

You have several options for using these packages in other projects, depending on your needs.

## Option 1: Publish to npm Registry (Recommended for Production)

### Step 1: Prepare Packages for Publishing

Update each package's `package.json`:

```bash
cd packages/auth-module
```

**packages/auth-module/package.json:**

```json
{
  "name": "@yourorg/auth-module", // Change to your org/scope
  "version": "1.0.0",
  "private": false, // Must be false to publish
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist", "README.md"],
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "pnpm build"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0"
  }
}
```

### Step 2: Add TypeScript Build Configuration

**packages/auth-module/tsconfig.json:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.test.tsx"]
}
```

### Step 3: Build and Publish

```bash
# Login to npm (first time only)
npm login

# Build the package
cd packages/auth-module
pnpm build

# Publish to npm
npm publish --access public

# Repeat for other packages
cd ../core-ui
pnpm build
npm publish --access public
```

### Step 4: Install in Another Project

```bash
# In your new project
pnpm add @yourorg/auth-module @yourorg/core-ui @yourorg/data-table-module @yourorg/form-module

# Or with npm
npm install @yourorg/auth-module @yourorg/core-ui @yourorg/data-table-module @yourorg/form-module
```

---

## Option 2: Use Local File System (For Development/Testing)

### Method A: Install from Local Path

```bash
# In your new project, install from local path
pnpm add file:../path/to/vite-project/packages/auth-module
pnpm add file:../path/to/vite-project/packages/core-ui
pnpm add file:../path/to/vite-project/packages/data-table-module
pnpm add file:../path/to/vite-project/packages/form-module
```

**package.json will show:**

```json
{
  "dependencies": {
    "@packages/auth-module": "file:../path/to/vite-project/packages/auth-module",
    "@packages/core-ui": "file:../path/to/vite-project/packages/core-ui"
  }
}
```

### Method B: Use pnpm Link

```bash
# In the package directory
cd packages/auth-module
pnpm link --global

# In your new project
cd /path/to/new-project
pnpm link --global @packages/auth-module
```

---

## Option 3: Private npm Registry (Enterprise)

### Using GitHub Packages

**1. Create `.npmrc` in package root:**

```
@yourorg:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

**2. Update package name:**

```json
{
  "name": "@yourorg/auth-module",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourorg/your-repo.git"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

**3. Publish:**

```bash
npm publish
```

**4. Install in other projects:**

```bash
# Create .npmrc in consuming project
echo "@yourorg:registry=https://npm.pkg.github.com" > .npmrc
pnpm add @yourorg/auth-module
```

### Using Verdaccio (Self-Hosted)

```bash
# Install Verdaccio
npm install -g verdaccio

# Start Verdaccio
verdaccio

# Point to local registry
npm set registry http://localhost:4873

# Publish packages
npm publish

# Install in other projects
pnpm add @packages/auth-module --registry http://localhost:4873
```

---

## Option 4: Git Repository (Simple Sharing)

### Method A: Install Directly from Git

```bash
# Using GitHub
pnpm add "github:yourorg/your-repo#packages/auth-module"

# Using GitLab
pnpm add "gitlab:yourorg/your-repo#packages/auth-module"

# With specific branch/tag
pnpm add "github:yourorg/your-repo#v1.0.0"
```

**package.json:**

```json
{
  "dependencies": {
    "@packages/auth-module": "github:yourorg/your-repo#packages/auth-module"
  }
}
```

### Method B: Git Submodules

```bash
# In your new project
git submodule add https://github.com/yourorg/your-repo.git packages/shared

# Install from submodule
pnpm add file:./packages/shared/packages/auth-module
```

---

## Option 5: Monorepo Approach (Recommended for Multiple Related Projects)

Keep packages in a shared monorepo and create multiple apps:

```
my-monorepo/
├── packages/
│   ├── auth-module/
│   ├── core-ui/
│   ├── data-table-module/
│   └── form-module/
├── apps/
│   ├── web-app/          # Your current app
│   ├── admin-dashboard/  # New app
│   └── mobile-app/       # Another app
├── pnpm-workspace.yaml
└── package.json
```

**pnpm-workspace.yaml:**

```yaml
packages:
  - "packages/*"
  - "apps/*"
```

**apps/admin-dashboard/package.json:**

```json
{
  "name": "admin-dashboard",
  "dependencies": {
    "@packages/auth-module": "workspace:*",
    "@packages/core-ui": "workspace:*",
    "@packages/data-table-module": "workspace:*",
    "@packages/form-module": "workspace:*"
  }
}
```

Install dependencies:

```bash
# From monorepo root
pnpm install
```

---

## Recommended Workflow

### For Personal/Internal Projects:

1. **Development**: Use Option 5 (Monorepo) - keeps everything in sync
2. **Testing**: Use Option 2 (Local file system) - test in isolation
3. **Production**: Use Option 1 (npm publish) - standard distribution

### For Open Source:

- Use Option 1 (npm Registry) exclusively

### For Enterprise:

- Use Option 3 (Private npm Registry) for secure distribution
- Use Option 5 (Monorepo) for related internal projects

---

## Example: Installing in a New Project

### Scenario: Create a new Next.js app using your auth module

```bash
# Create new Next.js project
npx create-next-app@latest my-new-app
cd my-new-app

# Install from npm (if published)
pnpm add @yourorg/auth-module @yourorg/core-ui

# OR install from local (for testing)
pnpm add file:../vite-project/packages/auth-module file:../vite-project/packages/core-ui

# Use in your Next.js app
```

**app/login/page.tsx:**

```tsx
"use client";

import { createAuthModule } from "@yourorg/auth-module";
import { Button } from "@yourorg/core-ui";

export default function LoginPage() {
  // Use the auth module
  const authModule = createAuthModule({
    // ... your config
  });

  return <authModule.LoginForm />;
}
```

---

## Package Build Setup

For all packages, you'll want to add build scripts. Here's a complete setup:

**packages/auth-module/package.json:**

```json
{
  "name": "@yourorg/auth-module",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc && tsc-alias",
    "dev": "tsc --watch",
    "clean": "rm -rf dist",
    "prepublishOnly": "pnpm clean && pnpm build"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tsc-alias": "^1.8.8"
  }
}
```

**Root package.json (add scripts to build all):**

```json
{
  "scripts": {
    "build:packages": "pnpm --filter './packages/*' build",
    "publish:all": "pnpm --filter './packages/*' publish"
  }
}
```

Build all packages at once:

```bash
pnpm build:packages
```

---

## Next Steps

1. **Choose your distribution method** based on your use case
2. **Set up build configuration** (TypeScript, bundler)
3. **Add build scripts** to package.json
4. **Test installation** in a separate project
5. **Document usage** in each package's README
6. **Version management** - use semantic versioning

Need help setting up any of these options? Let me know which approach you'd like to use!
