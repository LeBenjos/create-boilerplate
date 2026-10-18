#!/usr/bin/env node

import { program } from 'commander';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { styleText } from 'util';

import { createProject } from './createProject.js';
import { CliError, type PackageJson } from './types.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(await readFile(path.join(__dirname, '..', 'package.json'), 'utf8')) as PackageJson;

program
    .name('create-boilerplate')
    .description('Create a new project from a template')
    .version(pkg.version)
    .argument('[project-name]', 'Project name (use "." for current directory)')
    .action(async (projectName?: string) => {
        try {
            await createProject(projectName);
        } catch (error) {
            if (error instanceof CliError) {
                console.error(styleText('red', `\n❌ ${error.message}`));
                process.exit(1);
            }
            // Thrown by @inquirer/prompts on Ctrl+C
            if (error instanceof Error && error.name === 'ExitPromptError') {
                process.exit(130);
            }
            throw error;
        }
    });

await program.parseAsync();
