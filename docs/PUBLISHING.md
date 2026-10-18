# 📦 Publishing Guide

## Development Workflow

**Develop a template** (e.g. `three/experience/vanilla`, `three/poc/vanilla`):
```bash
cd packages/templates/three/experience/vanilla
npm install
npm run dev
```

## Publishing Workflow

**1. Bump version (from project root):**
```bash
npm run bump patch   # patch: 1.0.x
npm run bump minor   # minor: 1.x.0
npm run bump major   # major: x.0.0
```

This updates the version in all `package.json` files (root, packages, and all templates) and runs `npm install` in each.

**2. Commit and push:**
```bash
git add -A
git commit -m "release: vX.Y.Z"
git push
```

**3. Publish to npm:**
```bash
cd packages
npm login
npm publish --access public
```

`npm publish` first runs `prepublishOnly`: build, tests, then `scripts/check-pack.js` (published templates must match git). Any failure aborts the publish.
