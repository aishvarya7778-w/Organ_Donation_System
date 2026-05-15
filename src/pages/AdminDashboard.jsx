import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Heart, Activity, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { statisticsData, dashboardChartsData, recentDonors, recentPatients } from '../data/mockData';

const COLORS = ['#1e40af', '#3b82f6', '#93c5fd', '#bfdbfe', '#eff6ff'];

export function AdminDashboard() {
  const stats = [
    { label: 'Total Donors', value: statisticsData.totalDonors, icon: Heart, trend: '+12%', color: 'text-blue-800' },
    { label: 'Total Recipients', value: statisticsData.activePatients, icon: Users, trend: '+5%', color: 'text-indigo-600' },
    { label: 'Matches Found', value: statisticsData.successfulMatches, icon: CheckCircle, trend: '+18%', color: 'text-green-600' },
    { label: 'Available Organs', value: statisticsData.availableOrgans, icon: Activity, trend: '-2%', color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-sm text-gray-500">System analytics and recent activities.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className={stat.trend.startsWith('+') ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                  {stat.trend}
                </span>
                <span className="text-gray-500 ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Matches Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardChartsData.monthlyMatches} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="matches" fill="#1e40af" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organ Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardChartsData.organsDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {dashboardChartsData.organsDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {dashboardChartsData.organsDistribution.map((entry, index) => (
                <div key={entry.name} className="flex items-center text-sm">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  <span className="text-gray-600">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Donors</CardTitle>
            <button className="text-sm text-blue-800 font-medium hover:underline">View all</button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Organ</th>
                    <th className="px-6 py-3">Blood</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentDonors.map((donor) => (
                    <tr key={donor.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-medium text-gray-900">{donor.name}</td>
                      <td className="px-6 py-4 text-gray-600">{donor.organ}</td>
                      <td className="px-6 py-4">
                        <Badge variant="primary">{donor.bloodGroup}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={donor.status === 'Available' ? 'success' : 'default'}>
                          {donor.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Patient Requests</CardTitle>
            <button className="text-sm text-blue-800 font-medium hover:underline">View all</button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Needed</th>
                    <th className="px-6 py-3">Blood</th>
                    <th className="px-6 py-3">Urgency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-medium text-gray-900">{patient.name}</td>
                      <td className="px-6 py-4 text-gray-600">{patient.requiredOrgan}</td>
                      <td className="px-6 py-4">
                        <Badge variant="primary">{patient.bloodGroup}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          patient.urgency === 'Critical' ? 'danger' : 
                          patient.urgency === 'High' ? 'warning' : 'default'
                        }>
                          {patient.urgency}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
