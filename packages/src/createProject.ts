import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

import { ALLOWED_EXISTING_ENTRIES, TEMPLATE_EXCLUDED_ENTRIES, TEMPLATE_GITIGNORE_NAME } from './constants.js';
import { promptForProject, toPackageName } from './prompts.js';
import { CliError, type PackageJson } from './types.js';

export async function createProject(projectNameArg?: string, baseDir?: string): Promise<void> {
    console.log(chalk.cyan.bold('\n🚀 Welcome to @benjos/boilerplate!\n'));

    const { projectName, template } = await promptForProject(projectNameArg);

    const isCurrentDir = projectName === '.';
    const targetDir = isCurrentDir ? process.cwd() : path.join(process.cwd(), projectName);

    if (!isCurrentDir && (await fs.pathExists(targetDir))) {
        throw new CliError(`Directory "${projectName}" already exists!`);
    }

    // Entries already in the current directory, kept if creation fails
    const preexistingEntries = new Set(isCurrentDir ? await fs.readdir(targetDir) : []);
    if ([...preexistingEntries].some((entry) => !ALLOWED_EXISTING_ENTRIES.has(entry))) {
        throw new CliError('Current directory is not empty!');
    }

    const finalProjectName = isCurrentDir ? toPackageName(path.basename(targetDir)) : projectName;

    const resolvedBaseDir = baseDir ?? path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
    const templateDir = path.join(resolvedBaseDir, 'templates', template);
    if (!(await fs.pathExists(templateDir))) {
        throw new CliError(`Template "${template}" not found. Your installation may be corrupted.`);
    }

    console.log(chalk.blue(`\n📦 Creating project in ${targetDir}...\n`));

    try {
        await fs.copy(templateDir, targetDir, {
            filter: (src) => !TEMPLATE_EXCLUDED_ENTRIES.has(path.relative(templateDir, src).split(path.sep)[0] ?? ''),
        });

        const packageJsonPath = path.join(targetDir, 'package.json');
        const packageJson = (await fs.readJson(packageJsonPath)) as PackageJson;
        packageJson.name = finalProjectName;
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

    console.log(chalk.green('✅ Project created successfully!\n'));
    console.log(chalk.cyan('Next steps:\n'));
    if (!isCurrentDir) {
        console.log(chalk.white(`  cd ${projectName}`));
    }
    console.log(chalk.white('  npm install'));
    console.log(chalk.white('  npm run dev\n'));
}
