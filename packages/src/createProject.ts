import chalk from 'chalk';
import path from 'path';

import { promptForProject } from './prompts.js';
import { scaffoldProject } from './scaffoldProject.js';

export async function createProject(projectNameArg?: string): Promise<void> {
    console.log(chalk.cyan.bold('\n🚀 Welcome to @benjos/boilerplate!\n'));

    const { projectName, template } = await promptForProject(projectNameArg);

    console.log(chalk.blue(`\n📦 Creating project in ${path.resolve(projectName)}...\n`));
    await scaffoldProject({ projectName, template });

    console.log(chalk.green('✅ Project created successfully!\n'));
    console.log(chalk.cyan('Next steps:\n'));
    if (projectName !== '.') {
        console.log(chalk.white(`  cd ${projectName}`));
    }
    console.log(chalk.white('  npm install'));
    console.log(chalk.white('  npm run dev\n'));
}
