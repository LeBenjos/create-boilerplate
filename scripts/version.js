#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

const versionType = process.argv[2];

if (!['patch', 'minor', 'major'].includes(versionType)) {
    console.error('❌ Usage: npm run bump <patch|minor|major>');
    process.exit(1);
}

function updateVersion(version, type) {
    const parts = version.split('.').map(Number);
    switch (type) {
        case 'major':
            parts[0]++;
            parts[1] = 0;
            parts[2] = 0;
            break;
        case 'minor':
            parts[1]++;
            parts[2] = 0;
            break;
        case 'patch':
            parts[2]++;
            break;
    }
    return parts.join('.');
}

function runCommand(command, cwd) {
    console.log(`📦 Running: ${command} in ${relative(ROOT_DIR, cwd) || '.'}`);
    execSync(command, { cwd, stdio: 'inherit' });
}

// Every folder under packages/templates holding a package.json is a template
function findTemplateDirs(dir) {
    if (existsSync(join(dir, 'package.json'))) return [dir];
    return readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && !['node_modules', 'dist'].includes(entry.name))
        .flatMap((entry) => findTemplateDirs(join(dir, entry.name)));
}

const templateDirs = findTemplateDirs(join(ROOT_DIR, 'packages', 'templates'));
const versionedDirs = [ROOT_DIR, join(ROOT_DIR, 'packages'), ...templateDirs];
// packages/ is a workspace of the root: installing at the root covers it
const installDirs = [ROOT_DIR, ...templateDirs];

// Restored on failure, so a bump never leaves versions half-updated
const snapshots = new Map(
    versionedDirs
        .flatMap((dir) => [join(dir, 'package.json'), join(dir, 'package-lock.json')])
        .filter((file) => existsSync(file))
        .map((file) => [file, readFileSync(file, 'utf-8')])
);

const currentVersion = JSON.parse(readFileSync(join(ROOT_DIR, 'package.json'), 'utf-8')).version;
const newVersion = updateVersion(currentVersion, versionType);

try {
    console.log(`\n🚀 Updating version: ${currentVersion} → ${newVersion}\n`);

    for (const dir of versionedDirs) {
        const pkgPath = join(dir, 'package.json');
        console.log(`📝 Updating ${relative(ROOT_DIR, pkgPath)}...`);
        const content = JSON.parse(readFileSync(pkgPath, 'utf-8'));
        content.version = newVersion;
        writeFileSync(pkgPath, JSON.stringify(content, null, 4) + '\n');
    }

    for (const dir of installDirs) {
        runCommand('npm install', dir);
        console.log('');
    }

    console.log(`✅ All versions updated to ${newVersion}!`);
    console.log("\n💡 Don't forget to commit and push your changes.");
} catch (error) {
    for (const [file, content] of snapshots) writeFileSync(file, content);
    console.error('\n❌ Error updating versions:', error.message);
    console.error('↩️  package.json and package-lock.json files restored.');
    process.exit(1);
}
