import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { recipeExamples } from './recipe-examples.mjs';

// Compile marked Markdown/MDX examples against the built public package. Blocks
// sharing a filename on one page are concatenated in document order. Cross-page
// filename collisions, missing/malformed markers and compiler failures are errors.
const root = fileURLToPath(new URL('../', import.meta.url));
const docsRoot = resolve(root, 'docs/src/content/docs');
const checkDirs = [resolve(docsRoot, 'recipes'), resolve(docsRoot, 'ai')];
const output = resolve(root, 'tmp/recipe-check');
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
let count = 0;
const owners = new Map();

for (const dirPath of checkDirs) {
    assert.ok(existsSync(dirPath), `Missing documentation directory: ${dirPath}`);
    for (const name of readdirSync(dirPath, { recursive: true }).filter((name) =>
        /\.mdx?$/.test(name),
    )) {
        const markdown = readFileSync(resolve(dirPath, name), 'utf8');
        const blocks = recipeExamples(markdown, name);
        for (const { filename, code } of blocks) {
            const target = resolve(output, filename);
            const source = resolve(dirPath, name);
            assert.ok(
                !owners.has(filename) || owners.get(filename) === source,
                `Duplicate recipe filename: ${filename}`,
            );
            const previous = owners.has(filename)
                ? readFileSync(target, 'utf8')
                : `// Extracted from ${name}; edit the Markdown source.\n`;
            owners.set(filename, source);
            writeFileSync(target, `${previous}${code}\n`);
            count++;
        }
    }
}
assert.ok(count > 0, 'No checkable documentation examples found');
writeFileSync(
    resolve(output, 'tsconfig.json'),
    JSON.stringify(
        {
            extends: '../../tsconfig.json',
            compilerOptions: {
                outDir: './out',
                types: [],
                noEmit: true,
                // Check the publishable package rather than the workspace's source mapping.
                paths: {
                    '@devzwo/ngx-signal-schema': [resolve(root, 'dist/ngx-signal-schema')],
                },
            },
            files: [],
            references: [],
            include: ['*.ts'],
        },
        null,
        2,
    ),
);
const require = createRequire(import.meta.url);
const compilerPackage = require.resolve('@angular/compiler-cli/package.json');
const compiler = JSON.parse(readFileSync(compilerPackage, 'utf8'));
const result = spawnSync(
    process.execPath,
    [resolve(dirname(compilerPackage), compiler.bin.ngc), '-p', resolve(output, 'tsconfig.json')],
    { cwd: root, stdio: 'inherit' },
);
if (result.error) throw result.error;
assert.equal(result.status, 0, 'Recipe TypeScript or Angular template compilation failed');
console.log(
    `Checked ${count} documentation blocks in ${owners.size} examples with strict TypeScript and Angular templates.`,
);
