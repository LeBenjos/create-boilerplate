import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { test } from 'node:test';

import { RESERVED_NAMES } from '../dist/constants.js';
import { toPackageName, validateProjectName } from '../dist/projectName.js';
import { promptForProject } from '../dist/prompts.js';
import { getTargetDirError } from '../dist/scaffoldProject.js';
import { CliError } from '../dist/types.js';

test('validateProjectName accepts lowercase names, digits, hyphens and "."', () => {
    for (const name of ['my-app', 'app123', 'a', '.', 'a'.repeat(214)])
        assert.equal(validateProjectName(name), true, name);
});

test('validateProjectName rejects invalid characters and paths', () => {
    for (const name of [
        'MyApp',
        'my app',
        'my_app',
        'my.app',
        '..',
        '../escape',
        '/tmp/x',
        'a/b',
        '',
        '-foo',
        '-',
        'a'.repeat(215),
    ]) {
        assert.equal(typeof validateProjectName(name), 'string', name);
    }
});

test('validateProjectName rejects reserved names', () => {
    for (const name of RESERVED_NAMES) assert.equal(typeof validateProjectName(name), 'string', name);
});

test('promptForProject rejects an invalid CLI argument before prompting', async () => {
    await assert.rejects(promptForProject('../escape'), CliError);
});

test('toPackageName turns a directory name into a valid package name', () => {
    assert.equal(toPackageName('My Project'), 'my-project');
    assert.equal(toPackageName('--Cool_App 2--'), 'cool-app-2');
    assert.equal(toPackageName('already-valid'), 'already-valid');
});

test('toPackageName falls back to the default name when nothing valid remains', () => {
    assert.equal(toPackageName('ÉÉÉ'), 'my-threejs-app');
    assert.equal(toPackageName('src'), 'my-threejs-app');
});

test('getTargetDirError reports an existing directory and a non-empty current directory', () => {
    const cwd = mkdtempSync(path.join(tmpdir(), 'create-boilerplate-'));
    try {
        assert.equal(getTargetDirError('my-app', cwd), undefined);
        assert.equal(getTargetDirError('.', cwd), undefined);
        mkdirSync(path.join(cwd, '.git'));
        assert.equal(getTargetDirError('.', cwd), undefined);
        mkdirSync(path.join(cwd, 'my-app'));
        assert.match(getTargetDirError('my-app', cwd), /already exists/);
        assert.match(getTargetDirError('.', cwd), /not empty/);
    } finally {
        rmSync(cwd, { recursive: true, force: true });
    }
});

test('promptForProject rejects an existing directory before asking for the template', async () => {
    const cwd = mkdtempSync(path.join(tmpdir(), 'create-boilerplate-'));
    const previousCwd = process.cwd();
    try {
        mkdirSync(path.join(cwd, 'my-app'));
        process.chdir(cwd);
        await assert.rejects(promptForProject('my-app'), /already exists/);
    } finally {
        process.chdir(previousCwd);
        rmSync(cwd, { recursive: true, force: true });
    }
});
