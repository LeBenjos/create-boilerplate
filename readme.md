# 🎨 Three.js Boilerplate

Monorepo containing CLI and templates for scaffolding Three.js projects with framework support.

## 📦 For Users

Create a new Three.js project:

```bash
npm create @benjos/boilerplate@latest
```

Choose between:
- **Vanilla** → Three.js + TypeScript + HTML views
- **Vue** → Three.js + TypeScript + Vue components

## 🛠️ For Developers

### Prerequisites

- Node.js >= 18.0.0

### Setup

```bash
npm install
```

### Scripts

| Command | Description |
|---|---|
| `npm run lint` | Run ESLint with zero-warnings policy |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run version <patch\|minor\|major>` | Bump version across all packages |

### Testing

```bash
cd packages
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
```

## 📄 License

MIT
