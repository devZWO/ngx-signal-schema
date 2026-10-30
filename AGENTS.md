# Agent Guidelines for ngx-signal-schema

This document outlines the guidelines and best practices for AI agents working in this repository.

## Commit Messages

- **Conventional Commits**: All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.
- Use structured types such as:
    - `feat:` for new features or capabilities
    - `fix:` for bug fixes
    - `docs:` for documentation updates
    - `refactor:` for code changes that neither fix a bug nor add a feature
    - `test:` for adding or updating tests
    - `chore:` for build tasks, dependencies, and configuration changes
- Keep commit descriptions concise, clear, and imperative.

## TypeScript Best Practices

- Use strict type checking.
- Prefer type inference when the type is obvious.
- Avoid the `any` type; use `unknown` when the type is uncertain.

## Angular Best Practices

- Always use standalone components over NgModules (default in Angular v22+; do NOT set `standalone: true` explicitly in decorators).
- Use signals for state management (`signal()`, `computed()`).
- Do NOT use `mutate` on signals; use `update` or `set`.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorators (it is the default).
- Do NOT use `@HostBinding` or `@HostListener` decorators; use the `host` property on decorators instead.
- Use `input()` and `output()` functions instead of property decorators.
- Use the `inject()` function instead of constructor injection.
- Use native control flow (`@if`, `@for`, `@switch`) instead of structural directives (`*ngIf`, `*ngFor`).
- Do NOT use `ngClass` or `ngStyle`; use native `class` and `style` bindings.
- Use `NgOptimizedImage` for static images.

## Testing & Quality

- Use Vitest for unit testing.
- Test edge cases, error handling, and core logic.
- Keep tests fast, isolated, and type-safe (avoid casting to `any`).
- Ensure all CI checks (linting, tests, build) pass before completing tasks.

## Documentation and Tooling

- Use Node.js 24 and `npm ci`; this workspace uses npm.
- Read `docs/src/content/docs/ai/usage.md` for library integration rules.
- Edit documentation in `docs/src/content/docs/`; TypeDoc generates the `api/` pages.
- Mark complete TypeScript examples in recipe and AI pages for `npm run recipes:check`.
  Use HTML comments in Markdown and JSX comments in MDX (see the maintainers guide).
- `npm run package:check` validates offline documentation, npm contents and Markdown endpoints.
- Run `npm run release:check` before completing changes to release or documentation tooling.
- Reuse `.github/workflows/main.yml` for release validation; publish its checked artifact.
