'use client';

import React, { useMemo, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Download, Search } from 'lucide-react';
import {
  useGetLedgerQuery,
  useGetLedgerSummaryQuery,
  type LedgerFilters,
} from '@/lib/api/adminApi';
import { useAppSelector } from '@/lib/hooks';
import LoadingSpinner from '@/components/LoadingSpinner';
import { downloadLedgerExport, type ExportFormat } from '@/lib/ledgerExport';
import { format as formatDate } from 'date-fns';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.dandelionz.com.ng';

const ENTRY_TYPES = [
  { value: '', label: 'All types' },
  { value: 'DEPOSIT', label: 'Wallet Deposit' },
  { value: 'DEPOSIT_REVERSAL', label: 'Deposit Refund' },
  { value: 'ORDER_PAYMENT', label: 'Order Payment' },
  { value: 'ORDER_REFUND', label: 'Order Refund' },
  { value: 'VENDOR_EARNING', label: 'Vendor Earning' },
  { value: 'COMMISSION', label: 'Platform Commission' },
  { value: 'DELIVERY_FEE', label: 'Delivery Fee' },
  { value: 'REFERRAL_BONUS', label: 'Referral Bonus' },
  { value: 'WITHDRAWAL', label: 'Withdrawal' },
  { value: 'WITHDRAWAL_REVERSAL', label: 'Withdrawal Reversal' },
  { value: 'ADJUSTMENT', label: 'Manual Adjustment' },
];

const naira = (value: string | number) =>
  `₦${Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/**
 * The finance ledger: every movement of money on the platform.
 *
 * Read-only by construction — the ledger is append-only, and there is no edit endpoint for
 * these rows anywhere in the API. The summary card and the table are driven by the same
 * filters, and so is the export, so a downloaded file always matches what is on screen.
 */
export default function AdminLedgerPage() {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.accessToken);

  const [filters, setFilters] = useState<LedgerFilters>({});
  const [searchDraft, setSearchDraft] = useState('');
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const [exportError, setExportError] = useState('');

  const query = useMemo(() => ({ ...filters, page }), [filters, page]);

  const { data: ledger, isLoading, isFetching } = useGetLedgerQuery(query);
  const { data: summaryResponse } = useGetLedgerSummaryQuery(filters);

  const entries = ledger?.results ?? [];
  const summary = summaryResponse?.data;

  const updateFilter = (key: keyof LedgerFilters, value: string) => {
    // Any filter change invalidates the current page: staying on page 7 of a narrower
    // result set shows an empty table and looks like the filter returned nothing.
    setPage(1);
    setFilters((current) => {
      const next = { ...current };
      if (value.trim() === '') {
        delete next[key];
      } else {
        next[key] = value as never;
      }
      return next;
    });
  };

  const handleExport = async (exportFormat: ExportFormat) => {
    setExportError('');
    setExporting(exportFormat);
    try {
      await downloadLedgerExport({
        baseUrl: BASE_URL,
        token,
        params: filters,
        format: exportFormat,
      });
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'The export failed.');
    } finally {
      setExporting(null);
    }
  };

  return (
    <AppLayout showBottomNav={false} userRole="admin">
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-center relative">
          <button onClick={() => router.back()} className="absolute left-4">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-[#030482]">Finance Ledger</h1>
        </div>

        <div className="p-4 max-w-7xl mx-auto space-y-4">
          {/* Totals for the filtered slice */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Money In</p>
              <p className="text-lg font-bold text-green-600">
                {summary ? naira(summary.total_credits) : '—'}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Money Out</p>
              <p className="text-lg font-bold text-red-600">
                {summary ? naira(summary.total_debits) : '—'}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Net</p>
              <p className="text-lg font-bold text-[#030482]">
                {summary ? naira(summary.net) : '—'}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Entries</p>
              <p className="text-lg font-bold text-gray-900">
                {summary ? summary.count.toLocaleString() : '—'}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label htmlFor="date-from" className="block text-xs text-gray-500 mb-1">
                  From
                </label>
                <input
                  id="date-from"
                  type="date"
                  value={filters.date_from ?? ''}
                  onChange={(e) => updateFilter('date_from', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label htmlFor="date-to" className="block text-xs text-gray-500 mb-1">
                  To
                </label>
                <input
                  id="date-to"
                  type="date"
                  value={filters.date_to ?? ''}
                  onChange={(e) => updateFilter('date_to', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label htmlFor="entry-type" className="block text-xs text-gray-500 mb-1">
                  Type
                </label>
                <select
                  id="entry-type"
                  value={filters.entry_type ?? ''}
                  onChange={(e) => updateFilter('entry_type', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  {ENTRY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="direction" className="block text-xs text-gray-500 mb-1">
                  Direction
                </label>
                <select
                  id="direction"
                  value={filters.direction ?? ''}
                  onChange={(e) => updateFilter('direction', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="">Both</option>
                  <option value="CREDIT">Money in</option>
                  <option value="DEBIT">Money out</option>
                </select>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateFilter('search', searchDraft);
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  placeholder="Reference, description, or user"
                  aria-label="Search the ledger"
                  className="w-full pl-9 p-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#030482] text-white rounded-lg text-sm font-semibold"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilters({});
                  setSearchDraft('');
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700"
              >
                Clear
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => handleExport('csv')}
                disabled={exporting !== null}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {exporting === 'csv' ? 'Preparing…' : 'Export CSV'}
              </button>
              <button
                onClick={() => handleExport('xlsx')}
                disabled={exporting !== null}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {exporting === 'xlsx' ? 'Preparing…' : 'Export Excel'}
              </button>
              <span className="text-xs text-gray-500">
                Exports use the filters above.
              </span>
            </div>

            {exportError && (
              <p className="text-sm text-red-600">{exportError}</p>
            )}
          </div>

          {/* Entries */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                No ledger entries match these filters.
              </div>
            ) : (
              <>
                {/* Wide content scrolls inside its own container so the page never does. */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-600">Date</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">User</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Type</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Reference</th>
                        <th className="px-4 py-3 font-semibold text-gray-600 text-right">
                          Amount
                        </th>
                        <th className="px-4 py-3 font-semibold text-gray-600 text-right">
                          Balance After
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {entries.map((entry) => {
                        const isCredit = entry.direction === 'CREDIT';
                        return (
                          <tr key={entry.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                              {formatDate(new Date(entry.created_at), 'dd MMM yyyy HH:mm')}
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-gray-900">{entry.user_name || '—'}</p>
                              <p className="text-xs text-gray-500">{entry.user_email}</p>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-gray-900">
                                {entry.entry_type_display}
                              </span>
                              <span
                                className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${
                                  entry.bucket === 'SPENDABLE'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {entry.bucket === 'SPENDABLE' ? 'Deposit' : 'Withdrawable'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                              {entry.reference || '—'}
                            </td>
                            <td
                              className={`px-4 py-3 text-right font-semibold whitespace-nowrap ${
                                isCredit ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              {isCredit ? '+' : '−'}
                              {naira(entry.amount)}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-600 whitespace-nowrap">
                              {naira(entry.balance_after)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Showing {entries.length} of {ledger?.count?.toLocaleString() ?? 0}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!ledger?.previous || isFetching}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!ledger?.next || isFetching}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => router.push('/admin/finance/failed-payments')}
            className="w-full bg-white rounded-xl p-4 border border-gray-100 text-left hover:bg-gray-50"
          >
            <p className="font-semibold text-gray-900">Failed &amp; unapplied payments</p>
            <p className="text-sm text-gray-500 mt-0.5">
              Paystack told us about these but they never moved any money, so they are not
              in the ledger.
            </p>
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
