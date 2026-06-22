// @ts-check
import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightTypeDoc from 'starlight-typedoc'


// https://astro.build/config
export default defineConfig({
    site: 'https://devzwo.github.io',
    base: '/ngx-signal-schema',
    integrations: [
        starlight({
            title: 'ngx-signal-schema',
            social: [{icon: 'github', label: 'GitHub', href: 'https://github.com/devZWO/ngx-signal-schema'}],
            plugins: [
                // Generate the documentation.
                starlightTypeDoc({
                    entryPoints: ['../projects/ngx-signal-schema/src/public-api.ts'],
                    tsconfig: '../projects/ngx-signal-schema/tsconfig.lib.json',
                    typeDoc: {
                        router: 'category',
                    }
                }),
            ],
            sidebar: [
                {
                    label: 'Welcome', slug: 'index',
                },
                {
                    label: 'Getting Started', link: 'gettingstarted'
                },
                {
                    label: 'Concepts',
                    items: [
                        { label: 'Overview', slug: 'concepts' },
                        // Each item here is one entry in the navigation menu.
                        {label: 'Schema Composition', slug: 'concepts/schemacomposition'},
                        {label: 'Conditional Schemas', slug: 'concepts/conditionalschemas'},
                        {label: 'Reusable Validators', slug: 'concepts/reusablevalidators'},
                        {label: 'Stable Form Structures', slug: 'concepts/stableformstructures'},
                    ],
                },
                {
                    label: 'Recipes',
                    items: [
                        // Each item here is one entry in the navigation menu.
                        {label: 'Contact Form', slug: 'recipes/contact-form'},
                        {label: 'Listings Form', slug: 'recipes/list-recipe'}
                    ],
                },
                {
                    label: 'API',
                    // items: [{autogenerate: {directory: 'api'}}]
                    items: [
                        { label: 'readme', slug: 'api/readme' },
                        {label: 'Composition', items: [{autogenerate: {directory: 'api/Composition'}}]},
                        {label: 'Validators', items: [{autogenerate: {directory: 'api/Validators'}}]},
                        {label: 'Conditions', items: [{autogenerate: {directory: 'api/Conditions'}}]},
                        {label: 'Rules', items: [{autogenerate: {directory: 'api/Rules'}}]},
                        {label: 'Structure', items: [{autogenerate: {directory: 'api/Structure'}}]},
                        {label: 'Other', items: [{autogenerate: {directory: 'api/Other'}}]},
                        {label: 'deprecated', items: [{autogenerate: {directory: 'api/deprecated'}}]},
                    ],
                },
                {
                    label: 'Maintainers', slug: 'maintainers'
                },
            ],
            components: {
                Footer: './src/components/footer.astro',
            },
        }),
    ],
});
