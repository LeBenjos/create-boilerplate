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

Choose a template:
- **Three.js · Experience · Vanilla** → full architecture + HTML views
- **Three.js · POC · Vanilla** → minimal Three.js + Vite setup for quick prototypes

Experience templates include:
- ⚡ Vite for fast development
- 🎨 GLSL shader support (vite-plugin-glsl)
- 🐛 Debug mode with Tweakpane (DebugManager)
- 📦 Singleton-based manager architecture (Loader, Debug, Assets, Raycaster, etc.)
- 🔄 Lazy loading with animated transitions between views
- 🎭 Multi-view system (HTML views + Three.js views with dispose/cleanup)
- 🎬 ThreeApp architecture (LoaderThreeApp, MainThreeApp)
- 📝 TypeScript + ESLint + Prettier

## 📄 License

MIT
