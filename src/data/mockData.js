export const statisticsData = {
  totalDonors: 1420,
  activePatients: 854,
  successfulMatches: 312,
  availableOrgans: 48,
};

export const dashboardChartsData = {
  monthlyMatches: [
    { name: 'Jan', matches: 20 },
    { name: 'Feb', matches: 28 },
    { name: 'Mar', matches: 35 },
    { name: 'Apr', matches: 40 },
    { name: 'May', matches: 32 },
    { name: 'Jun', matches: 45 },
    { name: 'Jul', matches: 50 },
  ],
  organsDistribution: [
    { name: 'Kidney', value: 400 },
    { name: 'Liver', value: 300 },
    { name: 'Heart', value: 150 },
    { name: 'Lungs', value: 100 },
    { name: 'Corneas', value: 200 },
  ],
};

export const recentDonors = [
  { id: 'D001', name: 'John Doe', bloodGroup: 'O+', organ: 'Kidney', status: 'Available', date: '2026-05-10' },
  { id: 'D002', name: 'Sarah Smith', bloodGroup: 'A-', organ: 'Liver', status: 'Matched', date: '2026-05-11' },
  { id: 'D003', name: 'Michael Johnson', bloodGroup: 'B+', organ: 'Heart', status: 'Evaluating', date: '2026-05-12' },
  { id: 'D004', name: 'Emily Davis', bloodGroup: 'AB+', organ: 'Corneas', status: 'Available', date: '2026-05-13' },
];

export const recentPatients = [
  { id: 'P001', name: 'Robert Brown', bloodGroup: 'O+', requiredOrgan: 'Kidney', urgency: 'High', date: '2026-05-09' },
  { id: 'P002', name: 'Lisa White', bloodGroup: 'A-', requiredOrgan: 'Liver', urgency: 'Critical', date: '2026-05-10' },
  { id: 'P003', name: 'James Wilson', bloodGroup: 'AB-', requiredOrgan: 'Lungs', urgency: 'Medium', date: '2026-05-11' },
  { id: 'P004', name: 'Karen Martin', bloodGroup: 'B+', requiredOrgan: 'Heart', urgency: 'Critical', date: '2026-05-12' },
];

export const matchResults = [
  {
    matchId: 'M-1042',
    donorName: 'John Doe',
    recipientName: 'Robert Brown',
    organType: 'Kidney',
    bloodGroup: 'O+',
    compatibilityScore: 94,
    urgencyLevel: 'High',
    status: 'Pending Approval',
    date: '2026-05-14',
    distance: '45 miles',
    hospital: 'Central General Hospital'
  },
  {
    matchId: 'M-1043',
    donorName: 'David Lee',
    recipientName: 'Lisa White',
    organType: 'Liver',
    bloodGroup: 'A-',
    compatibilityScore: 88,
    urgencyLevel: 'Critical',
    status: 'Approved',
    date: '2026-05-13',
    distance: '12 miles',
    hospital: 'City Medical Center'
  },
  {
    matchId: 'M-1044',
    donorName: 'Amanda Taylor',
    recipientName: 'James Wilson',
    organType: 'Lungs',
    bloodGroup: 'AB-',
    compatibilityScore: 75,
    urgencyLevel: 'Medium',
    status: 'Rejected',
    date: '2026-05-12',
    distance: '120 miles',
    hospital: 'Westside Clinic'
  },
  {
    matchId: 'M-1045',
    donorName: 'Chris Evans',
    recipientName: 'Karen Martin',
    organType: 'Heart',
    bloodGroup: 'B+',
    compatibilityScore: 98,
    urgencyLevel: 'Critical',
    status: 'Operation Scheduled',
    date: '2026-05-11',
    distance: '5 miles',
    hospital: 'Metro Health Hospital'
  },
  {
    matchId: 'M-1046',
    donorName: 'Patricia Moore',
    recipientName: 'Kevin Clark',
    organType: 'Kidney',
    bloodGroup: 'A+',
    compatibilityScore: 82,
    urgencyLevel: 'Low',
    status: 'Pending Approval',
    date: '2026-05-10',
    distance: '30 miles',
    hospital: 'Northwood Medical'
  }
];
