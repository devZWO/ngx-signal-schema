import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument, llmsIndex as formatIndex } from './docs-format.mjs';
export {
    base,
    site,
    isConsumerDoc,
    packagePath,
    rewriteLinks,
    transformProse,
} from './docs-format.mjs';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const packageJson = JSON.parse(
    readFileSync(resolve(root, 'projects/ngx-signal-schema/package.json'), 'utf8'),
);
const source = resolve(root, 'docs/src/content/docs');

export function documents() {
    return readdirSync(source, { recursive: true })
        .filter((name) => /\.mdx?$/.test(name))
        .sort()
        .map((name) => parseDocument(name, readFileSync(resolve(source, name), 'utf8')));
}

export function llmsIndex(docs) {
    return formatIndex(docs, packageJson);
}
