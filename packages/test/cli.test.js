import assert from 'node:assert/strict';
import { test } from 'node:test';

import { RESERVED_NAMES } from '../dist/constants.js';
import { promptForProject, toPackageName, validateProjectName } from '../dist/prompts.js';
import { CliError } from '../dist/types.js';

test('validateProjectName accepts lowercase names, digits, hyphens and "."', () => {
    for (const name of ['my-app', 'app123', 'a', '.']) assert.equal(validateProjectName(name), true, name);
});

test('validateProjectName rejects invalid characters and paths', () => {
    for (const name of ['MyApp', 'my app', 'my_app', 'my.app', '..', '../escape', '/tmp/x', 'a/b', '', '-foo', '-']) {
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
