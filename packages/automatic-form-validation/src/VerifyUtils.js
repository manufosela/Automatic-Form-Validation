// VerifyUtils.js — backwards-compat shim for v1.x consumers.
//
// As of v1.7.0 the validation catalogue lives in `@manufosela/form-validators`
// (MIT, pure predicates, zero DOM access). This class re-exports those
// predicates under their legacy method names so existing `VerifyUtils.X(value)`
// calls keep working.
//
// SEMANTIC CHANGES vs v1.6.x — see CHANGELOG.md:
//   - `isInt(value)` and `isFloat(value)` now accept numeric strings (the
//     legacy `value === parseInt(value)` check always returned false for
//     strings, which meant `data-tovalidate="int"` never actually worked
//     against DOM input values). The new behaviour matches what the
//     library always advertised.
//   - `validaNifCifNie(value)` is pure: the historical DOM lookup of a
//     `#documento_de_identidad` input (returning 1 for PASAPORTE) has been
//     removed. Form code that relies on the PASAPORTE bypass must now
//     handle that condition outside the validator.

import {
  integer,
  float,
  number,
  alpha,
  alphaWithDash,
  alphanumeric,
  alphanumericWithSpace,
  date,
  fileExtension,
  email,
  url,
  mobileEs,
  landlineEs,
  telephoneEs,
  postalCodeEs,
  iccid,
  nif,
  nie,
  cif,
  bankAccountEs,
  creditCard,
} from '@manufosela/form-validators';

export class VerifyUtils {
  static isInt(val) {
    return integer(val);
  }
  static isFloat(val) {
    return float(val);
  }
  static isNumber(val) {
    return number(val);
  }
  static isEmail(val) {
    return email(val);
  }
  static isUrl(val) {
    return url(val);
  }
  static isAlpha(val) {
    return alpha(val);
  }
  static isAlphaGuion(val) {
    return alphaWithDash(val);
  }
  static isAlphaNumeric(val) {
    return alphanumeric(val);
  }
  static isAlphaNumericSpace(val) {
    return alphanumericWithSpace(val);
  }
  static isDate(val, mode) {
    return date(val, mode);
  }
  static isFile(filename, validExtensions) {
    return fileExtension(filename, validExtensions);
  }
  static checkNumMovil(val) {
    return mobileEs(val);
  }
  static checkNumFijo(val) {
    return landlineEs(val);
  }
  static checkTelephoneNumber(val) {
    return telephoneEs(val);
  }
  static checkCodPostal(val) {
    return postalCodeEs(val);
  }
  static checkICCID(val) {
    return iccid(val) ? 1 : 0;
  }
  static verificaCuentaBancaria(val) {
    return bankAccountEs(val);
  }
  static verificaNumTarjetaCredito(val) {
    return creditCard(val);
  }

  /**
   * Compute the control letter for an 8-digit DNI body. Kept for API
   * backwards compatibility with consumers that imported this helper.
   * @param {number} dni
   * @returns {string}
   */
  static _getLetraNIF(dni) {
    return 'TRWAGMYFPDXBNJZSQVHLCKE'.charAt(dni % 23);
  }

  /**
   * Validate a Spanish NIF/CIF/NIE and return a coded result:
   *   - `1`  valid NIF (standard or KLM)
   *   - `2`  valid CIF
   *   - `3`  valid NIE (T-prefix or XYZ)
   *   - `-1` NIF with wrong control letter
   *   - `-2` CIF with wrong control character
   *   - `-3` NIE (XYZ) with wrong control letter
   *   - `0`  empty input or unrecognised shape
   *
   * Pure — no DOM access. The PASAPORTE special-case from v1.6.x was
   * removed; consumers that need it should branch outside this call.
   * @param {unknown} value
   * @returns {number}
   */
  static validaNifCifNie(value) {
    if (typeof value !== 'string' || value === '') return 0;
    const v = value.toUpperCase();
    if (
      !/^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$/.test(v) &&
      !/^T[A-Z0-9]{8}$/.test(v) &&
      !/^[0-9]{8}[A-Z]{1}$/.test(v)
    ) {
      return 0;
    }
    if (/^\d{8}[A-Z]$/.test(v)) {
      return nif(v) ? 1 : -1;
    }
    if (/^[KLM]\d{7}[A-Z]$/.test(v)) {
      return nif(v) ? 1 : -1;
    }
    if (/^[ABCDEFGHJNPQRSUVW]\d{7}[A-Z0-9]$/.test(v)) {
      return cif(v) ? 2 : -2;
    }
    if (/^T[A-Z0-9]{8}$/.test(v)) {
      return 3;
    }
    if (/^[XYZ]\d{7}[A-Z]$/.test(v)) {
      return nie(v) ? 3 : -3;
    }
    return 0;
  }
}
