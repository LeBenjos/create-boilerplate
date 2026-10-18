import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, test } from 'node:test';

import { scaffoldProject } from '../dist/scaffoldProject.js';
import { CliError } from '../dist/types.js';

const TEMPLATE = 'three/poc/vanilla';
const TEMPLATE_GITIGNORE = 'node_modules\ndist\n';

let root;
let templatesDir;
let cwd;

function write(file, content) {
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, content);
}

// Fake template, with local artifacts that must never be copied
function createTemplate({ withPackageJson = true } = {}) {
    const dir = path.join(templatesDir, TEMPLATE);
    write(path.join(dir, '_gitignore'), TEMPLATE_GITIGNORE);
    write(path.join(dir, 'src', 'main.ts'), 'console.log(1);\n');
    write(path.join(dir, 'node_modules', 'dep', 'index.js'), '');
    write(path.join(dir, 'dist', 'index.html'), '');
    write(path.join(dir, '.claude', 'settings.local.json'), '{}');
    if (withPackageJson) write(path.join(dir, 'package.json'), JSON.stringify({ name: 'template', version: '1.5.11' }));
}

const scaffold = (projectName, dir = cwd) =>
    scaffoldProject({ projectName, template: TEMPLATE, cwd: dir, templatesDir });

beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), 'create-boilerplate-'));
    templatesDir = path.join(root, 'templates');
    cwd = path.join(root, 'cwd');
    mkdirSync(cwd);
});

afterEach(() => rmSync(root, { recursive: true, force: true }));

test('creates a new project from the template', async () => {
    createTemplate();
    await scaffold('my-app');

    const project = path.join(cwd, 'my-app');
    assert.deepEqual(readdirSync(project).sort(), ['.gitignore', 'package.json', 'src']);
    assert.equal(readFileSync(path.join(project, '.gitignore'), 'utf8'), TEMPLATE_GITIGNORE);
    assert.deepEqual(JSON.parse(readFileSync(path.join(project, 'package.json'), 'utf8')), {
        name: 'my-app',
        version: '0.0.0',
    });
});

test('refuses an existing directory and leaves it untouched', async () => {
    createTemplate();
    write(path.join(cwd, 'my-app', 'keep.txt'), 'mine');

    await assert.rejects(scaffold('my-app'), CliError);
    assert.deepEqual(readdirSync(path.join(cwd, 'my-app')), ['keep.txt']);
});

test('refuses a non-empty current directory', async () => {
    createTemplate();
    write(path.join(cwd, 'notes.md'), 'mine');

    await assert.rejects(scaffold('.'), CliError);
    assert.deepEqual(readdirSync(cwd), ['notes.md']);
});

test('in the current directory, extends an existing .gitignore and names the package after the folder', async () => {
    createTemplate();
    const dir = path.join(root, 'My Project');
    mkdirSync(path.join(dir, '.git'), { recursive: true });
    write(path.join(dir, '.gitignore'), '.env\n');

    await scaffold('.', dir);

    assert.equal(readFileSync(path.join(dir, '.gitignore'), 'utf8'), `.env\n\n${TEMPLATE_GITIGNORE}`);
    assert.equal(existsSync(path.join(dir, '_gitignore')), false);
    assert.equal(JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8')).name, 'my-project');
});

test('on failure in the current directory, removes only what it created', async () => {
    createTemplate({ withPackageJson: false });
    mkdirSync(path.join(cwd, '.git'));
    write(path.join(cwd, '.gitignore'), '.env\n');

    await assert.rejects(scaffold('.'), CliError);
    assert.deepEqual(readdirSync(cwd).sort(), ['.git', '.gitignore']);
    assert.equal(readFileSync(path.join(cwd, '.gitignore'), 'utf8'), '.env\n');
});

test('on failure in a new directory, removes it', async () => {
    createTemplate({ withPackageJson: false });

    await assert.rejects(scaffold('my-app'), CliError);
    assert.equal(existsSync(path.join(cwd, 'my-app')), false);
});

test('refuses an unknown template', async () => {
    await assert.rejects(scaffold('my-app'), /not found/);
});
