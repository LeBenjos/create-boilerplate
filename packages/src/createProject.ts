import path from 'path';
import { styleText } from 'util';

import { promptForProject } from './prompts.js';
import { scaffoldProject } from './scaffoldProject.js';

export async function createProject(projectNameArg?: string): Promise<void> {
    console.log(
        // Nested calls: Node 20 (allowed by engines) does not accept an array of styles
        styleText('bold', styleText('cyan', '\n🚀 Welcome to @benjos/boilerplate!\n'))
    );

    const { projectName, template } = await promptForProject(projectNameArg);

    console.log(styleText('blue', `\n📦 Creating project in ${path.resolve(projectName)}...\n`));
    await scaffoldProject({ projectName, template });

    console.log(styleText('green', '✅ Project created successfully!\n'));
    console.log(styleText('cyan', 'Next steps:\n'));
    if (projectName !== '.') {
        console.log(styleText('white', `  cd ${projectName}`));
    }
    console.log(styleText('white', '  npm install'));
    console.log(styleText('white', '  npm run dev\n'));
}
