import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDateToLocal, generatePagination } from '@/app/lib/utils';

describe('formatCurrency', () => {
  it('formats cents to USD string', () => {
    expect(formatCurrency(1000)).toBe('$10.00');
  });

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats large amounts', () => {
    expect(formatCurrency(100000)).toBe('$1,000.00');
  });
});

describe('formatDateToLocal', () => {
  it('returns a formatted date string', () => {
    const result = formatDateToLocal('2024-01-15T00:00:00.000Z');
    expect(result).toMatch(/Jan/);
    expect(result).toMatch(/2024/);
  });
});

describe('generatePagination', () => {
  it('returns all pages when total is small', () => {
    expect(generatePagination(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('shows dots at end when current page is near start', () => {
    const pages = generatePagination(1, 10);
    expect(pages).toContain('...');
    expect(pages[0]).toBe(1);
  });

  it('shows dots at start when current page is near end', () => {
    const pages = generatePagination(10, 10);
    expect(pages).toContain('...');
    expect(pages[pages.length - 1]).toBe(10);
  });
});

