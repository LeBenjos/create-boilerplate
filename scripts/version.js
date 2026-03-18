#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

const versionType = process.argv[2];

if (!['patch', 'minor', 'major'].includes(versionType)) {
    console.error('❌ Usage: npm run version <patch|minor|major>');
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

function updatePackageVersion(filePath, newVersion) {
    const content = JSON.parse(readFileSync(filePath, 'utf-8'));
    content.version = newVersion;
    writeFileSync(filePath, JSON.stringify(content, null, 4) + '\n');
}

function runCommand(command, cwd) {
    console.log(`📦 Running: ${command} in ${cwd}`);
    execSync(command, { cwd, stdio: 'inherit' });
}

const TARGETS = [
    '.',
    'packages',
    'packages/template-vanilla',
    // 'packages/template-react',
    'packages/template-vue',
];

try {
    const rootPackagePath = join(ROOT_DIR, 'package.json');
    const rootPackage = JSON.parse(readFileSync(rootPackagePath, 'utf-8'));
    const currentVersion = rootPackage.version;
    const newVersion = updateVersion(currentVersion, versionType);

    console.log(`\n🚀 Updating version: ${currentVersion} → ${newVersion}\n`);

    for (const target of TARGETS) {
        const pkgPath = join(ROOT_DIR, target, 'package.json');
        console.log(`📝 Updating ${target}/package.json...`);
        updatePackageVersion(pkgPath, newVersion);

        console.log(`📦 Installing dependencies in ${target}...`);
        runCommand('npm install', join(ROOT_DIR, target));
        console.log('');
    }

    console.log(`✅ All versions updated to ${newVersion}!`);
    console.log("\n💡 Don't forget to commit and push your changes.");
} catch (error) {
    console.error('\n❌ Error updating versions:', error.message);
    process.exit(1);
}
