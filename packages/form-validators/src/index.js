// Pure deterministic predicates for common form-field validation. Each
// validator is a named export so consumers can import only what they need
// (tree-shaking-friendly). All validators return `boolean` and never
// touch the DOM.

// Primitive
export { integer, normalizeInteger } from './primitive/integer.js';
export { float, normalizeFloat } from './primitive/float.js';
export { number, normalizeNumber } from './primitive/number.js';
export {
  alpha,
  alphaWithDash,
  alphanumeric,
  alphanumericWithSpace,
  normalizeAlpha,
  normalizeAlphaWithDash,
  normalizeAlphanumeric,
  normalizeAlphanumericWithSpace,
} from './primitive/alpha.js';
export { date, normalizeDate } from './primitive/date.js';

// File
export { fileExtension, normalizeFileExtension } from './file/extension.js';

// Communications
export { email, normalizeEmail } from './comms/email.js';
export { url, normalizeUrl } from './comms/url.js';
export { mobileEs, normalizeMobileEs } from './comms/mobileEs.js';
export { landlineEs, normalizeLandlineEs } from './comms/landlineEs.js';
export { telephoneEs, normalizeTelephoneEs } from './comms/telephoneEs.js';
export { postalCodeEs, normalizePostalCodeEs } from './comms/postalCodeEs.js';
export { iccid, normalizeIccid } from './comms/iccid.js';

// Spanish documents
export { nif, normalizeNif } from './es/nif.js';
export { nie, normalizeNie } from './es/nie.js';
export { cif, normalizeCif } from './es/cif.js';
export { bankAccountEs, normalizeBankAccountEs } from './es/bankAccountEs.js';

// Banking
export { creditCard, normalizeCreditCard } from './banking/creditCard.js';

// Dispatch by name (with all the legacy aliases).
export { validate, validators, normalize, normalizers } from './aliases.js';
