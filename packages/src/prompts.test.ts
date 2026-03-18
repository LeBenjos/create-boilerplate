import { describe, expect, it } from 'vitest';

import { RESERVED_NAMES } from './constants.js';
import { validateProjectName } from './prompts.js';

describe('validateProjectName', () => {
    it('accepts valid lowercase names', () => {
        expect(validateProjectName('my-app')).toBe(true);
        expect(validateProjectName('app123')).toBe(true);
        expect(validateProjectName('a')).toBe(true);
        expect(validateProjectName('my-threejs-app')).toBe(true);
    });

    it('accepts "." for current directory', () => {
        expect(validateProjectName('.')).toBe(true);
    });

    it('rejects names with uppercase letters', () => {
        expect(validateProjectName('MyApp')).toBeTypeOf('string');
        expect(validateProjectName('APP')).toBeTypeOf('string');
    });

    it('rejects names with spaces', () => {
        expect(validateProjectName('my app')).toBeTypeOf('string');
    });

    it('rejects names with special characters', () => {
        expect(validateProjectName('my_app')).toBeTypeOf('string');
        expect(validateProjectName('my.app')).toBeTypeOf('string');
        expect(validateProjectName('my@app')).toBeTypeOf('string');
    });

    it('rejects all reserved names that pass format validation', () => {
        const formatValid = [...RESERVED_NAMES].filter((name) => /^[a-z0-9-]+$/.test(name));
        expect(formatValid.length).toBeGreaterThan(0);

        for (const name of formatValid) {
            const result = validateProjectName(name);
            expect(result).toBeTypeOf('string');
            expect(result).toContain('reserved');
        }
    });

    it('rejects reserved names with invalid characters via format check', () => {
        const result = validateProjectName('node_modules');
        expect(result).toBeTypeOf('string');
        expect(result).toContain('lowercase');
    });

    it('returns descriptive error message for invalid format', () => {
        const result = validateProjectName('My-App');
        expect(result).toContain('lowercase');
    });

    it('returns descriptive error message for reserved name', () => {
        const result = validateProjectName('node');
        expect(result).toContain('"node"');
        expect(result).toContain('reserved');
    });
});
