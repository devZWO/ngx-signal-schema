import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
    plugins: [
        angular({
            tsconfig: './projects/ng-form-schema/tsconfig.spec.json'
        }),
    ],

    test: {
        globals: false,
        environment: 'jsdom',
        setupFiles: ['./test-setup.ts'],
        include: ['projects/ng-form-schema/src/**/*.spec.ts'],

        restoreMocks: true,
        mockReset: true,
        clearMocks: true,

        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'lcov'],
            reportsDirectory: './coverage/ng-form-schema'
        },
    },
});
