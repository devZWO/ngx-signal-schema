import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import {
    base,
    documents,
    isConsumerDoc,
    packageJson,
    packagePath,
    root,
    transformProse,
} from './docs-content.mjs';

const output = resolve(root, 'dist/ngx-signal-schema');
const siteOutput = resolve(root, 'docs/dist');
const built = JSON.parse(readFileSync(resolve(output, 'package.json'), 'utf8'));
assert.equal(built.name, packageJson.name);
assert.equal(built.version, packageJson.version);
const packed = spawnSync(
    process.platform === 'win32' ? 'npm.cmd' : 'npm',
    ['pack', '--dry-run', '--json', '--ignore-scripts'],
    { cwd: output, encoding: 'utf8' },
);
if (packed.error) throw packed.error;
assert.equal(packed.status, 0, packed.stderr);
const files = new Set(JSON.parse(packed.stdout)[0].files.map((file) => file.path));
for (const path of [
    'README.md',
    'LICENSE',
    'package.json',
    'ai/usage.md',
    ...documents().filter(isConsumerDoc).map(packagePath),
]) {
    assert.ok(files.has(path), `Missing npm package file: ${path}`);
    if (!path.endsWith('.md')) continue;
    const content = readFileSync(resolve(output, path), 'utf8');
    // Code examples can contain strings that resemble links; check prose only.
    transformProse(content, (prose) => {
        for (const [, href] of prose.matchAll(/\[[^\]]+\]\(([^)\s]+)\)/g)) {
            if (/^(?:[a-z]+:|#)/i.test(href)) continue;
            const target = resolve(dirname(resolve(output, path)), href.split('#')[0]);
            assert.ok(existsSync(target), `${path}: broken packaged link ${href}`);
            assert.ok(
                target.startsWith(`${output}/`),
                `${path}: link escapes the package: ${href}`,
            );
        }
        return prose;
    });
}
assert.ok(
    [...files].some((path) => path.endsWith('.d.ts')),
    'Missing public types',
);
assert.ok(
    [...files].some((path) => path.endsWith('.mjs')),
    'Missing library JavaScript',
);
assert.ok(
    ![...files].some((path) => /maintainers|recipe-check/.test(path)),
    'Internal documentation leaked into package',
);
if (process.argv.includes('--package-only')) {
    console.log(`Validated npm contents (${files.size} files) and bundled documentation links.`);
    process.exit(0);
}
const llms = readFileSync(resolve(siteOutput, 'llms.txt'), 'utf8');
assert.ok(
    llms.includes(`${packageJson.name} (v${packageJson.version})`),
    'Incorrect llms.txt version',
);
for (const [, href] of llms.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    assert.ok(href.startsWith(base), `Unexpected llms.txt URL: ${href}`);
    assert.ok(
        existsSync(resolve(siteOutput, href.slice(base.length))),
        `Missing Markdown endpoint: ${href}`,
    );
}
console.log(`Validated npm contents (${files.size} files), bundled links and llms.txt endpoints.`);
