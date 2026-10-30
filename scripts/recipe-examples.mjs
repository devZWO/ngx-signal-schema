import assert from 'node:assert/strict';

/** Extract marked blocks. Repeated filenames assemble the steps of one example. */
export function recipeExamples(markdown, source) {
    const blocks = [
        ...markdown.matchAll(
            /(?:<!--\s*recipe-check:\s*([\w.-]+\.ts)\s*-->|\{\/\*\s*recipe-check:\s*([\w.-]+\.ts)\s*\*\/\})\s*```(?:ts|typescript)\r?\n([\s\S]*?)\r?\n```/g,
        ),
    ];
    assert.ok(blocks.length > 0, `${source}: mark at least one checkable TypeScript example`);
    const markers = markdown.match(/recipe-check:/g) ?? [];
    assert.equal(
        blocks.length,
        markers.length,
        `${source}: malformed recipe-check marker or missing TypeScript block`,
    );
    return blocks.map(([, mdName, mdxName, code]) => ({ filename: mdName ?? mdxName, code }));
}
