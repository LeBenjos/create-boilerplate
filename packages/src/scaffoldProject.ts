import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

import { ALLOWED_EXISTING_ENTRIES, TEMPLATE_EXCLUDED_ENTRIES, TEMPLATE_GITIGNORE_NAME } from './constants.js';
import { toPackageName } from './prompts.js';
import { CliError, type PackageJson, type Template } from './types.js';

const DEFAULT_TEMPLATES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'templates');

export interface ScaffoldOptions {
    // Validated project name, or "." for the current directory
    projectName: string;
    template: Template;
    cwd?: string;
    templatesDir?: string;
}

// Copies a template into a new project directory. No prompts, no output: safe to call from tests.
export async function scaffoldProject({
    projectName,
    template,
    cwd = process.cwd(),
    templatesDir = DEFAULT_TEMPLATES_DIR,
}: ScaffoldOptions): Promise<void> {
    const isCurrentDir = projectName === '.';
    const targetDir = path.resolve(cwd, projectName);

    if (!isCurrentDir && (await fs.pathExists(targetDir))) {
        throw new CliError(`Directory "${projectName}" already exists!`);
    }

    // Entries already in the current directory, kept if creation fails
    const preexistingEntries = new Set(isCurrentDir ? await fs.readdir(targetDir) : []);
    if ([...preexistingEntries].some((entry) => !ALLOWED_EXISTING_ENTRIES.has(entry))) {
        throw new CliError('Current directory is not empty!');
    }

    const templateDir = path.join(templatesDir, template);
    if (!(await fs.pathExists(templateDir))) {
        throw new CliError(`Template "${template}" not found. Your installation may be corrupted.`);
    }

    try {
        await fs.copy(templateDir, targetDir, {
            filter: (src) => !TEMPLATE_EXCLUDED_ENTRIES.has(path.relative(templateDir, src).split(path.sep)[0] ?? ''),
        });

        const packageJsonPath = path.join(targetDir, 'package.json');
        const packageJson = (await fs.readJson(packageJsonPath)) as PackageJson;
        packageJson.name = isCurrentDir ? toPackageName(path.basename(targetDir)) : projectName;
        // Templates carry the CLI version (synced by `npm run bump`); a new project starts fresh
        packageJson.version = '0.0.0';
        await fs.writeJson(packageJsonPath, packageJson, { spaces: 4 });

        // Last step: an existing .gitignore is extended, never overwritten
        const templateGitignorePath = path.join(targetDir, TEMPLATE_GITIGNORE_NAME);
        const gitignorePath = path.join(targetDir, '.gitignore');
        if (preexistingEntries.has('.gitignore')) {
            await fs.appendFile(gitignorePath, `\n${await fs.readFile(templateGitignorePath, 'utf8')}`);
            await fs.remove(templateGitignorePath);
        } else {
            await fs.move(templateGitignorePath, gitignorePath);
        }
    } catch (error) {
        if (isCurrentDir) {
            const createdEntries = (await fs.readdir(targetDir)).filter((entry) => !preexistingEntries.has(entry));
            await Promise.all(createdEntries.map((entry) => fs.remove(path.join(targetDir, entry))));
        } else if (await fs.pathExists(targetDir)) {
            await fs.remove(targetDir);
        }
        if (error instanceof CliError) throw error;
        const reason = error instanceof Error ? error.message : String(error);
        throw new CliError(`Failed to create project: ${reason}`);
    }
}
