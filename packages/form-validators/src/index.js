// Pure deterministic predicates for common form-field validation. Each
// validator is a named export so consumers can import only what they need
// (tree-shaking-friendly). All validators return `boolean` and never
// touch the DOM.

// Primitive
export { integer } from './primitive/integer.js';
export { float } from './primitive/float.js';
export { number } from './primitive/number.js';
export {
  alpha,
  alphaWithDash,
  alphanumeric,
  alphanumericWithSpace,
} from './primitive/alpha.js';
export { date } from './primitive/date.js';

// File
export { fileExtension } from './file/extension.js';

// Communications
export { email } from './comms/email.js';
export { url } from './comms/url.js';
export { mobileEs } from './comms/mobileEs.js';
export { landlineEs } from './comms/landlineEs.js';
export { telephoneEs } from './comms/telephoneEs.js';
export { postalCodeEs } from './comms/postalCodeEs.js';
export { iccid } from './comms/iccid.js';

// Spanish documents
export { nif } from './es/nif.js';
export { nie } from './es/nie.js';
export { cif } from './es/cif.js';
export { bankAccountEs } from './es/bankAccountEs.js';

// Banking
export { creditCard } from './banking/creditCard.js';

// Dispatch by name (with all the legacy aliases).
export { validate, validators } from './aliases.js';
