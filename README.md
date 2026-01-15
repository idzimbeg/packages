# FSD Packages

Reusable packages following Feature-Sliced Design architecture for React applications.

## 🚀 Quick Start: Automated Monorepo Setup

The fastest way to get started is using our automated setup script that creates a complete monorepo with all packages configured:

```bash
# Copy create-monorepo.sh from this repo, then run:
./create-monorepo.sh my-project my-app
cd my-project
pnpm dev
```

See [CREATE_MONOREPO_GUIDE.md](./CREATE_MONOREPO_GUIDE.md) for detailed instructions.

Or follow [PACKAGE_INSTALLATION_GUIDE.md](./PACKAGE_INSTALLATION_GUIDE.md) for manual setup.

---

## Packages

- **[@packages/auth-module](./packages/auth-module)** - Complete authentication module with social login support
- **[@packages/core-ui](./packages/core-ui)** - Core UI components (Button, Card, Input, etc.)
- **[@packages/data-table-module](./packages/data-table-module)** - Advanced data table with filtering and sorting
- **[@packages/form-module](./packages/form-module)** - Dynamic form builder

## Installation

### Option 1: Install from GitHub

```bash
# Install all packages
pnpm add github:yourusername/fsd-packages#packages/auth-module
pnpm add github:yourusername/fsd-packages#packages/core-ui
pnpm add github:yourusername/fsd-packages#packages/data-table-module
pnpm add github:yourusername/fsd-packages#packages/form-module
```

### Option 2: Install from npm (if published)

```bash
pnpm add @yourusername/auth-module @yourusername/core-ui @yourusername/data-table-module @yourusername/form-module
```

### Option 3: Use as Git Submodule

```bash
cd your-app
git submodule add https://github.com/yourusername/fsd-packages.git packages
pnpm install
```

Then in your app's package.json:

```json
{
  "dependencies": {
    "@packages/auth-module": "file:./packages/packages/auth-module",
    "@packages/core-ui": "file:./packages/packages/core-ui"
  }
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

## Usage

See individual package READMEs for detailed usage instructions:

- [Auth Module Usage](./packages/auth-module/README.md)
- [Core UI Usage](./packages/core-ui/README.md)
- [Data Table Usage](./packages/data-table-module/README.md)
- [Form Module Usage](./packages/form-module/README.md)

## Publishing

To publish packages to npm:

```bash
# Build packages
pnpm build

# Publish (requires npm authentication)
cd packages/auth-module
npm publish

# Or publish all at once
pnpm publish:all
```

## License

MIT
