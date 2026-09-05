# time-app

Workspace application that consumes shared UI from `ui-common`.

## Development

```bash
pnpm --filter time-app dev
```

The app uses sample data by default so the shared employee search modal can be tested without a backend.

Use real APIs by setting:

```bash
VITE_USE_SAMPLE_DATA=false
```

## Build

```bash
pnpm --filter time-app build
```
