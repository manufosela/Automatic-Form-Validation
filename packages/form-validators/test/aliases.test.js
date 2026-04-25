import { describe, it, expect } from 'vitest';
import { validate, validators } from '../src/index.js';

describe('validate(name) — dispatch', () => {
  it('returns a function for known names (case-insensitive)', () => {
    expect(typeof validate('email')).toBe('function');
    expect(typeof validate('EMAIL')).toBe('function');
    expect(typeof validate('mobileEs')).toBe('function');
    expect(typeof validate('movil')).toBe('function');
    expect(typeof validate('correo')).toBe('function');
  });

  it('returns null for unknown names', () => {
    expect(validate('nope')).toBeNull();
    expect(validate('')).toBeNull();
    expect(validate(/** @type {any} */ (null))).toBeNull();
  });

  it('runs the right validator', () => {
    expect(validate('email')('manu@x.io')).toBe(true);
    expect(validate('movil')('600 000 000')).toBe(true);
    expect(validate('nif')('12345678Z')).toBe(true);
    expect(validate('telephone')('912345678')).toBe(true);
  });

  it('exposes the validators dispatch table as a frozen object', () => {
    expect(Object.isFrozen(validators)).toBe(true);
    expect(Object.keys(validators).length).toBeGreaterThan(20);
  });
});
