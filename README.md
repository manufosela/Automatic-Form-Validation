# Automatic-Form-Validation — monorepo

This repository ships **two npm packages** that share a single validator catalogue:

| Package | Path | License | Purpose |
| ------- | ---- | ------- | ------- |
| [`@manufosela/form-validators`](./packages/form-validators) | `packages/form-validators` | **MIT** | Pure deterministic predicates (`email`, `nif`, `iban`, `creditCard`…). Zero deps, zero DOM access. |
| [`automatic_form_validation`](./packages/automatic-form-validation) | `packages/automatic-form-validation` | **Apache-2.0** | Auto-binding form validation UI driven by `data-tovalidate` HTML attributes. Built on top of `@manufosela/form-validators`. |

## Why two packages

Validation has two layers:

1. **The rule** — does this string look like a valid NIF? (deterministic, pure)
2. **The integration** — render error messages, mark required fields, handle submit. (DOM-coupled UI)

Splitting them lets other libraries (e.g. `@manufosela/ai-form`'s conversational AI mode) consume the rule layer without inheriting the UI layer.

## Workspace

```bash
pnpm install
pnpm test          # runs every package's suite
pnpm build         # builds every package
```

## Releases

Each package versions independently:

- `form-validators` started at v0.1.0 in 2026-04 when extracted from this repo.
- `automatic_form_validation` jumped from v1.6.0 → **v1.7.0** when refactored to depend on `form-validators` (see CHANGELOG).

## License

- `form-validators`: MIT © Mánu Fosela
- `automatic_form_validation` (and the original sources of this repository): Apache-2.0 © Mánu Fosela
