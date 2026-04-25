# @manufosela/form-validators

> **Library.** Pure deterministic predicates for common form-field validation. Zero dependencies, zero DOM access. MIT-licensed.

Each validator is a named export that takes a value and returns a `boolean`. Designed to be the validation core of UI libraries (`automatic_form_validation`, `@manufosela/ai-form`) and of any custom form code.

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

### Lookup by name

For dynamic dispatch (e.g. from a `data-tovalidate` attribute), use `validate(name)`:

```js
import { validate } from '@manufosela/form-validators';

const fn = validate('movil');
fn('600 000 000'); // true
```

The name lookup is case-insensitive and accepts every alias from the legacy [`automatic_form_validation`](../automatic-form-validation) library: `mobile`, `movil`, `nummovil`, `email`, `correo`, `nif`, `cif`, `nie`, `cuentabancaria`, `creditcard`, `tarjetacredito`, etc.

## Validator catalogue

| Category | Validators |
| -------- | ---------- |
| Numeric  | `integer`, `float`, `number` |
| Text     | `alpha`, `alphaWithDash`, `alphanumeric`, `alphanumericWithSpace` |
| Date     | `date(value, mode?)` — mode `'dmy'` (default), `'mdy'`, `'ymd'` |
| File     | `fileExtension(filename, [".pdf", ".doc"])` |
| Communications | `email`, `url`, `mobileEs`, `landlineEs`, `telephoneEs`, `postalCodeEs`, `iccid` |
| Spanish documents | `nif`, `nie`, `cif`, `bankAccountEs` (CCC) |
| Banking | `creditCard` (Luhn) |

## Origin

The catalogue was extracted from [`Automatic-Form-Validation`](https://github.com/manufosela/Automatic-Form-Validation) (Apache-2.0) and relicensed by the original author to MIT for broader reuse. The source library now consumes this package internally.

## License

MIT © Mánu Fosela
