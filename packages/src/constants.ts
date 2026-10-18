export const RESERVED_NAMES = new Set([
    'node',
    'npm',
    'package',
    'test',
    'tests',
    'src',
    'dist',
    'build',
    'lib',
    'node_modules',
]);

// Entries tolerated in a non-empty current directory
export const ALLOWED_EXISTING_ENTRIES = new Set([
    '.git',
    '.gitignore',
    '.editorconfig',
    '.DS_Store',
    '.vscode',
    '.idea',
]);

// Local artifacts at a template's root, present when the CLI runs from the repo (npm link)
export const TEMPLATE_EXCLUDED_ENTRIES = new Set(['node_modules', 'dist', '.claude', '.DS_Store']);

// npm strips `.gitignore` from published packages, so templates ship it under this name
export const TEMPLATE_GITIGNORE_NAME = '_gitignore';

// `value` is the template path relative to `templates/`
export const TEMPLATE_CHOICES = [
    { name: 'Three.js · Experience · Vanilla (TypeScript)', value: 'three/experience/vanilla' },
    { name: 'Three.js · POC · Vanilla (TypeScript)', value: 'three/poc/vanilla' },
] as const;
