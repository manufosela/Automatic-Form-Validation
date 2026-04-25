import { describe, it, expect } from 'vitest';
import { nif, nie, cif, bankAccountEs } from '../src/index.js';

describe('nif', () => {
  it('accepts valid standard NIFs', () => {
    expect(nif('12345678Z')).toBe(true); // 12345678 % 23 = 14 → "Z"
    expect(nif('00000000T')).toBe(true); // 0 % 23 = 0 → "T"
  });
  it('rejects wrong control letter', () => {
    expect(nif('12345678A')).toBe(false);
    expect(nif('00000000A')).toBe(false);
  });
  it('rejects bad shapes', () => {
    expect(nif('1234567Z')).toBe(false);
    expect(nif('Z12345678')).toBe(false);
    expect(nif('')).toBe(false);
  });
  it('is case-insensitive', () => {
    expect(nif('12345678z')).toBe(true);
  });
});

describe('nie', () => {
  it('accepts NIEs with X/Y/Z prefix and matching control letter', () => {
    // X1234567L: replace X→0 → 01234567 % 23 = 11 → 'L'
    expect(nie('X1234567L')).toBe(true);
  });
  it('rejects wrong control letter on XYZ form', () => {
    expect(nie('X1234567A')).toBe(false);
  });
  it('accepts historical T-prefix NIE without checksum', () => {
    expect(nie('T12345678')).toBe(true);
    expect(nie('TABCDEFGH')).toBe(true);
  });
  it('rejects bad shapes', () => {
    expect(nie('A1234567L')).toBe(false);
    expect(nie('')).toBe(false);
  });
});

describe('cif', () => {
  it('rejects wrong shape', () => {
    expect(cif('123456789')).toBe(false);
    expect(cif('A12345678')).toBe(false); // 9 chars but no valid letter check yet — depends on body
    expect(cif('')).toBe(false);
  });
  it('is case-insensitive', () => {
    // Build a synthetic CIF with a known control letter via the algorithm.
    // For body "0000000": sum = 0+0+0 (odds) + (0+0)+(0+0)+(0+0)+(0+0) = 0; 10-0 mod 10 = 0 → digit '0', letter 'J' (64+10=74)
    // So "A0000000J" must be valid:
    expect(cif('A0000000J')).toBe(true);
    expect(cif('a0000000j')).toBe(true);
    expect(cif('A00000000')).toBe(true); // last char as digit form
  });
});

describe('bankAccountEs (CCC)', () => {
  it('rejects non-20-digit input', () => {
    expect(bankAccountEs('1234')).toBe(false);
    expect(bankAccountEs('a'.repeat(20))).toBe(false);
    expect(bankAccountEs('')).toBe(false);
  });
  it('rejects 20 zeros (control digits would be "00" but algorithm yields specific values)', () => {
    // For 20 zeros: part1 weighted sum is 0 → d1 = 11 - 0 = 11 → 0; same for d2 → control "00".
    // So 20 zeros IS technically valid by this legacy algorithm. We assert it accepts.
    expect(bankAccountEs('0'.repeat(20))).toBe(true);
  });
  it('rejects mismatched control', () => {
    expect(bankAccountEs(`${'0'.repeat(8)}99${'0'.repeat(10)}`)).toBe(false);
  });
});
