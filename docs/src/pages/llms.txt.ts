import type { APIRoute } from 'astro';
import packageJson from '../../../projects/ngx-signal-schema/package.json';
import { llmsIndex, parseDocument } from '../../../scripts/docs-format.mjs';

const sources = import.meta.glob<string>('../content/docs/**/*.{md,mdx}', {
    query: '?raw',
    import: 'default',
    eager: true,
});

export const GET: APIRoute = () => {
    const docs = Object.entries(sources)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([path, source]) => parseDocument(path.replace('../content/docs/', ''), source));
    return new Response(llmsIndex(docs, packageJson), {
        headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
};
