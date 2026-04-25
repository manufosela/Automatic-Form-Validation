# @manufosela/form-validators

> **Library.** Pure deterministic predicates and normalizers for common form-field validation. Zero dependencies, zero DOM access. MIT-licensed.

Each validator is a named export that takes a value and returns a `boolean`. Each validator also has a paired `normalize<Name>(value)` function that returns the canonical form (trim + format-specific cleanup like stripping country code from phones, lowercasing emails, uppercasing Spanish documents, etc.). Designed to be the validation core of UI libraries (`automatic_form_validation`, `@manufosela/ai-form`) and of any custom form code.

## Install

```bash
npm install @manufosela/form-validators
```

## Usage

```js
import { email, mobileEs, nif, creditCard } from '@manufosela/form-validators';

email('manu@example.io'); // true
mobileEs('600 000 000'); // true
nif('12345678Z'); // true (control letter checked)
creditCard('4111111111111111'); // true (Luhn-checked)
```

### Normalizers

Pair each validator with `normalize<Name>(value)` to get the canonical form before storing:

```js
import { normalizeMobileEs, normalizeEmail, normalizeNif } from '@manufosela/form-validators';

normalizeMobileEs('+34 639 01 89 87'); // '639018987'
normalizeEmail(' Manu@Example.IO '); // 'manu@example.io'
normalizeNif(' 12345678z '); // '12345678Z'
```

Compose `normalize` then `validate` for the typical "clean and check" pipeline:

```js
import { normalizeMobileEs, mobileEs } from '@manufosela/form-validators';
const value = normalizeMobileEs(rawInput);
if (mobileEs(value)) save(value); // store the canonical form
```

### Lookup by name

For dynamic dispatch (e.g. from a `data-tovalidate` attribute), use `validate(name)` and `normalize(name)`:

```js
import { validate, normalize } from '@manufosela/form-validators';

const fn = validate('movil');
const clean = normalize('movil');
fn(clean('+34 600 000 000')); // → true, value stored as '600000000'
```

Both lookups are case-insensitive and accept every alias from the legacy [`automatic_form_validation`](../automatic-form-validation) library: `mobile`, `movil`, `nummovil`, `email`, `correo`, `nif`, `cif`, `nie`, `cuentabancaria`, `creditcard`, `tarjetacredito`, etc. `normalize(name)` of an unknown name returns a safe trim-only fallback so callers never need to null-check.

## Validator catalogue

| Category | Validators | Normalizer canonicalises |
| -------- | ---------- | ------------------------ |
| Numeric  | `integer`, `float`, `number` | trim + accept comma decimal |
| Text     | `alpha`, `alphaWithDash`, `alphanumeric`, `alphanumericWithSpace` | trim + collapse internal whitespace |
| Date     | `date(value, mode?)` — mode `'dmy'` (default), `'mdy'`, `'ymd'` | `dd/mm/yyyy` (or `yyyy/mm/dd`), zero-padded |
| File     | `fileExtension(filename, [".pdf", ".doc"])` | trim only |
| Email    | `email` | trim + lowercase + strip whitespace |
| URL      | `url` | trim + prepend `https://` if missing + lowercase scheme/host |
| Phones   | `mobileEs`, `landlineEs`, `telephoneEs`, `postalCodeEs`, `iccid` | trim + strip separators + strip `+34`/`0034`/`34` country prefix |
| Spanish documents | `nif`, `nie`, `cif`, `bankAccountEs` (CCC) | trim + uppercase + strip separators |
| Banking | `creditCard` (Luhn) | trim + strip spaces/hyphens/dots |

## Versioning

Project policy: **semver from 1.0.0**. There is no 0.x phase — when something is released, it's released. Breaking changes bump major. The first release of this package was `1.0.0` even though the catalogue had been previously available as a sub-module of `automatic_form_validation@1.6.0`.

## Origin

The catalogue was extracted from [`Automatic-Form-Validation`](https://github.com/manufosela/Automatic-Form-Validation) (Apache-2.0) and relicensed by the original author to MIT for broader reuse. The source library now consumes this package internally.

## License

MIT © Mánu Fosela
