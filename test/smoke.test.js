import { describe, it, expect, beforeEach } from 'vitest';
import { VerifyUtils } from '../VerifyUtils.js';
import { ValidateForm } from '../ValidateForm.js';

beforeEach(() => {
  document.body.innerHTML = '<input id="documento_de_identidad" value="DNI" />';
});

describe('smoke', () => {
  it('VerifyUtils exposes validaNifCifNie as a function', () => {
    expect(typeof VerifyUtils.validaNifCifNie).toBe('function');
  });

  it('ValidateForm is importable and instantiable', () => {
    const vf = new ValidateForm(() => true);
    expect(vf).toBeInstanceOf(ValidateForm);
    expect(vf.validationTypeFunctions).toBeTypeOf('object');
    expect(typeof vf.validationTypeFunctions.email).toBe('function');
  });

  it('jsdom environment provides a document', () => {
    expect(typeof document).toBe('object');
    expect(document.getElementById('documento_de_identidad')).not.toBeNull();
  });
});
