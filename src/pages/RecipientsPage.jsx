import { useCallback, useEffect, useState } from 'react';
import API from '../services/api';
import { AdminDataTable } from '../components/AdminDataTable';

const formatLabel = (value) => {
  if (!value) return 'Not available';
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
};

const urgencyStyles = {
  low: 'bg-green-50 text-green-700 border-green-200',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
};

export function RecipientsPage() {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRecipients = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get('/recipients');
      setRecipients(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to fetch recipients.');
      setRecipients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      fetchRecipients();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [fetchRecipients]);

  const columns = [
    { key: 'patientName', header: 'Name' },
    { key: 'age', header: 'Age' },
    { key: 'bloodGroup', header: 'Blood Group' },
    { key: 'requiredOrgan', header: 'Needed Organ', render: (row) => formatLabel(row.requiredOrgan) },
    {
      key: 'urgencyLevel',
      header: 'Urgency Level',
      render: (row) => (
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
            urgencyStyles[row.urgencyLevel] || 'bg-gray-50 text-gray-700 border-gray-200'
          }`}
        >
          {formatLabel(row.urgencyLevel)}
        </span>
      ),
    },
    { key: 'city', header: 'City' },
  ];

  const rows = recipients.map((recipient) => ({
    id: recipient._id,
    ...recipient,
  }));

  return (
    <AdminDataTable
      title="Recipients"
      description="Live recipient waiting-list records from the matching system."
      columns={columns}
      rows={rows}
      loading={loading}
      error={error}
      emptyMessage="No recipients found"
      onRefresh={fetchRecipients}
    />
  );
}
