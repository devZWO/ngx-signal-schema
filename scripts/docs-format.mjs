import { posix } from 'node:path';

export const base = '/ngx-signal-schema/';
export const site = `https://devzwo.github.io${base}`;

// Only transform prose: imports and HTML inside code fences must survive verbatim.
export function transformProse(markdown, transform) {
    return markdown
        .split(/(^```[^\n]*\n[\s\S]*?^```[^\n]*$)/gm)
        .map((part, index) => (index % 2 ? part : transform(part)))
        .join('');
}

export function parseDocument(name, raw) {
    const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    const title = frontmatter?.[1].match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1] ?? name;
    const body = frontmatter ? raw.slice(frontmatter[0].length) : raw;
    const markdown = transformProse(body, (prose) =>
        prose
            .replace(/^import\s+[^;]+;\s*$/gm, '')
            .replace(/\{\/\*\s*recipe-check:[\s\S]*?\*\/\}/g, '')
            .replace(/<!--\s*recipe-check:[\s\S]*?-->/g, '')
            .replace(/<Card\s+title="([^"]+)"[^>]*>/g, '### $1\n')
            .replace(/<\/?CardGrid\b[^>]*>|<\/Card>/g, '')
            .replace(
                /<a\s+href="([^"]+)"\s*>([\s\S]*?)<\/a>/g,
                (_, href, text) => `[${text.trim().replace(/\s+/g, ' ')}](${href})`,
            ),
    );
    const path = name.replace(/\.mdx$/, '.md');
    return {
        path,
        route: path
            .replace(/\.md$/, '')
            .replace(/\/index$/, '')
            .replace(/^index$/, ''),
        title,
        markdown: `# ${title}\n\n${markdown.trim()}\n`,
    };
}

export function packagePath(doc) {
    return doc.path === 'ai/usage.md' ? doc.path : `docs/${doc.path}`;
}

export function isConsumerDoc(doc) {
    return /^(ai\/|recipes\/|concepts\/|gettingstarted\.md$)/.test(doc.path);
}

export function rewriteLinks(markdown, doc, allDocs, target) {
    return transformProse(markdown, (prose) =>
        prose.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label, href) => {
            if (/^(?:[a-z]+:|#)/i.test(href)) return match;
            const [path, fragment] = href.split('#');
            const suffix = fragment ? `#${fragment}` : '';
            const route = path.startsWith(base)
                ? path.slice(base.length)
                : posix.resolve(`/${doc.route}/`, path).slice(1);
            const normalized = route
                .replace(/\.(md|mdx)$/, '')
                .replace(/\/$/, '')
                .toLowerCase();
            const linked = allDocs.find(
                (candidate) => candidate.route.toLowerCase() === normalized,
            );
            if (!linked) return `[${label}](${site}${route}${suffix})`;
            if (target === 'site') return `[${label}](${base}${linked.path}${suffix})`;
            if (!isConsumerDoc(linked))
                return `[${label}](${site}${linked.route.toLowerCase()}/${suffix})`;
            const relative = posix.relative(posix.dirname(packagePath(doc)), packagePath(linked));
            return `[${label}](./${relative}${suffix})`;
        }),
    );
}

export function llmsIndex(allDocs, packageJson) {
    const entries = allDocs.filter((doc) => !/^(maintainers|reference\/|404)/.test(doc.path));
    return (
        `# ${packageJson.name} (v${packageJson.version})\n\n> ${packageJson.description}\n\nAngular 22 Signal Forms. Start with the AI Agent Guide and use only the public package exports.\n\n` +
        entries.map((doc) => `- [${doc.title}](${base}${doc.path})`).join('\n') +
        '\n'
    );
}
