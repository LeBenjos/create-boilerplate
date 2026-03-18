#!/usr/bin/env node

import chalk from 'chalk';
import { program } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

import { createProject } from './createProject.js';
import { CliError, type PackageJson } from './types.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = path.dirname(__filename);

const pkg = (await fs.readJson(path.join(__dirname, '..', 'package.json'))) as PackageJson;

program
    .name('create-boilerplate')
    .description('Create a new Three.js project with Vanilla/Vue')
    .version(pkg.version)
    .argument('[project-name]', 'Project name (use "." for current directory)')
    .action(async (projectName?: string) => {
        try {
            await createProject(projectName);
        } catch (error) {
            if (error instanceof CliError) {
                console.log(chalk.red(`\n❌ ${error.message}`));
                process.exit(1);
            }
            throw error;
        }
    });

program.parse();
