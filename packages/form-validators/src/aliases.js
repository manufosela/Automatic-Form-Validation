// Dispatch table mapping every public alias (matching the legacy
// `data-tovalidate` values from automatic_form_validation, plus our new
// canonical names) to the corresponding validator function. Keys are
// case-insensitive when looked up via `validate()`.

import { integer } from './primitive/integer.js';
import { float } from './primitive/float.js';
import { number } from './primitive/number.js';
import {
  alpha,
  alphaWithDash,
  alphanumeric,
  alphanumericWithSpace,
} from './primitive/alpha.js';
import { date } from './primitive/date.js';
import { fileExtension } from './file/extension.js';
import { email } from './comms/email.js';
import { url } from './comms/url.js';
import { mobileEs } from './comms/mobileEs.js';
import { landlineEs } from './comms/landlineEs.js';
import { telephoneEs } from './comms/telephoneEs.js';
import { postalCodeEs } from './comms/postalCodeEs.js';
import { iccid } from './comms/iccid.js';
import { nif } from './es/nif.js';
import { nie } from './es/nie.js';
import { cif } from './es/cif.js';
import { bankAccountEs } from './es/bankAccountEs.js';
import { creditCard } from './banking/creditCard.js';

/**
 * Dispatch table. All keys are lowercase; lookup via {@link validate} is
 * case-insensitive.
 * @type {Readonly<Record<string, (value: unknown, ...rest: any[]) => boolean>>}
 */
export const validators = Object.freeze({
  // Primitive
  int: integer,
  integer,
  float,
  number,
  numero: number,
  alpha,
  alfa: alpha,
  text: alpha,
  texto: alpha,
  'text-': alphaWithDash,
  alphawithdash: alphaWithDash,
  alphanumeric,
  textnum: alphanumeric,
  alphanumericspace: alphanumericWithSpace,
  alphanumericwithspace: alphanumericWithSpace,
  textspace: alphanumericWithSpace,
  date,
  fecha: date,
  // File
  file: fileExtension,
  fileextension: fileExtension,
  // Communications
  email,
  correo: email,
  url,
  iccid,
  mobile: mobileEs,
  movil: mobileEs,
  nummovil: mobileEs,
  mobilees: mobileEs,
  landphone: landlineEs,
  fijo: landlineEs,
  numfijo: landlineEs,
  landlinees: landlineEs,
  tel: telephoneEs,
  telefono: telephoneEs,
  telephone: telephoneEs,
  telephonees: telephoneEs,
  cp: postalCodeEs,
  postalcode: postalCodeEs,
  postalcodees: postalCodeEs,
  // Spanish documents
  nif,
  nie,
  cif,
  cuentabancaria: bankAccountEs,
  accountnumber: bankAccountEs,
  bankaccountes: bankAccountEs,
  // Banking
  creditcard: creditCard,
  tarjetacredito: creditCard,
});

/**
 * Look up a validator by name (case-insensitive) and return a curried
 * predicate. Returns `null` if the name is unknown.
 * @example
 *   const isMobile = validate('mobileEs');
 *   isMobile('600 000 000'); // → true
 * @param {string} name
 * @returns {((value: unknown, ...rest: any[]) => boolean) | null}
 */
export function validate(name) {
  if (typeof name !== 'string') return null;
  const fn = validators[name.toLowerCase()];
  return typeof fn === 'function' ? fn : null;
}
