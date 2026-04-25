import { describe, it, expect } from 'vitest';
import { creditCard } from '../src/index.js';

describe('creditCard', () => {
  it('accepts well-formed Luhn-valid 16-digit cards', () => {
    // Visa test number — Luhn-valid.
    expect(creditCard('4111111111111111')).toBe(true);
    // Mastercard test number — Luhn-valid.
    expect(creditCard('5555555555554444')).toBe(true);
  });
  it('rejects when first digit is wrong', () => {
    expect(creditCard('1111111111111111')).toBe(false);
  });
  it('rejects bad lengths', () => {
    expect(creditCard('411111111111111')).toBe(false); // 15 digits
    expect(creditCard('41111111111111111')).toBe(false); // 17 digits
  });
  it('rejects non-digit and empty', () => {
    expect(creditCard('4111-1111-1111-1111')).toBe(false);
    expect(creditCard('')).toBe(false);
    expect(creditCard(undefined)).toBe(false);
  });
});
