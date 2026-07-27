import { describe, it, expect } from 'vitest';
import { buildExportQuery, exportFilename } from './ledgerExport';

describe('buildExportQuery', () => {
  it('always sends the format', () => {
    const query = new URLSearchParams(buildExportQuery({}, 'csv'));
    expect(query.get('export_format')).toBe('csv');
  });

  it('uses export_format rather than format', () => {
    // DRF reserves `format` for content negotiation: sending it makes the request 404
    // before the view runs, because DRF looks for a renderer named "csv" and finds none.
    // This cost a debugging round trip once and must not regress.
    const query = new URLSearchParams(buildExportQuery({}, 'xlsx'));
    expect(query.get('format')).toBeNull();
    expect(query.get('export_format')).toBe('xlsx');
  });

  it('passes the active filters through', () => {
    const query = new URLSearchParams(
      buildExportQuery(
        { date_from: '2026-01-01', date_to: '2026-01-31', direction: 'DEBIT' },
        'csv'
      )
    );

    expect(query.get('date_from')).toBe('2026-01-01');
    expect(query.get('date_to')).toBe('2026-01-31');
    expect(query.get('direction')).toBe('DEBIT');
  });

  it('drops empty values instead of sending blank params', () => {
    const query = new URLSearchParams(
      buildExportQuery({ user: '', search: '   ', direction: 'CREDIT' }, 'csv')
    );

    expect(query.has('user')).toBe(false);
    expect(query.has('search')).toBe(false);
    expect(query.get('direction')).toBe('CREDIT');
  });

  it('trims surrounding whitespace off values', () => {
    const query = new URLSearchParams(
      buildExportQuery({ user: '  admin@test.com  ' }, 'csv')
    );
    expect(query.get('user')).toBe('admin@test.com');
  });

  it('encodes values that need it', () => {
    const raw = buildExportQuery({ search: 'a b&c' }, 'csv');
    expect(raw).not.toContain('a b&c');
    expect(new URLSearchParams(raw).get('search')).toBe('a b&c');
  });

  it('produces the same filters the screen is showing', () => {
    // The whole point of the shared params: an export that silently covered a different
    // slice than the table would be worse than no export at all.
    const filters = { date_from: '2026-02-01', entry_type: 'WITHDRAWAL', user: 'x@y.com' };
    const query = new URLSearchParams(buildExportQuery(filters, 'xlsx'));

    Object.entries(filters).forEach(([key, value]) => {
      expect(query.get(key)).toBe(value);
    });
  });
});

describe('exportFilename', () => {
  it('carries the format as the extension', () => {
    expect(exportFilename('csv', new Date(2026, 6, 20))).toMatch(/\.csv$/);
    expect(exportFilename('xlsx', new Date(2026, 6, 20))).toMatch(/\.xlsx$/);
  });

  it('zero-pads the date so filenames sort chronologically', () => {
    expect(exportFilename('csv', new Date(2026, 0, 5))).toBe(
      'dandelionz-ledger-20260105.csv'
    );
  });
});
