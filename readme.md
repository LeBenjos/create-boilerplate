# 🎨 Three.js Boilerplate

Monorepo containing CLI and templates for scaffolding Three.js projects with framework support.

## 📦 For Users

Create a new Three.js project:

```bash
npm create @benjos/boilerplate@latest
```

Choose a template:
- **Three.js · Experience · Vanilla** → full architecture + HTML views
- **Three.js · POC · Vanilla** → minimal Three.js + Vite setup for quick prototypes

## 🛠️ For Developers

### Prerequisites

- Node.js >= 20.12.0

### Setup

```bash
npm install
```

### Scripts

| Command | Description |
|---|---|
| `npm test` | Build the CLI and run its tests |
| `npm run lint` | Run ESLint with zero-warnings policy |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run bump <patch\|minor\|major>` | Bump version across all packages |

### Templates

Templates live in `packages/templates/<tech>/<kind>/<framework>`. Each one ships its gitignore as `_gitignore` (npm strips `.gitignore` from published packages); the CLI renames it on copy.

To add one: create the folder and add its path to `TEMPLATE_CHOICES` (`packages/src/constants.ts`). `npm run bump` finds every template with a `package.json` automatically.

## 📄 License

MIT
