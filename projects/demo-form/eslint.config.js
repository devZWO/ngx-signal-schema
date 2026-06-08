// @ts-check
const {defineConfig} = require('eslint/config');
const rootConfig = require('../../eslint.config.js');

module.exports = defineConfig([
    ...rootConfig,
    {
        files: ['**/*.ts'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'error',
            '@angular-eslint/directive-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'app',
                    style: 'camelCase',
                },
            ],
            '@angular-eslint/component-selector': [
                'error',
                [
                    {
                        type: 'element',
                        prefix: 'app',
                        style: 'kebab-case',
                    },
                    {
                        type: 'attribute',
                        prefix: 'app',
                        style: 'camelCase',
                    },
                ],
            ],
        },
    },
    {
        files: ['**/*.html'],
        rules: {},
    },
]);
