# 📦 @benjos/create-boilerplate

CLI to scaffold Three.js projects with framework support.

## 🚀 Quick Start

```bash
# Interactive mode
npm create @benjos/boilerplate@latest

# With project name
npm create @benjos/boilerplate@latest my-threejs-app

# In current directory
npm create @benjos/boilerplate@latest .
```

## ✨ Features

Choose your framework:
- **Vanilla** → Three.js + TypeScript + HTML views
- **Vue** → Three.js + TypeScript + Vue components

Both templates include:
- ⚡ Vite for fast development
- 🎨 GLSL shader support (vite-plugin-glsl)
- 🐛 Debug mode with lil-gui (DebugManager)
- 📦 Singleton-based manager architecture (Loader, Debug, Assets, Raycaster, etc.)
- 🔄 Lazy loading with animated transitions between views
- 🎭 Multi-view system (HTML views + Three.js views with dispose/cleanup)
- 🎬 ThreeApp architecture (LoaderThreeApp, MainThreeApp)
- 📝 TypeScript + ESLint + Prettier

## 🔧 Development

See [MAINTENANCE.md](./MAINTENANCE.md) for contributing.

## 📄 License

MIT
