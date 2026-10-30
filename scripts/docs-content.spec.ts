import { describe, expect, it } from 'vitest';
import {
    documents,
    isConsumerDoc,
    llmsIndex,
    rewriteLinks,
    transformProse,
} from './docs-content.mjs';
import { recipeExamples } from './recipe-examples.mjs';

const guide = { path: 'ai/usage.md', route: 'ai/usage', title: 'Agent Guide', markdown: '' };
const recipe = {
    path: 'recipes/contact-form.md',
    route: 'recipes/contact-form',
    title: 'Contact',
    markdown: '',
};
const api = {
    path: 'api/Composition/compose.md',
    route: 'api/Composition/compose',
    title: 'compose',
    markdown: '',
};
const docs = [guide, recipe, api];

describe('documentation exports', () => {
    it('keeps TypeScript imports and template markup inside fenced examples intact', () => {
        const code =
            '```ts\nimport { Component } from "@angular/core";\nconst template = `<Card>Example</Card>`;\n```';
        expect(transformProse(`Introduction\n\n${code}\n\nAfter`, () => '')).toBe(code);
    });

    it('exports MDX recipes as readable Markdown with their code imports', () => {
        const exported = documents().find((doc) => doc.path === 'recipes/list-recipe.md');
        expect(exported?.markdown).toContain("import { schema } from '@angular/forms/signals'");
        expect(exported?.markdown).not.toContain('{/* recipe-check:');
        expect(exported?.markdown).toMatch(/^# Managing Lists and Arrays/);
        expect(documents().find((doc) => doc.path === 'index.md')?.markdown).not.toContain('<Card');
    });

    it('resolves site links under the GitHub Pages base path and preserves fragments', () => {
        expect(rewriteLinks('[Contact](/recipes/contact-form/#setup)', guide, docs, 'site')).toBe(
            '[Contact](/ngx-signal-schema/recipes/contact-form.md#setup)',
        );
        expect(
            rewriteLinks(
                '[Contact](/ngx-signal-schema/recipes/contact-form/)',
                guide,
                docs,
                'site',
            ),
        ).toBe('[Contact](/ngx-signal-schema/recipes/contact-form.md)');
    });

    it('creates package-relative links and sends API links to the website', () => {
        expect(rewriteLinks('[Contact](/recipes/contact-form/)', guide, docs, 'package')).toBe(
            '[Contact](./../docs/recipes/contact-form.md)',
        );
        expect(rewriteLinks('[API](/api/composition/compose/)', guide, docs, 'package')).toBe(
            '[API](https://devzwo.github.io/ngx-signal-schema/api/composition/compose/)',
        );
    });

    it('preserves external links and code examples', () => {
        const content =
            '[Angular](https://angular.dev)\n\n```ts\nconst link = "[API](/api/composition/compose/)";\n```';
        expect(rewriteLinks(content, guide, docs, 'package')).toBe(content);
    });

    it('indexes actual Markdown paths including API filename casing', () => {
        expect(llmsIndex(docs)).toContain('/ngx-signal-schema/api/Composition/compose.md');
        expect(llmsIndex(docs)).toContain('/ngx-signal-schema/ai/usage.md');
        expect(isConsumerDoc(api)).toBe(false);
        expect(isConsumerDoc(recipe)).toBe(true);
    });
});

describe('recipe extraction', () => {
    it('reads Markdown and MDX markers in document order, including CRLF', () => {
        const source =
            '<!-- recipe-check: contact.ts -->\n```ts\nconst name = "Test";\n```\n\n{/* recipe-check: contact.ts */}\n```typescript\nexport { name };\n```';
        expect(recipeExamples(source.replaceAll('\n', '\r\n'), 'contact.mdx')).toEqual([
            { filename: 'contact.ts', code: 'const name = "Test";' },
            { filename: 'contact.ts', code: 'export { name };' },
        ]);
    });

    it('rejects pages without marked examples', () => {
        expect(() => recipeExamples('```ts\nconst value = 1;\n```', 'missing.md')).toThrow(
            'missing.md',
        );
    });

    it('rejects traversal filenames and markers without TypeScript blocks', () => {
        expect(() =>
            recipeExamples('<!-- recipe-check: ../bad.ts -->\n```ts\nexport {};\n```', 'bad.md'),
        ).toThrow();
        expect(() =>
            recipeExamples(
                '<!-- recipe-check: good.ts -->\n```ts\nexport {};\n```\n<!-- recipe-check: bad.ts -->',
                'bad.md',
            ),
        ).toThrow('malformed');
    });
});
