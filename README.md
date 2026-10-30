# ngx-signal-schema
[![Angular](https://img.shields.io/badge/Angular-22+-DD0031?style=flat-square&logo=angular)](https://angular.dev)
[![CI](https://img.shields.io/github/actions/workflow/status/devZWO/ngx-signal-schema/main.yml?style=flat-square)](https://github.com/devZWO/ngx-signal-schema/actions/workflows/main.yml)
[![codecov](https://img.shields.io/codecov/c/github/devzwo/ngx-signal-schema?style=flat-square)](https://codecov.io/github/devZWO/ngx-signal-schema)
[![NPM Version](https://img.shields.io/npm/v/@devzwo/ngx-signal-schema?style=flat-square)](https://npmjs.org/package/@devzwo/ngx-signal-schema)
[![License](https://img.shields.io/npm/l/%40devzwo%2Fngx-signal-schema?style=flat-square)](https://github.com/devZWO/ngx-signal-schema/blob/main/LICENSE)


> Composable schema validation operators for
[Angular Signal Forms](https://angular.dev/essentials/signal-forms).
>
> Built for Angular v22+.

# ngx-signal-schema Workspace

## Development

Use Node.js 24 and npm. Install the locked dependencies with `npm ci`.

```bash
npm start                 # Angular demo
npm run docs:dev          # Astro / Starlight documentation
npm run lib:watch         # Library development build in watch mode
npm run build             # Library, demo and documentation
npm run recipes:check     # Strict TypeScript and Angular template checks for docs examples
npm run package:check     # npm pack contents, bundled links and llms.txt endpoints
npm run release:check     # Lint, tests, Pages build, recipes and package validation
```

## Documentation and demo

[Documentation](https://devzwo.github.io/ngx-signal-schema/) and the
[live demo](https://devzwo.github.io/ngx-signal-schema/demo/) share one GitHub Pages
artifact. `npm run pages:build` builds the library and docs, builds the demo with
`/ngx-signal-schema/demo/` as its base URL and copies it into `docs/dist/demo/`.
The demo uses hash routes so deep links and reloads work on GitHub Pages.

The Pages workflow runs when a GitHub release is published or when manually
triggered. GitHub Pages must use **GitHub Actions** as its deployment source.

## Publishing

Publish through a GitHub release. The publishing workflow calls the reusable
`main.yml` CI workflow and publishes its validated package artifact using npm
trusted publishing with provenance. The `NPM_DIST_TAG` is `next` for prereleases
and `latest` for stable releases. Configure the npm trusted publisher for this
repository's `publish.yml` workflow.

## AI and offline documentation

Start with the [AI Agent Guide](https://devzwo.github.io/ngx-signal-schema/ai/usage/)
or [llms.txt](https://devzwo.github.io/ngx-signal-schema/llms.txt). The documentation
build exports Markdown versions of every guide and generated API page. The npm
package bundles `ai/usage.md` and the getting started, concept and recipe guides
under `docs/`, with links rewritten for offline reading.

## Structure

- [Library usage README](projects/ngx-signal-schema/README.md)
- `docs/src/content/docs/`: documentation source; edit these files rather than generated output
- `scripts/`: Recipe compilation, Markdown export, package validation and Pages assembly


## Contributing
Contributions are welcome! Please follow the guidelines in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Maintainer

This project is developed and maintained by the **devZWO GmbH**.

https://devzwo.com
