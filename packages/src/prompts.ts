import { input, select } from '@inquirer/prompts';

import { RESERVED_NAMES, TEMPLATE_CHOICES } from './constants.js';
import { CliError, type ProjectAnswers, type Template } from './types.js';

const PROJECT_NAME_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const DEFAULT_PROJECT_NAME = 'my-threejs-app';

export function validateProjectName(value: string): string | true {
    if (value === '.') return true;
    if (!PROJECT_NAME_PATTERN.test(value)) {
        return 'Project name must contain only lowercase letters, numbers, and hyphens, and start with a letter or number (or "." for current directory)';
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

export async function promptForProject(projectNameArg?: string): Promise<ProjectAnswers> {
    if (projectNameArg !== undefined) {
        const validation = validateProjectName(projectNameArg);
        if (validation !== true) throw new CliError(validation);
    }

    const projectName =
        projectNameArg ??
        (await input({
            message: 'Project name:',
            default: DEFAULT_PROJECT_NAME,
            validate: validateProjectName,
        }));

    const template = await select<Template>({
        message: 'Choose a template:',
        choices: TEMPLATE_CHOICES,
    });

    return { projectName, template };
}
