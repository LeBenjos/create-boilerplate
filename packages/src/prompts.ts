import { input, select } from '@inquirer/prompts';

import { FRAMEWORK_CHOICES, RESERVED_NAMES } from './constants.js';
import type { Framework, ProjectAnswers } from './types.js';

export function validateProjectName(value: string): string | true {
    if (value === '.') return true;
    if (!/^[a-z0-9-]+$/.test(value)) {
        return 'Project name must contain only lowercase letters, numbers, and hyphens (or "." for current directory)';
    }
    if (RESERVED_NAMES.has(value)) {
        return `"${value}" is a reserved name. Please choose a different project name.`;
    }
    return true;
}

export async function promptForProject(projectNameArg?: string): Promise<ProjectAnswers> {
    const projectName = projectNameArg ?? await input({
        message: 'Project name:',
        default: 'my-threejs-app',
        validate: validateProjectName,
    });

    const framework = await select<Framework>({
        message: 'Choose a framework:',
        choices: FRAMEWORK_CHOICES,
    });

    return { projectName, framework };
}
