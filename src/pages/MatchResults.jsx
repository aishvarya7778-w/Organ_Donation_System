import React, { useState } from 'react';
import { Search, Filter, Eye, MoreHorizontal, MapPin, Activity, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { matchResults } from '../data/mockData';

export function MatchResults() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMatch, setSelectedMatch] = useState(null);

  const filteredMatches = matchResults.filter(match => 
    match.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.matchId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Match Results</h2>
          <p className="text-sm text-gray-500">Review and manage organ compatibility matches.</p>
        </div>
        <Button>Generate New Matches</Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100 bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full h-9 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <Select 
              className="w-full sm:w-40"
              options={[
                { value: 'all', label: 'All Organs' },
                { value: 'kidney', label: 'Kidney' },
                { value: 'liver', label: 'Liver' },
                { value: 'heart', label: 'Heart' },
              ]}
            />
            <Button variant="outline" className="px-3">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white text-gray-500 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Match ID</th>
                  <th className="px-6 py-4">Donor</th>
                  <th className="px-6 py-4">Recipient</th>
                  <th className="px-6 py-4">Organ</th>
                  <th className="px-6 py-4 text-center">Compatibility</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMatches.map((match) => (
                  <tr key={match.matchId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-blue-800">{match.matchId}</td>
                    <td className="px-6 py-4 text-gray-900">{match.donorName}</td>
                    <td className="px-6 py-4 text-gray-900">{match.recipientName}</td>
                    <td className="px-6 py-4 text-gray-600">{match.organType}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              match.compatibilityScore >= 90 ? 'bg-green-500' :
                              match.compatibilityScore >= 80 ? 'bg-blue-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${match.compatibilityScore}%` }}
                          />
                        </div>
                        <span className="font-medium text-gray-700">{match.compatibilityScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        match.status === 'Approved' ? 'success' :
                        match.status === 'Rejected' ? 'danger' :
                        match.status === 'Operation Scheduled' ? 'primary' : 'warning'
                      }>
                        {match.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedMatch(match)}
                        className="p-1.5 text-gray-400 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors ml-1">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredMatches.length === 0 && (
            <div className="text-center py-12">
              <Activity className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No matches found</h3>
              <p className="text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Match Detail Modal */}
      <Modal 
        isOpen={!!selectedMatch} 
        onClose={() => setSelectedMatch(null)}
        title="Match Details"
        className="max-w-2xl"
      >
        {selectedMatch && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div>
                <p className="text-sm text-blue-600 font-semibold mb-1">Match ID: {selectedMatch.matchId}</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-blue-900">{selectedMatch.compatibilityScore}%</span>
                  <span className="text-sm text-blue-800">Compatibility Score</span>
                </div>
              </div>
              <Badge variant={selectedMatch.status === 'Approved' ? 'success' : 'warning'} className="text-sm px-3 py-1">
                {selectedMatch.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Donor Summary */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Donor Details</h4>
                <div className="space-y-3">
                  <p className="text-lg font-medium text-gray-900">{selectedMatch.donorName}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-24 text-gray-500">Blood Group:</span>
                    <Badge variant="primary">{selectedMatch.bloodGroup}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-24 text-gray-500">Organ:</span>
                    <span className="font-medium text-gray-900">{selectedMatch.organType}</span>
                  </div>
                </div>
              </div>

              {/* Recipient Summary */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Recipient Details</h4>
                <div className="space-y-3">
                  <p className="text-lg font-medium text-gray-900">{selectedMatch.recipientName}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-24 text-gray-500">Blood Group:</span>
                    <Badge variant="primary">{selectedMatch.bloodGroup}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-24 text-gray-500">Urgency:</span>
                    <Badge variant={selectedMatch.urgencyLevel === 'Critical' ? 'danger' : 'warning'}>{selectedMatch.urgencyLevel}</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-100">
{/* AI Analysis Section */}
<div className="bg-red-50 p-4 rounded-lg border border-red-100 space-y-3">
  <h4 className="text-sm font-semibold text-red-700 uppercase tracking-wider">
    AI Compatibility Analysis
  </h4>

  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-600">
      AI Prediction
    </span>

    <Badge
  variant={
    selectedMatch.mlPrediction === true
      ? "success"
      : selectedMatch.mlPrediction === false
      ? "danger"
      : "warning"
  }
>
  {
    selectedMatch.mlPrediction === true
      ? "AI Compatible"
      : selectedMatch.mlPrediction === false
      ? "AI Incompatible"
      : "AI Unavailable"
  }
</Badge>
  </div>

  {/* AI REASONS */}
  <div className="mt-2">
    <p className="text-sm font-semibold text-red-700 mb-2">
      AI Risk Factors
    </p>

    <div className="flex flex-wrap gap-2">
      {(
        selectedMatch.aiReasons || [
          "AI detected elevated transplant risk",
          "Large donor-recipient age gap",
          "Potential medical incompatibility"
        ]
      ).map((reason, index) => (
        <span
          key={index}
          className="px-3 py-1 rounded-full border border-red-300 bg-red-100 text-red-700 text-xs"
        >
          {reason}
        </span>
      ))}
    </div>
  </div>

  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-600">
      Confidence
    </span>

    <span className="font-semibold text-gray-900">
      {
  selectedMatch.mlConfidence
    ? `${(selectedMatch.mlConfidence * 100).toFixed(2)}%`
    : "N/A"
}
    </span>
  </div>

  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className="bg-blue-500 h-2 rounded-full"
      style={{
        width: `${
  selectedMatch.mlConfidence
    ? selectedMatch.mlConfidence * 100
    : 0
}%`,
      }}
    ></div>
  </div>
</div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                <span className="w-32 text-gray-500">Distance:</span>
                <span className="font-medium text-gray-900">{selectedMatch.distance}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Activity className="h-4 w-4 text-gray-400 mr-3" />
                <span className="w-32 text-gray-500">Target Hospital:</span>
                <span className="font-medium text-gray-900">{selectedMatch.hospital}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                <span className="w-32 text-gray-500">Match Date:</span>
                <span className="font-medium text-gray-900">{selectedMatch.date}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button variant="outline" onClick={() => setSelectedMatch(null)}>Close</Button>
              <Button variant="danger">Reject Match</Button>
              <Button>Approve Match</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
