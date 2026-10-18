# Three.js POC

Minimal Three.js + Vite + TypeScript starter for quick proofs of concept.

## Quick Start

```bash
npm i
npm run dev
```

## What's inside

- `src/main.ts`: scene with a demo cube and a lil-gui control
- `src/components/`: `Camera` (OrbitControls) and `Renderer`, resized and ticked by `@benjos/cookware`
- `src/loaders/`: `gltfLoader` (Draco ready), `hdrLoader`, `textureLoader`, `fontLoader`
- `src/gui.ts`: shared `lil-gui` instance

## Assets

Put files in `public/assets/` and load them with `AssetUtils.GetPath('models/my-model.glb')`.

## Shaders

`.glsl` files are imported as strings (vite-plugin-glsl, with `#include` support):

```ts
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const material = new ShaderMaterial({ vertexShader, fragmentShader });
```
