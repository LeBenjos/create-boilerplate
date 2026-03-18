export interface PackageJson {
    name: string;
    version: string;
}

export type Framework = 'vanilla' | 'vue';

export interface ProjectAnswers {
    projectName: string;
    framework: Framework;
}

export class CliError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CliError';
    }
}
