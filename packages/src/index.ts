#!/usr/bin/env node

import chalk from 'chalk';
import { program } from 'commander';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import path from 'path';
import { fileURLToPath } from 'url';

// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = path.dirname(__filename);

interface ProjectAnswers {
    projectName: string;
    framework: 'vanilla' | 'react' | 'vue';
}

async function createProject(projectNameArg?: string): Promise<void> {
    console.log(chalk.cyan.bold('\n🚀 Welcome to @benjos/boilerplate!\n'));

    const answers = await inquirer.prompt<ProjectAnswers>([
        {
            type: 'input',
            name: 'projectName',
            message: 'Project name:',
            default: projectNameArg ?? 'my-threejs-app',
            when: !projectNameArg,
            validate: (input: string): string | boolean => {
                if (input === '.') return true;
                if (!/^[a-z0-9-]+$/.test(input)) {
                    return 'Project name must contain only lowercase letters, numbers, and hyphens (or "." for current directory)';
                }
                return true;
            },
        },
        {
            type: 'list',
            name: 'framework',
            message: 'Choose a framework:',
            choices: [
                { name: 'Vanilla (Three.js + TypeScript)', value: 'vanilla' },
                { name: 'React (Coming soon)', value: 'react', disabled: true },
                { name: 'Vue (Coming soon)', value: 'vue', disabled: true },
            ],
        },
    ]);

    // Handle current directory case
    const projectName = projectNameArg ?? answers.projectName ?? '.';
    const isCurrentDir = projectName === '.';
    const targetDir = isCurrentDir ? process.cwd() : path.join(process.cwd(), projectName);

    // Check if directory already exists (only for new directories)
    if (!isCurrentDir && (await fs.pathExists(targetDir))) {
        console.log(chalk.red(`\n❌ Directory "${projectName}" already exists!`));
        process.exit(1);
    }

    // Check if current directory is empty (only for current directory)
    if (isCurrentDir) {
        const files = await fs.readdir(targetDir);
        if (files.length > 0) {
            console.log(chalk.red('\n❌ Current directory is not empty!'));
            process.exit(1);
        }
    }

    const finalProjectName = isCurrentDir ? path.basename(targetDir) : projectName;

    console.log(chalk.blue(`\n📦 Creating project in ${targetDir}...\n`));

    // Copy template
    const templateDir = path.join(__dirname, '..', `template-${answers.framework}`);
    await fs.copy(templateDir, targetDir);

    // Update package.json with project name
    const packageJsonPath = path.join(targetDir, 'package.json');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const packageJson = await fs.readJson(packageJsonPath);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    packageJson.name = finalProjectName;
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 4 });

    console.log(chalk.green('✅ Project created successfully!\n'));
    console.log(chalk.cyan('Next steps:\n'));
    if (!isCurrentDir) {
        console.log(chalk.white(`  cd ${projectName}`));
    }
    console.log(chalk.white('  npm install'));
    console.log(chalk.white('  npm run dev\n'));
}

program
    .name('create-boilerplate')
    .description('Create a new Three.js project with Vanilla/React/Vue')
    .version('1.0.1')
    .argument('[project-name]', 'Project name (use "." for current directory)')
    .action((projectName?: string) => createProject(projectName));

program.parse();
