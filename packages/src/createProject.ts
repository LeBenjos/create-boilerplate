import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

import { IGNORED_FILES } from './constants.js';
import { promptForProject } from './prompts.js';
import { CliError, type PackageJson } from './types.js';

export async function createProject(projectNameArg?: string, baseDir?: string): Promise<void> {
    console.log(chalk.cyan.bold('\n🚀 Welcome to @benjos/boilerplate!\n'));

    const answers = await promptForProject(projectNameArg);

    const projectName = projectNameArg ?? answers.projectName ?? '.';
    const isCurrentDir = projectName === '.';
    const targetDir = isCurrentDir ? process.cwd() : path.join(process.cwd(), projectName);

    if (!isCurrentDir && (await fs.pathExists(targetDir))) {
        throw new CliError(`Directory "${projectName}" already exists!`);
    }

    if (isCurrentDir) {
        const files = (await fs.readdir(targetDir)).filter((file) => !IGNORED_FILES.has(file));
        if (files.length > 0) {
            throw new CliError('Current directory is not empty!');
        }
    }

    const finalProjectName = isCurrentDir ? path.basename(targetDir) : projectName;

    const resolvedBaseDir = baseDir ?? path.join(path.dirname(new URL(import.meta.url).pathname), '..');
    const templateDir = path.join(resolvedBaseDir, `template-${answers.framework}`);
    if (!(await fs.pathExists(templateDir))) {
        throw new CliError(`Template "${answers.framework}" not found. Your installation may be corrupted.`);
    }

    console.log(chalk.blue(`\n📦 Creating project in ${targetDir}...\n`));

    try {
        await fs.copy(templateDir, targetDir);

        const packageJsonPath = path.join(targetDir, 'package.json');
        const packageJson = (await fs.readJson(packageJsonPath)) as PackageJson;
        packageJson.name = finalProjectName;
        await fs.writeJson(packageJsonPath, packageJson, { spaces: 4 });
    } catch (error) {
        if (!isCurrentDir && (await fs.pathExists(targetDir))) {
            await fs.remove(targetDir);
        }
        if (error instanceof CliError) throw error;
        throw new CliError('Failed to create project.');
    }

    console.log(chalk.green('✅ Project created successfully!\n'));
    console.log(chalk.cyan('Next steps:\n'));
    if (!isCurrentDir) {
        console.log(chalk.white(`  cd ${projectName}`));
    }
    console.log(chalk.white('  npm install'));
    console.log(chalk.white('  npm run dev\n'));
}
