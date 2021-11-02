/* ValidateForm.js by @manufosela - 2015 - 2021 */
import { VerifyUtils } from './VerifyUtils.js';

export class ValidateForm {
  constructor(submitCallback, confOpt = {}) {
    this.submitCallback = submitCallback || this._submitCallback;

    this.warningColor = confOpt.warningColor || '#F00';
    this.asteriskStyle = confOpt.asteriskStyle || `color: ${this.warningColor}!important; font-size: 15px!important; padding-left:3px;`;
    this.cssTextWarning = confOpt.cssTextWarning || `color:${this.warningColor}!important; margin:0;`;
    this.cssElementWarning = confOpt.cssElementWarning || `border:2px solid ${this.warningColor}!important;`;
    this.requiredTextContent = confOpt.requiredTextContent || '*';
    this.scope = confOpt.scope || document;

    this.numWarnings = 0;
    this.texts = {
      requiredField: 'campo requerido',
      wrongValue: 'valor incorrecto',
    };

    this.badValue = 0;
    this.formsToValidate = [...this.scope.querySelectorAll('form[data-validate=true]')];
    this.submitElementsToCheck = null;
    this.okFieldsNoEmpty = false;
    this.okFieldsValidated = false;

    this.validationTypeFunctions = {
      int: VerifyUtils.isInt,
      integer: VerifyUtils.isInt,
      float: VerifyUtils.isFloat,
      number: VerifyUtils.isNumber,
      numero: VerifyUtils.isNumber,
      alpha: VerifyUtils.isAlpha,
      alfa: VerifyUtils.isAlpha,
      text: VerifyUtils.isAlpha,
      texto: VerifyUtils.isAlpha,
      'text-': VerifyUtils.isAlphaGuion,
      alphaNumericSpace: VerifyUtils.isAlphaNumericSpace,
      textspace: VerifyUtils.isAlphaNumericSpace,
      alphaNumeric: VerifyUtils.isAlphaNumeric,
      textnum: VerifyUtils.isAlphaNumeric,
      email: VerifyUtils.isEmail,
      correo: VerifyUtils.isEmail,
      iccid: VerifyUtils.checkICCID,
      nummovil: VerifyUtils.checkNumMovil,
      movil: VerifyUtils.checkNumMovil,
      mobile: VerifyUtils.checkNumMovil,
      numfijo: VerifyUtils.checkNumFijo,
      fijo: VerifyUtils.checkNumFijo,
      landphone: VerifyUtils.checkNumFijo,
      telefono: VerifyUtils.checkTelephoneNumber,
      tel: VerifyUtils.checkTelephoneNumber,
      telephone: VerifyUtils.checkTelephoneNumber,
      cp: VerifyUtils.checkCodPostal,
      postalcode: VerifyUtils.checkCodPostal,
      cuentabancaria: VerifyUtils.verificaCuentaBancaria,
      accountnumber: VerifyUtils.verificaCuentaBancaria,
      tarjetacredito: VerifyUtils.verificaNumTarjetaCredito,
      creditcard: VerifyUtils.verificaNumTarjetaCredito,
      nif: VerifyUtils.valida_nif_cif_nie,
      cif: VerifyUtils.valida_nif_cif_nie,
      nie: VerifyUtils.valida_nif_cif_nie,
      fecha: VerifyUtils.isDate,
      date: VerifyUtils.isDate,
    };

    this.checkFieldsToValidate();

    if (this.scope.querySelector('#valiformStyles') === null) {
      const style = document.createElement('style');
      style.setAttribute('id', 'valiformStyles');
      style.setAttribute('type', 'text/css');
      style.innerHTML = '.isHidden{ display:none; }';
      document.getElementsByTagName('head')[0].appendChild(style);
    }
  }

  _checkSubmitElements(formToValidate) {
    const elementId = formToValidate.getAttribute('id');
    const submitElementsToCheck = this.scope.querySelectorAll(`#${elementId} [type=submit][data-checkform=true]`);
    submitElementsToCheck.forEach((submitElementToCheck) => {
      const submitBtn = submitElementToCheck;
      submitBtn.formParam = formToValidate;
      submitBtn.addEventListener('click', this._beforeSubmit.bind(this), false);
    });
  }

  checkFieldsToValidate() {
    this.formsToValidate.forEach((formToValidate) => {
      this.markRequiredFields(formToValidate);
      if (formToValidate.dataset.checkrealtime === 'true') {
        this.addEventsToCheckFieldsWhenBlur(formToValidate);
      }
      this._hiddenFieldsActions(formToValidate);
      this._checkSubmitElements(formToValidate);
    });
  }

  _beforeSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    this.okFieldsNoEmpty = this.noEmptyFields();
    this.okFieldsValidated = this.validateFields();
    if (this.okFieldsValidated && this.okFieldsNoEmpty) {
      this.submitCallback(e);
    }
    return false;
  }

  _submitCallback(e) {
    this._null = null;
    const { target } = e;
    target.formParam.submit();
    return false;
  }

  activateValidation() {
    this.formsToValidate = [...this.scope.querySelectorAll('form[data-validate=true]')];
    this.checkFieldsToValidate();
  }

  validate(val, type) {
    if (val === '' || val === null || (val !== '' && type === 'noempty')) { return true; }
    if (type === 'selected' || type === 'noempty') { return (val !== ''); }
    if (type.substr(0, 3) === 'fn:') {
      const fn = window[type.substr(3)];
      if (typeof fn === 'function') {
        return fn(val);
      }
    }
    return (this.validationTypeFunctions[type]) ? this.validationTypeFunctions[type](val) : false;
  }

  _drawAsterisk(el) {
    const idAst = el.getAttribute('name');
    if (this.scope.querySelector(`#asterisco_${idAst}`) === null) {
      const asterisco = document.createElement('span');
      asterisco.setAttribute('id', `asterisco_${idAst}`);
      asterisco.setAttribute('style', this.asteriskStyle);
      asterisco.innerHTML = this.requiredTextContent;
      if (this.scope.querySelector(`#label_${idAst}`) !== null) {
        this.scope.querySelector(`#label_${idAst}`).appendChild(asterisco);
      } else {
        const sb = el.parentElement.querySelectorAll('label');
        if (sb.length > 0) {
          sb[0].appendChild(asterisco);
        } else {
          el.parentNode.appendChild(asterisco);
        }
      }
    }
  }

  // Put a span with a * in form fields with attribute data-required=true
  // Is mandatory to have a label tag to append span tag into the label tag
  markRequiredFields(formElement) {
    if (typeof formElement !== 'undefined') {
      const formElementId = formElement.getAttribute('id');
      const requiredElements = [...this.scope.querySelectorAll(`#${formElementId} [data-required=true]`)];
      requiredElements.forEach((el) => {
        const typ = el.getAttribute('type') || el.type;
        if (typ !== 'hidden' && el.getAttribute('data-hidden') !== 'true') {
          this._drawAsterisk(el);
        }
      });
    }
  }

  validateFields() {
    this.badValue = 0;
    const requiredElements = [...this.scope.querySelectorAll('[data-tovalidate]')];
    requiredElements.forEach((el) => {
      const val = el.value || '';
      const type = el.dataset.tovalidate || '';
      if (!this.validate(val, type)) {
        this.addWarnMesg(el, this.texts.wrongValue);
        this.badValue += 1;
      }
    });
    return (this.badValue === 0);
  }

  noEmptyFields() {
    let empty = 0;
    const requiredElements = [...this.scope.querySelectorAll('[data-required=true]')];
    requiredElements.forEach((el) => {
      const typ = el.getAttribute('type') || el.type;
      if (typ !== 'hidden' && el.getAttribute('data-hidden') !== 'true' && el.getAttribute('data-type') !== 'hiddenON') {
        const val = el.value || '';
        const typeF = el.getAttribute('type') || el.type || '';
        if (typeF === 'radio') {
          empty += this.checkRadioField(el);
        } else if (typeF === 'checkbox') {
          if (!el.checked) {
            this.addWarnMesg(el, this.texts.requiredField);
            empty += 1;
          } else {
            this.delWarnMesg(el);
          }
        } else if (el.dataset.type === 'checkbox-group') {
          const checkboxes = [...el.parentNode.querySelectorAll('input[type="checkbox"]')];
          const maxChecked = el.dataset.max || checkboxes.length;
          const minChecked = el.dataset.min || 1;
          let counterChecked = 0;
          checkboxes.forEach((checkbox) => {
            counterChecked += (checkbox.checked) ? 1 : 0;
          });
          if (counterChecked > maxChecked || counterChecked < minChecked) {
            empty += 1;
            const errorMsg = el.dataset.errorMsg || 'El número de checkbox marcado es incorrecto';
            this.addWarnMesg(el, errorMsg);
          } else {
            this.delWarnMesg(el);
          }
        } else if (val === '') {
          this.addWarnMesg(el, this.texts.requiredField);
          empty += 1;
        } else {
          this.delWarnMesg(el);
        }
      }
    });
    return (empty === 0);
  }

  checkRadioField(el) {
    let empty = 0;
    let atLeastOne = 0;
    const nameF = el.getAttribute('name');
    const formE = this._getParentElement(el, 'form');
    const idFormE = formE.getAttribute('id');
    const pEl = this.scope.querySelector(`[data-name=${nameF}]`) || el;
    const radF = [...this.scope.querySelectorAll(`#${idFormE} [name=${nameF}]`)];
    radF.forEach((radFEl) => {
      if (radFEl.checked) { atLeastOne += 1; }
    });
    if (atLeastOne === 0) {
      this.addWarnMesg(pEl, this.texts.requiredField);
      empty += 1;
    } else {
      this.delWarnMesg(pEl);
    }
    return empty;
  }

  addWarnMesg(_el, msg) {
    let el = _el;
    let warning;
    const target = (typeof el.getAttribute !== 'undefined') ? el : window.event.target;
    const name = target.getAttribute('name') || target.getAttribute('id') || '';
    const id = `warning-${name}`;
    if (!this.scope.querySelector(`#${id}`)) {
      el = this.scope.querySelector(`#${target.getAttribute('id')}` || el.id);
      warning = document.createElement('p');
      warning.setAttribute('id', id);
    } else {
      warning = this.scope.querySelector(`#${id}`);
    }
    warning.setAttribute('style', this.cssTextWarning);
    warning.innerHTML = msg;
    el.parentElement.appendChild(warning);
    el.setAttribute('style', this.cssElementWarning);
    this.numWarnings += 1;
    if (this.numWarnings === 1) {
      const elementPos = el.getBoundingClientRect();
      const bodyPos = document.body.getBoundingClientRect();
      window.scrollTo(bodyPos.top, elementPos.top);
    }
  }

  delWarnMesg(el) {
    const target = (typeof el.getAttribute !== 'undefined') ? el : window.event.target;
    const name = target.getAttribute('name') || target.getAttribute('id') || '';
    if (this.scope.querySelector(`#warning-${name}`)) {
      target.parentElement.removeChild(this.scope.querySelector(`#warning-${name}`));
    }
    this.removeStyle(el);
    if (this.numWarnings > 0) { this.numWarnings -= 1; }
  }

  removeStyle(el) {
    this._null = null;
    const target = (typeof el.getAttribute !== 'undefined') ? el : window.event.target;
    target.removeAttribute('style');
  }

  addEventsToCheckFieldsWhenBlur(form) {
    const fields = [...form.getElementsByTagName('input'), ...form.getElementsByTagName('textarea')];
    const selectF = [...form.getElementsByTagName('select')];
    fields.forEach((field) => {
      const el = this.scope.querySelector(`#${field.getAttribute('id')}`);
      const validateIsRequired = el.dataset.required || false;
      const validateType = el.dataset.tovalidate || false;
      const typeF = el.getAttribute('type') || el.type || '';
      if (validateIsRequired === 'true' || validateType !== '') {
        el.removeEventListener('blur', this._onBlur.bind(this), false);
        el.addEventListener('blur', this._onBlur.bind(this), false);
        if (typeF === 'checkbox' || typeF === 'radio') {
          el.removeEventListener('click', this._onBlur.bind(this), false);
          el.addEventListener('click', this._onBlur.bind(this), false);
        }
      }
    });
    selectF.forEach((select) => {
      const el = this.scope.querySelector(`#${select.getAttribute('id')}`);
      const validateIsRequired = el.getAttribute('data-required');
      if (validateIsRequired === 'true') {
        el.addEventListener('click', this._onSel.bind(this), false);
        el.addEventListener('change', this._onSel.bind(this), false);
        el.addEventListener('blur', this._onSel.bind(this), false);
      }
    });
  }

  _hiddenFieldsActions() {
    const toActivate = [...this.scope.querySelectorAll('[data-activate]')];
    toActivate.forEach((elToActivate) => {
      elToActivate.classList.add('isHidden'); // Todos los elementos que tengan el atributo data-activate deben estar display:none
      const dataActivateValue = elToActivate.getAttribute('data-activate');
      const elAc = this.scope.querySelector(`#${dataActivateValue}`);
      if (elAc) {
        const nameAc = elAc.getAttribute('name');
        const parentEl = this._getParentElement(elToActivate, 'form');
        const parentElId = parentEl.getAttribute('id');
        const elAcs = [...this.scope.querySelectorAll(`#${parentElId} [name=${nameAc}]`)];
        elAcs.forEach((elAcEl) => {
          elAcEl.addEventListener('blur', this._showHidden.bind(this), false);
          elAcEl.addEventListener('click', this._showHidden.bind(this), false);
        });
      }
    });
  }

  _onBlur(e) {
    const { target } = e;
    const val = target.value || '';
    const type = target.dataset.tovalidate || '';
    const validateType = Boolean(type);
    const validateIsRequired = Boolean(target.dataset.required);
    const typeF = target.getAttribute('type') || '';
    let validField = false;
    if (validateIsRequired) {
      if (typeF === 'radio') {
        this.checkRadioField(target);
      } else if (typeF === 'checkbox') {
        if (!target.checked) {
          this.addWarnMesg(target, this.texts.requiredField);
        }
        this.delWarnMesg(target);
      } else if (val === '') {
        this.addWarnMesg(target, this.texts.requiredField);
      } else {
        this.delWarnMesg(target);
        validField = true;
      }
    }
    if (validField && validateType) {
      validField = this.validate(val, type);
      if (validField) {
        this.delWarnMesg(target);
      } else {
        this.badValue += 1;
        this.addWarnMesg(target, this.texts.wrongValue);
      }
    }
    return validField;
  }

  _onSel(e) {
    const { target } = e;
    const val = target.value || '';
    if (val === '') {
      this.addWarnMesg(target, this.texts.requiredField);
    }
    this.delWarnMesg(target);
    return true;
  }

  _showHidden(e) {
    this._null = null;
    const { target } = e;
    const id = target.getAttribute('id') || '';
    const toActivate = [...this.scope.querySelectorAll(`[data-activate*=${id}]`)];
    const toDeactivate = [...this.scope.querySelectorAll(`[data-deactivate*=${id}]`)];
    toActivate.forEach((toActivateEl) => {
      const inHid = toActivateEl.querySelectorAll('input[data-type="hiddenON"]');
      toActivateEl.classList.remove('isHidden');
      inHid.forEach((inHidEl) => {
        const el = inHidEl;
        el.dataset.type = 'hiddenOFF';
      });
    });
    toDeactivate.forEach((toDeactivateEl) => {
      const inHid = toDeactivateEl.querySelectorAll('input[data-type="hiddenOFF]');
      toDeactivateEl.classList.add('isHidden');
      inHid.forEach((inHidEl) => {
        const el = inHidEl;
        el.dataset.type = 'hiddenON';
        const typEl = inHidEl.getAttribute('type') || inHidEl.type;
        const parEl = inHidEl.parentElement;
        const tagEl = parEl.tagName.toUpperCase() || '';
        if (tagEl === 'LABEL') {
          if (typEl === 'radio') { parEl.classList.remove('r_on'); }
          if (typEl === 'checkbox') { parEl.classList.remove('c_on'); }
        }
      });
    });
  }

  _getParentElement(el, _tagname) {
    this._null = null;
    const tagname = _tagname.toUpperCase();
    let parentE = el;
    do {
      parentE = parentE.parentElement;
    } while (parentE !== null && parentE.tagName.toUpperCase() !== tagname);
    return parentE;
  }
}
