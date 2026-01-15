# Automated Monorepo Setup Script

This script automates the entire process of creating a new monorepo with the `@packages/auth-module` from the packages repository.

## Prerequisites

Before running the script, make sure you have:

- **Git** installed
- **Node.js** (v18 or higher)
- **pnpm** installed globally (`npm install -g pnpm`)

## Quick Start

### 1. Copy the Script

Copy the contents of [`create-monorepo.sh`](./create-monorepo.sh) from this repository.

### 2. Create the Script File

In your terminal, navigate to where you want to create your monorepo's parent directory:

```bash
cd ~/projects  # or wherever you want to create your project
```

Create and edit the script file:

```bash
nano create-monorepo.sh  # or use your preferred editor (vim, code, etc.)
```

Paste the script contents, save, and exit.

### 3. Make it Executable

```bash
chmod +x create-monorepo.sh
```

### 4. Run the Script

#### Basic Usage (default app name: "my-app")

```bash
./create-monorepo.sh my-awesome-project
```

#### With Custom App Name

```bash
./create-monorepo.sh my-awesome-project web-app
```

This will create:

- Project name: `my-awesome-project`
- App name: `web-app`

## What the Script Does

The script automates all steps from the HOW_TO.md guide:

1. ✅ Creates project directory and initializes git
2. ✅ Initializes pnpm workspace
3. ✅ Creates `pnpm-workspace.yaml` configuration
4. ✅ Updates root `package.json`
5. ✅ Adds packages repository as git submodule
6. ✅ Updates auth-module's `tsup.config.ts` with external dependencies
7. ✅ Adds required dependencies to auth-module
8. ✅ Installs all dependencies
9. ✅ Builds the auth-module
10. ✅ Creates Vite app with React and TypeScript
11. ✅ Configures app `package.json` with all dependencies
12. ✅ Sets up Vite config with Tailwind CSS v4
13. ✅ Updates `index.css` for Tailwind CSS v4
14. ✅ Creates `auth.config.ts` with authentication setup
15. ✅ Updates `App.tsx` with auth provider and login form
16. ✅ Installs app dependencies

## After Running the Script

Once the script completes, you can start your development server:

```bash
cd <project-name>
pnpm dev
```

Your app will be available at [http://localhost:5173](http://localhost:5173)

## Project Structure

After running the script, your monorepo will have this structure:

```
<project-name>/
├── packages/
│   └── packages/
│       └── auth-module/      # Git submodule
├── apps/
│   └── <app-name>/
│       ├── src/
│       │   ├── App.tsx
│       │   ├── auth.config.ts
│       │   ├── index.css
│       │   └── main.tsx
│       ├── package.json
│       ├── vite.config.ts
│       └── ...
├── pnpm-workspace.yaml
├── package.json
└── .gitmodules
```

## Troubleshooting

### Script Permission Denied

If you get a "Permission denied" error, make the script executable:

```bash
chmod +x create-monorepo.sh
```

### pnpm Not Found

Install pnpm globally:

```bash
npm install -g pnpm
```

### Git Submodule Issues

If the submodule fails to clone, ensure you have access to the repository and try manually:

```bash
cd <project-name>
git submodule update --init --recursive
```

## Manual Setup

If you prefer to set up the monorepo manually, follow the step-by-step guide in [HOW_TO.md](HOW_TO.md).
