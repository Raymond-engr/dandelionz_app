/**
 * Downloading the finance ledger.
 *
 * The export endpoint returns a file, not JSON, so it does not go through RTK Query: a
 * cached blob is meaningless and the response has to reach the browser as a download. It
 * still needs the bearer token, so it cannot be a plain link either.
 *
 * The filter params are built by the same function the list and summary queries use, which
 * is the point — a download that quietly covered a different slice than the screen would be
 * worse than no download at all.
 */

export interface LedgerExportParams {
  date_from?: string;
  date_to?: string;
  entry_type?: string;
  direction?: string;
  bucket?: string;
  user?: string;
  reference?: string;
  search?: string;
}

export type ExportFormat = 'csv' | 'xlsx';

/**
 * Turn the active filters into a query string for the export endpoint.
 *
 * Empty values are dropped rather than sent as `field=`: the backend treats a blank as
 * absent anyway, and an empty param in the URL makes a shared link look like it carries a
 * filter it does not.
 *
 * The format parameter is `export_format`, not `format` — DRF reserves `format` for content
 * negotiation, and sending it makes the request 404 before the view ever runs.
 */
export function buildExportQuery(
  params: LedgerExportParams,
  format: ExportFormat
): string {
  const search = new URLSearchParams();
  search.set('export_format', format);

  (Object.keys(params) as Array<keyof LedgerExportParams>).forEach((key) => {
    const value = params[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      search.set(key, String(value).trim());
    }
  });

  return search.toString();
}

export function exportFilename(format: ExportFormat, now = new Date()): string {
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');
  return `dandelionz-ledger-${stamp}.${format}`;
}

/**
 * Fetch the export with the bearer token and hand it to the browser as a download.
 *
 * Throws on a non-OK response so the caller can surface it — a silent failure here looks
 * identical to a browser blocking the download, which is a miserable thing to debug.
 */
export async function downloadLedgerExport({
  baseUrl,
  token,
  params,
  format,
}: {
  baseUrl: string;
  token: string | null;
  params: LedgerExportParams;
  format: ExportFormat;
}): Promise<void> {
  const url = `${baseUrl}/transactions/admin/ledger/export/?${buildExportQuery(params, format)}`;

  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    throw new Error(
      response.status === 403 || response.status === 401
        ? 'You do not have permission to export the ledger.'
        : `The export failed (${response.status}). Please try again.`
    );
  }

  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = exportFilename(format);
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoked after the click so the browser has taken ownership of the data; leaking these
  // keeps the whole blob in memory for the life of the tab.
  window.URL.revokeObjectURL(objectUrl);
}
