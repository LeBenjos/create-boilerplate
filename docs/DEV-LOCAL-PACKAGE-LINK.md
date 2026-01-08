# Local Package Development with npm link/unlink

## Goal
Quickly test and develop a local package (e.g. @benjos/cookware) in your project without publishing to npm.

---

## 1. Link a Local Package

### a) In the package source folder (e.g. cookware):
```sh
npm link
```

### b) In your project folder (e.g. template-vanilla):
```sh
npm link @benjos/cookware
```

---

## 2. Test & Edit
- Edit the package source code (in cookware).
- Restart your project (npm run dev) to see changes.

---

## 3. Unlink (Return to npm version)

### a) In your project folder:
```sh
npm unlink --no-save @benjos/cookware
npm install @benjos/cookware
```

### b) In the package source folder:
```sh
npm unlink -g @benjos/cookware
```

---

## 4. Check Active Links
- List all global links:
  ```sh
  npm ls -g --link
  ```
- List local links in a project:
  ```sh
  npm ls --link
  ```

---

## BONUS. Global CLI usage

To make your CLI command (e.g. create-boilerplate) available everywhere with your local version:

1. In the package source folder (where package.json with "bin" is):
  ```sh
  npm link
  ```
2. You can now run `create-boilerplate` in any terminal, using your local code.

To remove the global CLI:
  ```sh
  npm unlink -g @benjos/create-boilerplate
  ```