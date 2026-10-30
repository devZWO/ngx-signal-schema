import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { root } from './docs-content.mjs';

const docs = resolve(root, 'docs/dist');
const demo = resolve(root, 'dist/demo-form/browser');
assert.ok(existsSync(resolve(docs, 'index.html')), 'Build the Astro documentation first');
assert.ok(existsSync(resolve(demo, 'index.html')), 'Build the Pages demo first');
mkdirSync(resolve(docs, 'demo'), { recursive: true });
cpSync(demo, resolve(docs, 'demo'), { recursive: true });
console.log('Included the demo in docs/dist/demo (hash routes support GitHub Pages reloads).');
