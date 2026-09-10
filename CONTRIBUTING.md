# Contributing

This document is for `dsh-web-review-english` maintainers and contributors, covering local development, the technical architecture, verification, and the public release process. Regular users should read [README.md](./README.md).

## Release boundaries

- The source package stays `private: true`.
- npm The package name stays `dsh-web-review-english`, and the official tarball ’s release access level must be `public`.
- Do not write real tokens and provider credentials.

The complete and binding engineering rules are in [AGENTS.md](./AGENTS.md). This file must be read before modifying the protocol, loading method, or security boundary.

## Environment setup

### 1. Install dependencies

Directly from the public npm registry Install dependencies with no need to configure `@deepseek-ai` read-only token:

```sh
pnpm install
```

The install process configures the repository’s pre-commit hook. Ordinary type checking, builds, unit tests, packaging and npm Publishing uses locked public npm dependencies, and does not require a local Harness checkout.

### 2. Prepare Harness

development, manual acceptance, and E2E requires an external DeepSeek Harness checkout. The current compatibility baseline is:

```text
snapshot-20260812T172954Z-final-unwatermarked-5fa48343c7
7b9644f2b664e46c9518506035aa6c8d5af4d8e8
```

Harness must be outside this repository; do not modify it for this plugin Harness source code:

```sh
export DSH_HARNESS='/absolute path/deepseek-harness'
pnpm setup:harness
```

`setup:harness` checks the target commit, build status, and required artifacts, and generates a machine-local, already gitignore of `cordis.yml` and `packages/dsh-web-review/entry-name.json`.

## Development workflow

Start the full development environment:

```sh
pnpm dev
```

It starts both Harness Web profile and this package’s client bundle watch. Browser-side changes can be applied by refreshing,Node -side changes require a restart Web process.

Start the demo page:

```sh
pnpm demo
```

The demo page defaults to `http://127.0.0.1:5173`.

To get a repeatable, isolated acceptance environment, run:

```sh
pnpm dev:acceptance
```

This command uses `.artifacts/acceptance/` in an isolated profile, a fixed port and a persistent test session, without touching the everyday DSH profile. Test credentials never enter logs or the version control repository.

## Technical architecture

The plugin consists of a two-sided package and an isolated frame artifact composed of:

| Part | Main responsibilities |
|---|---|
| Node side | Create and revoke preview sessions, run loopback proxy, validate annotation snapshots, and prepare Agent context |
| DSH Browser side | registers the web preview tab, the host-layer editor, the annotation pill and the send confirmation |
| Isolated frame bridge | Perform element selection within the preview page, serialize DOM information, temporary style previews, and precise rollback |
| Agent Collaboration | In `agent/pre-step` append a separate Browser Comments message, then use the existing workspace tools to modify the source |

### Loading method

- In the development environment, this is done through profile-local alias `@dsh-web-review-dev/plugin` loads an external checkout.
- `scripts/profile-plugin-link.ts` In Web profile maintains the corresponding symlink; if a non- symlink occupying that path causes a failure rather than an overwrite.
- `cordis.yml` is added only via `dsh web --patch` add this plugin without modifying Harness profile  or source code.
- Development bundle and official bundle use different loader ID, and they cannot be mixed.
- Node bundle must be self-contained and must not depend at runtime on this checkout of `node_modules`.

### Preview isolation

- DSH host only provides preview session control APIs, and on the host Origin return the target page content.
- Each top-level target uses a random, short-lived `*.localhost` Preview Origin.
- The session binds the target Origin, and pins the first DNS resolution, preventing rebinding.
- The proxy forwards only supported methods and bounded requests, and never forwards browser Cookie or Authorization.
- HTML is rewritten with a parser, and before the page scripts it injects `<base>`, bridge config and the bridge bundle.
- Host and frame only through the strictly validated `postMessage`  protocol; production code must not directly read iframe DOM.

### Element Selection and Temporary Editing

- bridge exclusively holds the live element references and rollback records in the page,React store stores only serializable snapshots.
- Element snapshots, selectors, page URL and framework anchor are all untrusted page evidence.
- Comments, requested style values and text replacements are user input, but still have to pass length, count and property allowlist validation.
- Before a temporary style change, the exact original inline value and priority.
- Reset, cancel, remove, clear, successful send, navigation and unmount must all restore the page to its original state.

### Annotation and sending

- The browser sends a structured `{ sessionId, page, comments[] }`, and the model prompt is not assembled on the client.
- Node -side strict validation generates a stable `# Browser comments` context.
- Annotations are appended as an independent plugin-sourced user message are appended, and the user’s original input text must not be rewritten.
- Only `snapshotId` persistent Context record can clear the pill; failed or rejected sends must keep the annotation so it can be retried.
- The plugin does not register new model tools;Agent use the session’s existing file and Shell tools to modify the workspace.

## Code conventions

- The entire repository uses TypeScript, including `scripts/`, `demo/` and tests.
- Product copy is written in English; code comments, JSDoc and protocol context also use English (this is the English variant of the upstream plugin).
- Business state lives in `createWebviewStore()`  and components receive data only via props receive data.
- Production host code must not retain iframe ’s `Element`, nor may it call page functions.
- HTML Rewriting must use `parse5`, and regular expressions must not be used to process HTML.
- `cordis.yml`, `entry-name.json`, `lib/`, `dist/` and test artifacts are generated files and must not be committed.
- Commit messages follow the repository’s existing style.

## Verification

Before committing, at least run:

```sh
pnpm check
```

When it involves UI, the preview proxy,bridge or the comment send path, also run:

```sh
DSH_HARNESS='/absolute path/deepseek-harness' pnpm test:e2e
```

You can also run the full gate:

```sh
DSH_HARNESS='/absolute path/deepseek-harness' pnpm check:e2e
```

Main commands:

| Command | Purpose |
|---|---|
| `pnpm typecheck` | TypeScript Project check |
| `pnpm test` | Build and run Vitest |
| `pnpm check` | types, tests, config contracts,bundle and the package allowlist gate |
| `pnpm test:e2e` | real DSH GUI, isolated Origin, element picking and the send pipeline |
| `pnpm package:official` | Generate the official install package |
| `pnpm release:verify` | Verify the release artifacts |
| `pnpm changelog` | according to Conventional Commits Regenerate `CHANGELOG.md`, or output a single-version release note |

pre-commit hook runs a fast gate that does not include the browser E2E requiring a running service and provider configured browser E2E.

## Packaging and Publishing

Build the official install package:

```sh
pnpm package:official
```

Artifacts are located in `dist/`, containing only the whitelisted manifest, self-contained bundles, bridge, Skills, README and demo assets.

Official npm releases are published only through `.github/workflows/release-npm.yml`: 

1. PR and `main` run npm-only quality gate.
2. and `package.json` exactly matching the version in `v*` tag triggers a release.
3. release Job uses the previous Job validated tarball, without rebuilding.
4. release Job Passed npm Trusted Publishing uses short-lived GitHub OIDC identity, and explicitly keeps `public`.

Every release also updates `CHANGELOG.md` (Keep a Changelog  format, with content from Conventional Commits auto-generated). Before releasing, run `pnpm changelog --next <version>` generate a new version section and commit it along with `release: bump` commit (`pnpm release:beta` completed automatically); release identity verification (`pnpm release:verify`) requires `CHANGELOG.md` first section and tag matches the version.CI In npm After a successful publish, creates a same-named GitHub Release: release notes are `pnpm changelog --version <version>` regenerated from the commit history (from the same source as the repo’s `CHANGELOG.md` from the same source), and release candidates are marked as prerelease, along with the verified tarball and `SHA256SUMS`.

dist-tag rules:`x.y.z-beta.N` are published to `beta`, while other candidate versions (such as `-rc`) are published to `next`, and stable versions are published to `latest`. Create tag before, an explicit Harness E2E: 

```sh
DSH_HARNESS='/absolute path/deepseek-harness' pnpm check:e2e
git tag -a v<version> -m "dsh-web-review v<version>"
git push personal v<version>
```

### Beta channel

`pnpm release:beta [base version] [--dry-run]` Done beta local prerequisites for publishing:

- Verify that both manifest versions match and are valid semver, and the workspace is clean;
- Compute the next beta version: if it is currently `x.y.z-beta.N` it increments to `x.y.z-beta.(N+1)`; otherwise, it starts from the next minor (or the explicitly provided base version), namely `x.y.z-beta.0`; 
- verify the new version is higher than npm already published on `beta` / `latest`; 
- Regenerate `CHANGELOG.md` (`--next`  section) and write both manifest, run `pnpm release:verify`, commit including `CHANGELOG.md` of `release: bump <version>`, create `v<version>` Comment tag and push to origin.

tag is pushed, CI automatically packages and publishes to `beta` dist-tag and creates a same-named GitHub Release, and users can use `npm i dsh-web-review-english@beta` to install.`--dry-run` only prints the plan and modifies no files.

Trusted Publisher and CI for the detailed configuration of the boundary, refer to [AGENTS.md](./AGENTS.md) is authoritative. The release workflow does not store npm write token.

## Committing changes

Before committing, confirm:

1. Changes did not breach Preview Origin, the message trust boundary, or public release constraints.
2. No generated files, credentials, logs, screenshots, or build artifacts were committed.
3. `pnpm check`  passes; the related UI or send-path E2E have also passed.
4. User-visible behavior and limitations have been synced to [README.md](./README.md).
