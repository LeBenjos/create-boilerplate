import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createProject } from './createProject.js';
import { CliError } from './types.js';

vi.mock('./prompts.js', () => ({
    promptForProject: vi.fn(),
    validateProjectName: vi.fn(() => true),
}));

import { promptForProject } from './prompts.js';

const mockedPrompt = vi.mocked(promptForProject);

describe('createProject', () => {
    let tmpDir: string;
    let originalCwd: string;

    beforeEach(async () => {
        tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'boilerplate-test-'));
        originalCwd = process.cwd();
        process.chdir(tmpDir);

        // Create a fake template directory with a package.json
        const templateDir = path.join(tmpDir, 'templates', 'template-vanilla');
        await fs.mkdirp(templateDir);
        await fs.writeJson(path.join(templateDir, 'package.json'), { name: 'template', version: '1.0.0' });
        await fs.writeFile(path.join(templateDir, 'index.ts'), 'console.log("hello");');
    });

    afterEach(async () => {
        process.chdir(originalCwd);
        await fs.remove(tmpDir);
        vi.restoreAllMocks();
    });

    it('creates a project in a new directory', async () => {
        mockedPrompt.mockResolvedValue({ projectName: 'my-app', framework: 'vanilla' });

        const baseDir = path.join(tmpDir, 'templates');
        await createProject(undefined, baseDir);

        const targetDir = path.join(tmpDir, 'my-app');
        expect(await fs.pathExists(targetDir)).toBe(true);
        expect(await fs.pathExists(path.join(targetDir, 'index.ts'))).toBe(true);

        const pkg = (await fs.readJson(path.join(targetDir, 'package.json'))) as { name: string };
        expect(pkg.name).toBe('my-app');
    });

    it('throws CliError when target directory already exists', async () => {
        mockedPrompt.mockResolvedValue({ projectName: 'existing', framework: 'vanilla' });

        await fs.mkdirp(path.join(tmpDir, 'existing'));

        const baseDir = path.join(tmpDir, 'templates');
        await expect(createProject(undefined, baseDir)).rejects.toThrow(CliError);
        await expect(createProject(undefined, baseDir)).rejects.toThrow('already exists');
    });

    it('throws CliError when current directory is not empty (ignoring dotfiles)', async () => {
        mockedPrompt.mockResolvedValue({ projectName: '.', framework: 'vanilla' });

        await fs.writeFile(path.join(tmpDir, 'somefile.txt'), 'content');

        const baseDir = path.join(tmpDir, 'templates');
        await expect(createProject(undefined, baseDir)).rejects.toThrow(CliError);
        await expect(createProject(undefined, baseDir)).rejects.toThrow('not empty');
    });

    it('allows current directory when only dotfiles are present', async () => {
        // Create a fresh empty dir for this test since beforeEach creates template files in tmpDir
        const emptyDir = path.join(tmpDir, 'empty-project');
        await fs.mkdirp(emptyDir);
        process.chdir(emptyDir);

        await fs.writeFile(path.join(emptyDir, '.gitignore'), 'node_modules');

        mockedPrompt.mockResolvedValue({ projectName: '.', framework: 'vanilla' });

        const baseDir = path.join(tmpDir, 'templates');
        await createProject(undefined, baseDir);

        expect(await fs.pathExists(path.join(emptyDir, 'index.ts'))).toBe(true);
    });

    it('throws CliError when template directory does not exist', async () => {
        mockedPrompt.mockResolvedValue({ projectName: 'my-app', framework: 'vue' });

        const baseDir = path.join(tmpDir, 'templates');
        // template-vue doesn't exist, only template-vanilla was created
        await expect(createProject(undefined, baseDir)).rejects.toThrow(CliError);
        await expect(createProject(undefined, baseDir)).rejects.toThrow('not found');
    });

    it('cleans up target directory on copy failure', async () => {
        mockedPrompt.mockResolvedValue({ projectName: 'fail-app', framework: 'vanilla' });

        // Create a baseDir where template exists but package.json in template is malformed
        const badTemplateDir = path.join(tmpDir, 'bad-templates', 'template-vanilla');
        await fs.mkdirp(badTemplateDir);
        await fs.writeFile(path.join(badTemplateDir, 'package.json'), 'not json');

        const baseDir = path.join(tmpDir, 'bad-templates');
        await expect(createProject(undefined, baseDir)).rejects.toThrow(CliError);

        // The target directory should have been cleaned up
        expect(await fs.pathExists(path.join(tmpDir, 'fail-app'))).toBe(false);
    });
});
