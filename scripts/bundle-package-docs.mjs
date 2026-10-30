import assert from 'node:assert/strict';
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { documents, isConsumerDoc, packagePath, rewriteLinks, root } from './docs-content.mjs';

const output = resolve(root, 'dist/ngx-signal-schema');
assert.ok(existsSync(output), 'Build the library first');
const docs = documents();
const bundled = docs.filter(isConsumerDoc);
for (const doc of bundled) {
    const target = resolve(output, packagePath(doc));
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, rewriteLinks(doc.markdown, doc, docs, 'package'));
}
copyFileSync(resolve(root, 'LICENSE'), resolve(output, 'LICENSE'));
console.log(`Bundled ${bundled.length} consumer documents and LICENSE.`);
