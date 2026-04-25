// Dispatch table mapping every public alias (matching the legacy
// `data-tovalidate` values from automatic_form_validation, plus our new
// canonical names) to the corresponding validator function. Keys are
// case-insensitive when looked up via `validate()`.

import { integer, normalizeInteger } from './primitive/integer.js';
import { float, normalizeFloat } from './primitive/float.js';
import { number, normalizeNumber } from './primitive/number.js';
import {
  alpha,
  alphaWithDash,
  alphanumeric,
  alphanumericWithSpace,
  normalizeAlpha,
  normalizeAlphaWithDash,
  normalizeAlphanumeric,
  normalizeAlphanumericWithSpace,
} from './primitive/alpha.js';
import { date, normalizeDate } from './primitive/date.js';
import { fileExtension, normalizeFileExtension } from './file/extension.js';
import { email, normalizeEmail } from './comms/email.js';
import { url, normalizeUrl } from './comms/url.js';
import { mobileEs, normalizeMobileEs } from './comms/mobileEs.js';
import { landlineEs, normalizeLandlineEs } from './comms/landlineEs.js';
import { telephoneEs, normalizeTelephoneEs } from './comms/telephoneEs.js';
import { postalCodeEs, normalizePostalCodeEs } from './comms/postalCodeEs.js';
import { iccid, normalizeIccid } from './comms/iccid.js';
import { nif, normalizeNif } from './es/nif.js';
import { nie, normalizeNie } from './es/nie.js';
import { cif, normalizeCif } from './es/cif.js';
import { bankAccountEs, normalizeBankAccountEs } from './es/bankAccountEs.js';
import { creditCard, normalizeCreditCard } from './banking/creditCard.js';

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

/**
 * Normalizers dispatch table. Mirrors {@link validators} key-by-key, so
 * every alias accepted by `validate(name)` also has a `normalize(name)`.
 * @type {Readonly<Record<string, (value: unknown, ...rest: any[]) => string>>}
 */
export const normalizers = Object.freeze({
  // Primitive
  int: normalizeInteger,
  integer: normalizeInteger,
  float: normalizeFloat,
  number: normalizeNumber,
  numero: normalizeNumber,
  alpha: normalizeAlpha,
  alfa: normalizeAlpha,
  text: normalizeAlpha,
  texto: normalizeAlpha,
  'text-': normalizeAlphaWithDash,
  alphawithdash: normalizeAlphaWithDash,
  alphanumeric: normalizeAlphanumeric,
  textnum: normalizeAlphanumeric,
  alphanumericspace: normalizeAlphanumericWithSpace,
  alphanumericwithspace: normalizeAlphanumericWithSpace,
  textspace: normalizeAlphanumericWithSpace,
  date: normalizeDate,
  fecha: normalizeDate,
  // File
  file: normalizeFileExtension,
  fileextension: normalizeFileExtension,
  // Communications
  email: normalizeEmail,
  correo: normalizeEmail,
  url: normalizeUrl,
  iccid: normalizeIccid,
  mobile: normalizeMobileEs,
  movil: normalizeMobileEs,
  nummovil: normalizeMobileEs,
  mobilees: normalizeMobileEs,
  landphone: normalizeLandlineEs,
  fijo: normalizeLandlineEs,
  numfijo: normalizeLandlineEs,
  landlinees: normalizeLandlineEs,
  tel: normalizeTelephoneEs,
  telefono: normalizeTelephoneEs,
  telephone: normalizeTelephoneEs,
  telephonees: normalizeTelephoneEs,
  cp: normalizePostalCodeEs,
  postalcode: normalizePostalCodeEs,
  postalcodees: normalizePostalCodeEs,
  // Spanish documents
  nif: normalizeNif,
  nie: normalizeNie,
  cif: normalizeCif,
  cuentabancaria: normalizeBankAccountEs,
  accountnumber: normalizeBankAccountEs,
  bankaccountes: normalizeBankAccountEs,
  // Banking
  creditcard: normalizeCreditCard,
  tarjetacredito: normalizeCreditCard,
});

/**
 * Look up a normalizer by name (case-insensitive). When the name is
 * unknown, returns a fallback that just trims strings (so consumers can
 * always call `normalize(name)(value)` safely without checking for null).
 * @example
 *   const cleanEmail = normalize('email');
 *   cleanEmail(' Manu@X.IO '); // → 'manu@x.io'
 * @param {string} name
 * @returns {(value: unknown, ...rest: any[]) => string}
 */
export function normalize(name) {
  if (typeof name === 'string') {
    const fn = normalizers[name.toLowerCase()];
    if (typeof fn === 'function') return fn;
  }
  return (value) => (typeof value === 'string' ? value.trim() : String(value ?? ''));
}
