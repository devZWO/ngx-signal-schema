# Contributing to ngx-signal-schema

Thank you for your interest in contributing to `ngx-signal-schema`! We welcome contributions from the community to help make this library better.

By submitting a contribution (including code, documentation, issues, or pull requests), you agree that your contribution is licensed under the same MIT License that covers the project
and that your contributions may be modified, redistributed, and used commercially as part of the project without additional approval or compensation.

You confirm that:

you have the right to submit the contribution,
the contribution is your original work or appropriately licensed,
you grant the project maintainers the perpetual, worldwide, non-exclusive, royalty-free right to use, modify, distribute, sublicense, and relicense your contribution as part of the project.

All contributions are considered to be provided under the MIT License unless explicitly stated otherwise.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ngx-signal-schema.git
   cd ngx-signal-schema
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development Workflow

### Building the Library

To build the library, run:
```bash
npm run build
```

### Running Tests

We use Vitest for testing. You can run the tests using:
```bash
npm test
```

To run tests in watch mode:
```bash
npx vitest
```

### Formatting

We use Prettier for code formatting. Please ensure your code follows the project's formatting rules:
```bash
npx prettier --write .
```

## Coding Standards

Please follow these guidelines to ensure consistency and quality across the codebase.

### TypeScript Best Practices

- **Strict Typing**: Always use strict type checking. Avoid the `any` type; use `unknown` if the type is truly uncertain.
- **Type Inference**: Prefer type inference when the type is obvious.
- **Functional Approach**: Favor functional programming patterns and immutability.

### Angular Best Practices

- **Signals**: Use Signals for state management and local component state.
- **Derived State**: Use `computed()` for all derived state.
- **Standalone Components**: All components must be standalone (this is the default in our Angular version).
- **Change Detection**: Use `ChangeDetectionStrategy.OnPush` for all components.
- **Host Bindings**: Do NOT use `@HostBinding` or `@HostListener`. Use the `host` object in the `@Component` or `@Directive` decorator instead.
- **Inputs & Outputs**: Use the `input()` and `output()` functions instead of decorators.
- **Dependency Injection**: Use the `inject()` function instead of constructor injection.
- **Control Flow**: Use native control flow syntax (`@if`, `@for`, `@switch`) instead of structural directives like `*ngIf`.
- **Styling**: Do NOT use `ngClass` or `ngStyle`. Use standard `class` and `style` bindings (e.g., `[class.active]="isActive()"`).
- **Templates**: Keep templates simple and avoid complex logic. Prefer inline templates for small components.
- **Images**: Use `NgOptimizedImage` for static images.

## Pull Request Process

1. **Create a Branch**: Create a new branch for your feature or bug fix.
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Make Changes**: Implement your changes following the coding standards.
3. **Add Tests**: Ensure your changes are covered by tests.
4. **Verify Build**: Run `npm run build` and `npm test` to ensure everything works as expected.
5. **Submit PR**: Open a Pull Request against the `main` branch. Provide a clear description of the changes and link any relevant issues.

## Reporting Issues

If you find a bug or have a feature request, please open an issue on GitHub.
- Use a descriptive title.
- Provide steps to reproduce for bugs.
- Explain the motivation and use case for feature requests.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
