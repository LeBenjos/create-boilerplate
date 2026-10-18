import { DEFAULT_PROJECT_NAME, PROJECT_NAME_MAX_LENGTH, RESERVED_NAMES } from './constants.js';

const PROJECT_NAME_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

export function validateProjectName(value: string): string | true {
    if (value === '.') return true;
    if (!PROJECT_NAME_PATTERN.test(value)) {
        return 'Project name must contain only lowercase letters, numbers, and hyphens, and start with a letter or number (or "." for current directory)';
    }
    if (value.length > PROJECT_NAME_MAX_LENGTH) {
        return `Project name must be at most ${PROJECT_NAME_MAX_LENGTH} characters.`;
    }
    if (RESERVED_NAMES.has(value)) {
        return `"${value}" is a reserved name. Please choose a different project name.`;
    }
    return true;
}

// Turns a directory name (used with ".") into a valid package name, e.g. "My Project" -> "my-project"
export function toPackageName(directoryName: string): string {
    const name = directoryName
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return validateProjectName(name) === true ? name : DEFAULT_PROJECT_NAME;
}
