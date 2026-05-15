import { useCallback, useEffect, useState } from 'react';
import API from '../services/api';
import { AdminDataTable } from '../components/AdminDataTable';

const formatLabel = (value) => {
  if (!value) return 'Not available';
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
};

const statusStyles = {
  available: 'bg-green-50 text-green-700 border-green-200',
  matched: 'bg-blue-50 text-blue-700 border-blue-200',
  unavailable: 'bg-red-50 text-red-700 border-red-200',
};

export function DonorsPage() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDonors = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get('/donors');
      setDonors(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to fetch donors.');
      setDonors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      fetchDonors();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [fetchDonors]);

  const columns = [
    { key: 'fullName', header: 'Name' },
    { key: 'age', header: 'Age' },
    { key: 'bloodGroup', header: 'Blood Group' },
    { key: 'organType', header: 'Organ Type', render: (row) => formatLabel(row.organType) },
    { key: 'city', header: 'City' },
    {
      key: 'availabilityStatus',
      header: 'Availability Status',
      render: (row) => (
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
            statusStyles[row.availabilityStatus] || 'bg-gray-50 text-gray-700 border-gray-200'
          }`}
        >
          {formatLabel(row.availabilityStatus)}
        </span>
      ),
    },
  ];

  const rows = donors.map((donor) => ({
    id: donor._id,
    ...donor,
  }));

  return (
    <AdminDataTable
      title="Donors"
      description="Live donor records from the organ donation database."
      columns={columns}
      rows={rows}
      loading={loading}
      error={error}
      emptyMessage="No donors found"
      onRefresh={fetchDonors}
    />
  );
}
