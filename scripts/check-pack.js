#!/usr/bin/env node

// Fails when the published templates differ from the git-tracked ones: catches local artifacts
// (node_modules, builds, source assets...) shipped by mistake, or template files left out.
// templates/.npmignore and the templates' _gitignore must stay in sync; this is the safety net.

import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
const PACKAGE_DIR = join(ROOT_DIR, 'packages');
const TEMPLATES_PREFIX = 'templates/';
// Read by npm, never shipped
const NOT_SHIPPED = new Set(['templates/.npmignore']);

const run = (command, cwd) => execSync(command, { cwd, encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 });

const [pack] = JSON.parse(run('npm pack --dry-run --json --ignore-scripts', PACKAGE_DIR));
const packed = new Set(pack.files.map((file) => file.path).filter((file) => file.startsWith(TEMPLATES_PREFIX)));

const gitFiles = (flags) => run(`git ls-files ${flags} -- templates`, PACKAGE_DIR).split('\n').filter(Boolean);
const deleted = new Set(gitFiles('--deleted'));
// Tracked files plus new files not ignored yet, minus uncommitted deletions: what a commit would contain
const expected = new Set(
    gitFiles('--cached --others --exclude-standard').filter((file) => !NOT_SHIPPED.has(file) && !deleted.has(file))
);

const unexpected = [...packed].filter((file) => !expected.has(file));
const missing = [...expected].filter((file) => !packed.has(file));

if (unexpected.length > 0 || missing.length > 0) {
    console.error('❌ Published templates differ from git:');
    for (const file of unexpected) console.error(`  + would ship, not in git: ${file}`);
    for (const file of missing) console.error(`  - in git, would not ship: ${file}`);
    console.error('\nFix templates/.npmignore (or the templates’ _gitignore) before publishing.');
    process.exit(1);
}

console.log(`✅ Published templates match git (${packed.size} files, ${(pack.size / 1e6).toFixed(1)} MB package).`);
