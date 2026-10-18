export interface PackageJson {
    name: string;
    version: string;
}

import type { TEMPLATE_CHOICES } from './constants.js';

// Path relative to `templates/`
export type Template = (typeof TEMPLATE_CHOICES)[number]['value'];

export interface ProjectAnswers {
    projectName: string;
    template: Template;
}

export class CliError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CliError';
    }
}
