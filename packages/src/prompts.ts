import { input, select } from '@inquirer/prompts';

import { DEFAULT_PROJECT_NAME, TEMPLATE_CHOICES } from './constants.js';
import { validateProjectName } from './projectName.js';
import { getTargetDirError } from './scaffoldProject.js';
import { CliError, type ProjectAnswers, type Template } from './types.js';

// Name format, then target directory: checked before choosing a template
function validateProjectTarget(value: string): string | true {
    const validation = validateProjectName(value);
    return validation === true ? (getTargetDirError(value) ?? true) : validation;
}

export async function promptForProject(projectNameArg?: string): Promise<ProjectAnswers> {
    if (projectNameArg !== undefined) {
        const validation = validateProjectTarget(projectNameArg);
        if (validation !== true) throw new CliError(validation);
    }

    const projectName =
        projectNameArg ??
        (await input({
            message: 'Project name:',
            default: DEFAULT_PROJECT_NAME,
            validate: validateProjectTarget,
        }));

    const template = await select<Template>({
        message: 'Choose a template:',
        choices: TEMPLATE_CHOICES,
    });

    return { projectName, template };
}
