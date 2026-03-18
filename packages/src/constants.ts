import type { Framework } from './types.js';

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

export const IGNORED_FILES = new Set(['.git', '.gitignore', '.editorconfig', '.DS_Store', '.vscode', '.idea']);

export const FRAMEWORK_CHOICES: { name: string; value: Framework }[] = [
    { name: 'Vanilla (Three.js + TypeScript)', value: 'vanilla' },
    { name: 'Vue (Three.js + TypeScript)', value: 'vue' },
];
