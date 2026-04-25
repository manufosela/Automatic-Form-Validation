# automatic_form_validation — CHANGELOG

## 1.7.0 — 2026-04-25

Validation catalogue extracted to a separate package: [`@manufosela/form-validators`](https://www.npmjs.com/package/@manufosela/form-validators) (MIT). `VerifyUtils` is now a thin shim that delegates to those predicates, and `ValidateForm`'s dispatch table consumes the same catalogue.

### Bug fixes (latent in 1.6.x, fixed by adopting `form-validators`)

- **`isInt(value)` and `isFloat(value)` now accept numeric strings.** The old `value === parseInt(value, 10)` comparison always returned `false` against DOM input values (which are strings), meaning `data-tovalidate="int"` and `data-tovalidate="float"` never validated anything in production.
- **`isEmail` rejects addresses without a real TLD.** The old regex had an unescaped `.` so `'no@domain'` was accepted.
- **`isDate` validates leap years and 30-day months correctly.** The old code compared strings to numbers with `===`, so 29-Feb-2023 and 31-Apr were always accepted.
- **`isDate` `'ymd'` mode now parses 4-digit-year dates.** The old regex required a 1-2 digit first segment, killing the documented `'ymd'` mode.
- **`checkCodPostal` accepts string postal codes (incl. leading zeros).** Was rejecting every 5-digit string due to the `isInt` bug above. `08001` (Barcelona), `01001` (Vitoria) etc. now validate.
- **`verificaNumTarjetaCredito` accepts Luhn-valid Visa/Mastercard.** The old `[3,4,5,6].includes(numtarjeta[0])` compared a string character to numeric values, always returning false → all cards were rejected.
- **`verificaCuentaBancaria`** and the NIF/CIF/NIE catalogue are unchanged in behaviour for the existing valid/invalid examples.

### Breaking changes

- **`validaNifCifNie(value)` is pure.** The historical DOM lookup of `#documento_de_identidad` (returning `1` early for `value="PASAPORTE"`) has been removed. Form code that needs the PASAPORTE bypass must branch outside this validator.
- **Removed internal helpers from the public surface:** `_CalculateLuhn`, `_getCtrlNumberCreditCard`, `calcDigitoControl2LineaNIF`. They were undocumented internals; the equivalent logic lives in `@manufosela/form-validators`.

### Other changes

- Repository converted to a pnpm workspace (`packages/form-validators` and `packages/automatic-form-validation`).
- New runtime dependency: `@manufosela/form-validators ^0.1.0`.

## 1.6.0 — earlier

See git history.
