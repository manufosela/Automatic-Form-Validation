import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ValidateForm } from '../ValidateForm.js';

beforeEach(() => {
  document.body.innerHTML = `
    <input id="documento_de_identidad" value="DNI" />
    <form id="f" data-validate="true">
      <input id="num" name="num" type="number" data-tovalidate="fn:myEven" />
      <input id="txt" name="txt" type="text" data-tovalidate="fn:ghost" />
    </form>
  `;
});

describe('ValidateForm.addWarnMesg XSS safety (AFV-TSK-0002)', () => {
  it('renders script payloads as plain text, never executing them', () => {
    const vf = new ValidateForm(() => true);
    const target = document.getElementById('num');
    const payload = '<script>window.__xss = true;</script>';

    vf.addWarnMesg(target, payload);

    const warning = document.getElementById('warning-num');
    expect(warning).not.toBeNull();
    expect(warning.textContent).toBe(payload);
    expect(warning.querySelector('script')).toBeNull();
    expect(globalThis.__xss).toBeUndefined();
  });

});

describe('ValidateForm.validate callback allow-list (AFV-TSK-0001)', () => {
  it('invokes a registered validation callback when data-tovalidate starts with fn:', () => {
    const myEven = vi.fn((v) => Number(v) % 2 === 0);
    const vf = new ValidateForm(() => true, { validationCallbacks: { myEven } });

    expect(vf.validate('4', 'fn:myEven')).toBe(true);
    expect(vf.validate('3', 'fn:myEven')).toBe(false);
    expect(myEven).toHaveBeenCalledWith('4');
    expect(myEven).toHaveBeenCalledWith('3');
  });

  it('rejects + warns when the callback is not in the allow-list', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const vf = new ValidateForm(() => true, { validationCallbacks: {} });

    expect(vf.validate('anything', 'fn:ghost')).toBe(false);
    expect(warnSpy).toHaveBeenCalledOnce();
    expect(warnSpy.mock.calls[0][0]).toMatch(/"ghost"/);

    warnSpy.mockRestore();
  });

  it('does not fall back to window[fn] when a global function with the same name exists', () => {
    globalThis.unsafeGlobal = vi.fn(() => true);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const vf = new ValidateForm(() => true);

    expect(vf.validate('x', 'fn:unsafeGlobal')).toBe(false);
    expect(globalThis.unsafeGlobal).not.toHaveBeenCalled();

    delete globalThis.unsafeGlobal;
    warnSpy.mockRestore();
  });

  it('exposes validationCallbacks on the instance (defaults to empty object)', () => {
    const vf = new ValidateForm(() => true);
    expect(vf.validationCallbacks).toEqual({});
  });
});
