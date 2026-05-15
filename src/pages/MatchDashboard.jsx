import { useCallback, useEffect, useState } from 'react';
import { Activity, AlertCircle, CheckCircle, HeartPulse, RefreshCw, Users } from 'lucide-react';
import API from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const getScoreStyles = (score) => {
  if (score >= 85) {
    return {
      text: 'text-green-700',
      bg: 'bg-green-500',
      pill: 'bg-green-50 text-green-700 border-green-200',
    };
  }

  if (score >= 70) {
    return {
      text: 'text-yellow-700',
      bg: 'bg-yellow-500',
      pill: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    };
  }

  return {
    text: 'text-red-700',
    bg: 'bg-red-500',
    pill: 'bg-red-50 text-red-700 border-red-200',
  };
};

const getPredictionBadge = (value) => {
  if (value === 1) {
    return {
      label: 'AI compatible',
      classes: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    };
  }

  if (value === 0) {
    return {
      label: 'AI incompatible',
      classes: 'bg-rose-100 text-rose-700 border-rose-200'
    };
  }

  return {
    label: 'AI unavailable',
    classes: 'bg-gray-100 text-gray-600 border-gray-200'
  };
};

const formatLabel = (value) => {
  if (!value) return 'Not available';
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
};

export function MatchDashboard() {
  const [matches, setMatches] = useState([]);
  const [summary, setSummary] = useState({
    totalDonors: 0,
    totalRecipients: 0,
    successfulMatches: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const runMatching = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await API.post('/match/run');
      const allocations = response.data?.allocations || [];
      const compatibilityMatrix = response.data?.compatibilityMatrix || [];
      const recipientIds = new Set();

      compatibilityMatrix.forEach((donorEntry) => {
        donorEntry.recipients?.forEach((recipientEntry) => {
          recipientIds.add(String(recipientEntry.recipientId));
        });
      });

      setMatches(allocations);
      setSummary({
        totalDonors: compatibilityMatrix.length,
        totalRecipients: recipientIds.size,
        successfulMatches: allocations.length,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to run matching. Please check the backend server.');
      setMatches([]);
      setSummary({
        totalDonors: 0,
        totalRecipients: 0,
        successfulMatches: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      runMatching();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [runMatching]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-800">Organ Matching Center</p>
          <h2 className="text-2xl font-bold text-gray-900">Match Results Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">Stable matching allocations ranked by medical compatibility.</p>
        </div>
        <Button onClick={runMatching} disabled={loading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Run Matching Again
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-blue-700">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-gray-500">Total Donors</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{summary.totalDonors}</p>
            </div>
            <div className="rounded-full bg-blue-50 p-3">
              <HeartPulse className="h-6 w-6 text-blue-800" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-700">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-gray-500">Total Recipients</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{summary.totalRecipients}</p>
            </div>
            <div className="rounded-full bg-indigo-50 p-3">
              <Users className="h-6 w-6 text-indigo-800" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-700">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-gray-500">Successful Matches</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{summary.successfulMatches}</p>
            </div>
            <div className="rounded-full bg-green-50 p-3">
              <CheckCircle className="h-6 w-6 text-green-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      {loading && (
        <div className="flex min-h-80 items-center justify-center rounded-lg border border-gray-200 bg-white">
          <div className="text-center">
            <RefreshCw className="mx-auto h-10 w-10 animate-spin text-blue-800" />
            <p className="mt-4 text-sm font-medium text-gray-700">Running compatibility matching...</p>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Matching failed</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && matches.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-10 text-center">
          <Activity className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No compatible matches found</h3>
          <p className="mt-1 text-sm text-gray-500">Add more compatible donors or recipients, then run matching again.</p>
        </div>
      )}

      {!loading && !error && matches.length > 0 && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {matches.map((match, index) => {
            const score = Number(match.compatibilityScore) || 0;
            const scoreStyles = getScoreStyles(score);

            return (
              <Card key={`${match.donorName}-${match.recipientName}-${index}`} className="overflow-hidden border border-gray-200">
                <CardContent className="p-0">
                  <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Allocation #{index + 1}</p>
                        <h3 className="mt-1 text-lg font-bold text-gray-900">
                          {match.donorName} → {match.recipientName}
                        </h3>
                      </div>
                      <div className={`rounded-full border px-3 py-1 text-sm font-bold ${scoreStyles.pill}`}>
                        {score}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 p-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-md border border-gray-100 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Organ Type</p>
                        <p className="mt-1 text-base font-semibold text-gray-900">{formatLabel(match.organType)}</p>
                      </div>
                      <div className="rounded-md border border-gray-100 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Urgency Level</p>
                        <p className="mt-1 text-base font-semibold text-gray-900">{formatLabel(match.urgencyLevel)}</p>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Compatibility Percentage</span>
                        <span className={`text-sm font-bold ${scoreStyles.text}`}>{score}%</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full ${scoreStyles.bg}`}
                          style={{ width: `${Math.min(score, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <p className="mb-3 text-sm font-semibold text-gray-900">Compatibility Reasons</p>
                      <div className="flex flex-wrap gap-2">
                        {(match.reasons || []).map((reason) => (
                          <span
                            key={reason}
                            className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-100 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-700">AI Prediction</p>
                          <p className="text-xs text-gray-500">Machine learning assistance for compatibility</p>
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getPredictionBadge(match.mlPrediction).classes}`}>
                          {getPredictionBadge(match.mlPrediction).label}
                        </span>
                      </div>

                      <div className="mt-4 text-sm text-gray-700">
                        <div className="flex items-center justify-between">
                          <span>Confidence</span>
                          <span className="font-semibold text-gray-900">
                            {match.mlConfidence !== null ? `${match.mlConfidence}%` : 'N/A'}
                          </span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${match.mlConfidence !== null ? Math.min(match.mlConfidence, 100) : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
