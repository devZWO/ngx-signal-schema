import assert from 'node:assert/strict';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { documents, llmsIndex, rewriteLinks, root } from './docs-content.mjs';

const output = resolve(root, 'docs/dist');
assert.ok(existsSync(output), 'Build the Astro documentation first');
const docs = documents();
for (const doc of docs) {
    const target = resolve(output, doc.path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, rewriteLinks(doc.markdown, doc, docs, 'site'));
}
writeFileSync(resolve(output, 'llms.txt'), llmsIndex(docs));
console.log(`Exported ${docs.length} Markdown documents and llms.txt.`);
