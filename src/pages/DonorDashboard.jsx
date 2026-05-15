import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { CheckCircle, FileText, HeartPulse, LogOut, MapPin, ShieldCheck } from 'lucide-react';
import API from '../services/api';
import { Button } from '../components/ui/Button';

const SOCKET_URL = 'http://localhost:5000';
const donorTimeline = ['Pending', 'Under Review', 'Approved', 'Matched', 'Completed'];

const formatLabel = (value) => {
  if (!value) return 'Not available';
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
};

const formatDate = (value) => {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const getProgress = (status) => {
  const index = Math.max(donorTimeline.indexOf(status), 0);
  return Math.round(((index + 1) / donorTimeline.length) * 100);
};

export function DonorDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [profileResponse, statusResponse] = await Promise.all([
        API.get('/donor/profile'),
        API.get('/donor/status'),
      ]);

      setProfile(profileResponse.data?.data?.profile);
      setStatus(statusResponse.data?.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load donor dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      fetchDashboard();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [fetchDashboard]);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    socket.on('notification', (notification) => {
      if (['donor_status_updated', 'match_found', 'match_completed'].includes(notification.type)) {
        fetchDashboard();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchDashboard]);

  const handleLogout = () => {
    localStorage.removeItem('donorToken');
    localStorage.removeItem('donorUser');
    navigate('/donor/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <HeartPulse className="h-8 w-8 text-blue-800" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Donor Portal</h1>
              <p className="text-sm text-gray-500">Hospital application dashboard</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {loading && <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow-sm">Loading dashboard...</div>}
        {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}

        {!loading && !error && profile && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome, {profile.fullName}</h2>
              <p className="mt-1 text-gray-500">Track your donor application, uploaded reports, and match progress.</p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <ShieldCheck className="h-7 w-7 text-blue-800" />
                <p className="mt-4 text-sm text-gray-500">Application Status</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{status?.applicationStatus}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <HeartPulse className="h-7 w-7 text-green-700" />
                <p className="mt-4 text-sm text-gray-500">Match Status</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{status?.matchStatus}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <FileText className="h-7 w-7 text-indigo-700" />
                <p className="mt-4 text-sm text-gray-500">Medical Report</p>
                {status?.reportFile ? (
                  <a href={`http://localhost:5000${status.reportFile}`} target="_blank" rel="noreferrer" className="mt-1 block font-semibold text-blue-800">
                    View uploaded report
                  </a>
                ) : (
                  <p className="mt-1 text-lg font-semibold text-gray-900">No report uploaded</p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Application Tracking</h3>
                  <p className="mt-1 text-sm text-gray-500">Latest update: {formatDate(status?.latestUpdate)}</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-800">
                  {getProgress(status?.applicationStatus)}% complete
                </span>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full rounded-full bg-blue-700" style={{ width: `${getProgress(status?.applicationStatus)}%` }} />
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-5">
                {donorTimeline.map((step) => {
                  const isComplete = donorTimeline.indexOf(step) <= donorTimeline.indexOf(status?.applicationStatus);

                  return (
                    <div key={step} className="flex items-center gap-3 md:block">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full border ${isComplete ? 'border-blue-700 bg-blue-700 text-white' : 'border-gray-200 bg-white text-gray-400'}`}>
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <p className={`mt-0 text-sm font-medium md:mt-3 ${isComplete ? 'text-gray-900' : 'text-gray-400'}`}>{step}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Match Information</h3>
              {status?.matchDetails ? (
                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <p><span className="text-gray-500">Recipient:</span> <strong>{status.matchDetails.recipientName}</strong></p>
                  <p><span className="text-gray-500">Compatibility:</span> <strong>{status.matchDetails.compatibilityScore}%</strong></p>
                  <p><span className="text-gray-500">Urgency:</span> <strong>{formatLabel(status.matchDetails.urgencyLevel)}</strong></p>
                  <p><span className="text-gray-500">Match Status:</span> <strong>{formatLabel(status.matchDetails.matchStatus)}</strong></p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-gray-500">No match has been assigned yet.</p>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Donor Details</h3>
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <p><span className="text-gray-500">Blood Group:</span> <strong>{profile.bloodGroup}</strong></p>
                <p><span className="text-gray-500">Organ Type:</span> <strong>{formatLabel(profile.organType)}</strong></p>
                <p><span className="text-gray-500">Health Score:</span> <strong>{profile.organHealthScore}</strong></p>
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /> {profile.city}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
