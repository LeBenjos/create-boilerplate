import { describe, expect, it } from 'vitest';

import { FRAMEWORK_CHOICES, IGNORED_FILES, RESERVED_NAMES } from './constants.js';

describe('RESERVED_NAMES', () => {
    it('contains critical reserved names', () => {
        const expected = ['node', 'npm', 'package', 'test', 'node_modules', 'dist', 'build'];
        for (const name of expected) {
            expect(RESERVED_NAMES.has(name)).toBe(true);
        }
    });
});

describe('IGNORED_FILES', () => {
    it('contains common dotfiles', () => {
        const expected = ['.git', '.gitignore', '.DS_Store'];
        for (const file of expected) {
            expect(IGNORED_FILES.has(file)).toBe(true);
        }
    });
});

describe('FRAMEWORK_CHOICES', () => {
    it('has at least one framework available', () => {
        expect(FRAMEWORK_CHOICES.length).toBeGreaterThan(0);
    });

    it('each choice has a name and value', () => {
        for (const choice of FRAMEWORK_CHOICES) {
            expect(choice.name).toBeTruthy();
            expect(choice.value).toBeTruthy();
        }
    });
});
