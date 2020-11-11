export class VerifyUtils {
  static isInt(val) {
    return (val === parseInt(val, 10));
  }

  static isFloat(val) {
    return (val === parseFloat(val));
  }

  static isNumber(val) {
    const regexp = /^[0-9.]+$/;
    return regexp.test(val);
  }

  static isEmail(email) {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,4})+$/.test(email);
  }

  static verificaCuentaBancaria(numcuenta) {
    const parte1 = `00${numcuenta.substr(0, 8)}`;
    const control = numcuenta.substr(8, 2);
    const parte2 = numcuenta.substr(10);
    const pesos = [1, 2, 4, 8, 5, 10, 9, 7, 3, 6];
    let d1 = 0;
    let d2 = 0;
    for (let i = 0; i <= 9; i += 1) { d1 += parseInt(parte1.charAt(i), 10) * pesos[i]; }
    d1 = 11 - (d1 % 11);
    if (d1 === 11) { d1 = 0; }
    if (d1 === 10) { d1 = 1; }
    for (let i = 0; i <= 9; i += 1) { d2 += parseInt(parte2.charAt(i), 10) * pesos[i]; }
    d2 = 11 - (d2 % 11);
    if (d2 === 11) { d2 = 0; }
    if (d2 === 10) { d2 = 1; }
    return ((d1.toString() + d2.toString()) === control);
  }

  static verificaNumTarjetaCredito(numtarjeta) {
    let result = false;
    const firstDigitCorrect = [3, 4, 5, 6].includes(numtarjeta[0]);
    if (numtarjeta.length === 16 && firstDigitCorrect) {
      result = VerifyUtils._getCtrlNumberCreditCard(numtarjeta) === numtarjeta[15];
    }
    return result;
  }

  static _getCtrlNumberCreditCard(numtarjeta) {
    let suma = 0; let x; let
      y;
    for (x = 1; x < 16; x += 1) {
      if (x / 2 !== parseInt(x / 2, 10)) {
        y = parseInt(numtarjeta[x - 1], 10) * 2;
        if (y >= 10) {
          y -= 9;
        }
      } else {
        y = parseInt(numtarjeta[x - 1], 10);
      }
      suma += y;
    }
    suma = 10 - (suma % 10);
    if (suma === 10) {
      suma = 0;
    }
    return suma;
  }

  static isAlpha(val) {
    const regexp = /^[A-Za-z\s\xF1\xD1áéíóúÁÉÍÓÚäëïöüAËÏÖÜÑñçÇ']+$/;
    const a = regexp.test(val);
    return a;
  }

  static isAlphaGuion(val) {
    const regexp = /^[A-Za-z\s\xF1\xD1áéíóúÁÉÍÓÚäëïöüAËÏÖÜÑñçÇ'-]+$/;
    const a = regexp.test(val);
    return a;
  }

  static isAlphaNumeric(val) {
    const regexp = /^[0-9A-Za-záéíóúÁÉÍÓÚäëïöüAËÏÖÜÑñçÇ']+$/;
    const a = regexp.test(val);
    return a;
  }

  static isAlphaNumericSpace(val) {
    const regexp = /^[0-9A-Za-z\s\xF1\xD1áéíóúÁÉÍÓÚäëïöüAËÏÖÜÑñçÇ']+$/;
    const a = regexp.test(val);
    return a;
  }

  static isDate(txtDate, mode) {
    const currVal = txtDate;
    if (currVal === '') { return false; }
    // Declare Regex
    const rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
    const dtArray = currVal.match(rxDatePattern); // is format OK?
    if (dtArray === null) { return false; }
    // Checks for dd/mm/yyyy format.
    let dtMonth;
    let dtDay;
    let dtYear;
    switch (mode) {
      case 'mdy':
        [, dtMonth,, dtDay,, dtYear] = dtArray;
        break;
      case 'ymd':
        [, dtYear,,,, dtMonth,, dtDay] = dtArray;
        break;
      default: // dmy
        [, dtDay,, dtMonth,, dtYear] = dtArray;
        break;
    }
    if (dtMonth < 1 || dtMonth > 12) { return false; }
    if (dtDay < 1 || dtDay > 31) { return false; }
    if ([4, 6, 9, 11].includes(dtMonth) && dtDay === 31) {
      return false;
    }
    if (dtMonth === 2) {
      const isleap = (dtYear % 4 === 0 && (dtYear % 100 !== 0 || dtYear % 400 === 0));
      if (dtDay > 29 || (dtDay === 29 && !isleap)) { return false; }
    }
    return true;
  }

  static checkNumMovil(val) {
    const patron = /^(\+?[0-9]{2}|00[0-9]{2}|[0-9]{2})?[ -]*(6|7)[0-9]{8}$/;
    const regExp = new RegExp(patron);
    return (regExp.test(val));
  }

  static checkNumFijo(val) {
    const patron = /^(\+?[0-9]{2}|00[0-9]{2}|[0-9]{2})?[ -]*[0-9]{9}$/;
    const regExp = new RegExp(patron);
    return (regExp.test(val));
  }

  static checkTelephoneNumber(val) {
    return (VerifyUtils.checkNumFijo(val) || VerifyUtils.checkNumMovil(val));
  }

  static checkCodPostal(val) {
    return (val.length === 5 && VerifyUtils.isInt(val));
  }

  static checkICCID(Luhn) {
    const LuhnDigit = parseInt(Luhn.substring(Luhn.length - 1, Luhn.length), 10);
    const LuhnLess = Luhn.substring(0, Luhn.length - 1);
    if (Luhn.substring(0, 2) !== '89') { return 0; }
    if (VerifyUtils._CalculateLuhn(LuhnLess) === parseInt(LuhnDigit, 10)) {
      if (Luhn.length === 19 || Luhn.length === 20) {
        return 1;
      }
      return 0;
    }
    return 0;
  }

  static _CalculateLuhn(Luhn) {
    let sum = 0;
    for (let i = 0; i < Luhn.length; i += 1) {
      sum += parseInt(Luhn.substring(i, i + 1), 10);
    }
    const delta = [0, 1, 2, 3, 4, -4, -3, -2, -1, 0];
    for (let i = Luhn.length - 1; i >= 0; i -= 2) {
      const deltaIndex = parseInt(Luhn.substring(i, i + 1), 10);
      const deltaValue = delta[deltaIndex];
      sum += deltaValue;
    }
    let mod10 = sum % 10;
    mod10 = 10 - mod10;
    if (mod10 === 10) {
      mod10 = 0;
    }
    return mod10;
  }

  static calcDigitoControl2LineaNIF(s) {
    const m = [7, 3, 1];
    let n = 0;
    const l = s.length;
    for (let i = 0; i < l; i += 1) {
      n += s[i] * m[i % 3];
    }
    return n % 10;
  }

  static _getLetraNIF(dni) {
    const cadenadni = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const posicion = dni % 23;
    const letra = cadenadni.charAt(posicion);
    return letra;
  }

  static validaNifCifNie(a) {
    let temp = a.toUpperCase(); let temp1; let temp2; let i; let n; let pos;
    const cadenadni = 'TRWAGMYFPDXBNJZSQVHLCKE'; let posicion; let letra; let letradni; let
      suma;
    if (document.getElementById('documento_de_identidad').getAttribute('value') === 'PASAPORTE') { return 1; }
    if (temp !== '') {
      // ANTES DE - _ \s  !/^[A-Z]{1}[\s-_]?[0-9]{7}[\s-_]?[A-Z0-9]{1}$/
      if ((!/^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$/.test(temp) && !/^[T]{1}[A-Z0-9]{8}$/.test(temp)) && !/^[0-9]{8}[A-Z]{1}$/.test(temp)) {
        return 0; // si no tiene un formato valido devuelve error
      }
      // comprobacion de NIFs estandar
      if (/^[0-9]{8}[A-Z]{1}$/.test(temp)) {
        posicion = a.substring(8, 0) % 23;
        letra = cadenadni.charAt(posicion);
        letradni = temp.charAt(8);
        if (letra === letradni) { return 1; }
        return -1;
      }
      // algoritmo para comprobacion de codigos tipo CIF
      suma = parseInt(a.charAt(2), 10) + parseInt(a.charAt(4), 10) + parseInt(a.charAt(6), 10);
      for (i = 1; i < 8; i += 2) {
        temp1 = 2 * parseInt(a.charAt(i), 10);
        temp1 += '';
        temp1 = temp1.substring(0, 1);
        temp2 = 2 * parseInt(a.charAt(i), 10);
        temp2 += '';
        temp2 = temp2.substring(1, 2);
        if (temp2 === '') { temp2 = '0'; }
        suma += (parseInt(temp1, 10) + parseInt(temp2, 10));
      }
      suma += '';
      n = 10 - parseInt(suma.substring(suma.length - 1, suma.length), 10);
      // comprobacion de NIFs especiales (se calculan como CIFs)
      if (/^[KLM]{1}/.test(temp)) {
        if (a.charAt(8) === String.fromCharCode(64 + n)) { return 1; }
        return -1;
      }
      // comprobacion de CIFs
      if (/^[ABCDEFGHJNPQRSUVW]{1}/.test(temp)) {
        temp = `${n}`;
        if (a.charAt(8) === String.fromCharCode(64 + n)
            || a.charAt(8) === parseInt(temp.substring(temp.length - 1, temp.length), 10)) {
          return 2;
        }
        return -2;
      }
      // comprobacion de NIEs
      // T
      if (/^[T]{1}[A-Z0-9]{8}$/.test(temp)) {
        if (a.charAt(8) === /^[T]{1}[A-Z0-9]{8}$/.test(temp)) { return 3; }
        return -3;
      }
      // XYZ
      if (/^[XYZ]{1}/.test(temp)) {
        temp = temp.replace('X', '0');
        temp = temp.replace('Y', '1');
        temp = temp.replace('Z', '2');
        pos = temp.substring(0, 8) % 23;
        if (a.toUpperCase().charAt(8) === cadenadni.substring(pos, pos + 1)) { return 3; }
        return -3;
      }
    }
    return 0;
  }
}
