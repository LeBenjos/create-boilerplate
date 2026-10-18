# 🎨 Three.js Vanilla Boilerplate

Three.js + Vite + TypeScript boilerplate with a singleton-based architecture.

## 🚀 Quick Start

```bash
npm i
npm run dev
```

## ✨ Features

- Three.js + Vite + TypeScript
- GLSL shader support (vite-plugin-glsl)
- Singleton-based manager architecture (DebugManager, LoaderManager, ThreeAssetsManager, etc.)
- Lazy loading with animated transitions between views
- Multi-view system with HTML views and Three.js views (init/reset/dispose lifecycle)
- ThreeApp layer (LoaderThreeApp, MainThreeApp) for scene orchestration
- Camera controller system with base classes (MainThreeCameraController, DebugThreeCameraController)
- ESLint + Prettier

## 🐛 Debug Mode

Add `#debug` to URL: `http://localhost:5173/#debug`

- `Shift + H` → Toggle debug UI + perf monitor
- `Shift + C` → Toggle debug camera (OrbitControls)
- `Shift + W` → Toggle wireframe
- `Ctrl + Click` → Center camera on object

## 📄 License

MIT
