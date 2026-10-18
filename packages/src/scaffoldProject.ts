import { existsSync, readdirSync } from 'fs';
import { appendFile, cp, readdir, readFile, rename, rm, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { ALLOWED_EXISTING_ENTRIES, TEMPLATE_EXCLUDED_ENTRIES, TEMPLATE_GITIGNORE_NAME } from './constants.js';
import { toPackageName } from './projectName.js';
import { CliError, type PackageJson, type Template } from './types.js';

const DEFAULT_TEMPLATES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'templates');

// Why the project cannot be created in its target directory, if it cannot
export function getTargetDirError(projectName: string, cwd = process.cwd()): string | undefined {
    if (projectName === '.') {
        const entries = readdirSync(cwd);
        return entries.some((entry) => !ALLOWED_EXISTING_ENTRIES.has(entry))
            ? 'Current directory is not empty!'
            : undefined;
    }
    return existsSync(path.resolve(cwd, projectName)) ? `Directory "${projectName}" already exists!` : undefined;
}

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

    // Checked again here: the prompt's check can be stale, and scaffoldProject is also called directly
    const targetDirError = getTargetDirError(projectName, cwd);
    if (targetDirError) throw new CliError(targetDirError);

    // Entries already in the current directory, kept if creation fails
    const preexistingEntries = new Set(isCurrentDir ? await readdir(targetDir) : []);

    const templateDir = path.join(templatesDir, template);
    if (!existsSync(templateDir)) {
        throw new CliError(`Template "${template}" not found. Your installation may be corrupted.`);
    }

    try {
        await cp(templateDir, targetDir, {
            recursive: true,
            filter: (src) => !TEMPLATE_EXCLUDED_ENTRIES.has(path.relative(templateDir, src).split(path.sep)[0] ?? ''),
        });

        const packageJsonPath = path.join(targetDir, 'package.json');
        const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as PackageJson;
        packageJson.name = isCurrentDir ? toPackageName(path.basename(targetDir)) : projectName;
        // Templates carry the CLI version (synced by `npm run bump`); a new project starts fresh
        packageJson.version = '0.0.0';
        await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 4)}\n`);

        // Last step: an existing .gitignore is extended, never overwritten
        const templateGitignorePath = path.join(targetDir, TEMPLATE_GITIGNORE_NAME);
        const gitignorePath = path.join(targetDir, '.gitignore');
        if (preexistingEntries.has('.gitignore')) {
            await appendFile(gitignorePath, `\n${await readFile(templateGitignorePath, 'utf8')}`);
            await rm(templateGitignorePath);
        } else {
            await rename(templateGitignorePath, gitignorePath);
        }
    } catch (error) {
        if (isCurrentDir) {
            const createdEntries = (await readdir(targetDir)).filter((entry) => !preexistingEntries.has(entry));
            await Promise.all(
                createdEntries.map((entry) => rm(path.join(targetDir, entry), { recursive: true, force: true }))
            );
        } else {
            await rm(targetDir, { recursive: true, force: true });
        }
        if (error instanceof CliError) throw error;
        const reason = error instanceof Error ? error.message : String(error);
        throw new CliError(`Failed to create project: ${reason}`);
    }
}
