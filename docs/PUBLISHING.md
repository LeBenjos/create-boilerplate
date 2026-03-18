# 📦 Publishing Guide

## Development Workflow

**Develop Vanilla:**
```bash
cd packages/template-vanilla
npm install
npm run dev
```

**Develop Vue:**
```bash
cd packages/template-vue
npm install
npm run dev
```

**Run Tests:**
```bash
cd packages
npm run test
```

## Publishing Workflow

**1. Bump version (from project root):**
```bash
npm run version patch   # patch: 1.0.x
npm run version minor   # minor: 1.x.0
npm run version major   # major: x.0.0
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
npm publish --access public
```
