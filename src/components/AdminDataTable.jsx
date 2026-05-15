import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';

export function AdminDataTable({
  title,
  description,
  columns,
  rows,
  loading,
  error,
  emptyMessage,
  onRefresh,
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <Button onClick={onRefresh} disabled={loading} variant="outline" className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {error && (
          <div className="border-b border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-5 py-3 font-semibold text-gray-600">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    {columns.map((column) => (
                      <td key={column.key} className="px-5 py-4">
                        <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                      </td>
                    ))}
                  </tr>
                ))}

              {!loading &&
                rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={column.key} className="px-5 py-4 text-gray-700">
                        {column.render ? column.render(row) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {!loading && rows.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-medium text-gray-900">{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
