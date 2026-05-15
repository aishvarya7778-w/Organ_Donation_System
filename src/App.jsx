import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { AdminLogin } from './pages/AdminLogin';
import { DonorRegistration } from './pages/DonorRegistration';
import { RecipientRegistration } from './pages/RecipientRegistration';
import { DonorAuth } from './pages/DonorAuth';
import { RecipientAuth } from './pages/RecipientAuth';
import { DonorDashboard } from './pages/DonorDashboard';
import { RecipientDashboard } from './pages/RecipientDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { MatchDashboard } from './pages/MatchDashboard';
import { DonorsPage } from './pages/DonorsPage';
import { RecipientsPage } from './pages/RecipientsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register/donor" element={<DonorRegistration />} />
          <Route path="/register/recipient" element={<RecipientRegistration />} />
        </Route>
        
        {/* Auth Route */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
        <Route path="/donor/login" element={<DonorAuth mode="login" />} />
        <Route path="/donor/register" element={<DonorAuth mode="register" />} />
        <Route path="/recipient/login" element={<RecipientAuth mode="login" />} />
        <Route path="/recipient/register" element={<RecipientAuth mode="register" />} />
        <Route
          path="/donor/dashboard"
          element={
            <ProtectedRoute tokenKey="donorToken" redirectTo="/donor/login">
              <DonorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipient/dashboard"
          element={
            <ProtectedRoute tokenKey="recipientToken" redirectTo="/recipient/login">
              <RecipientDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="matches" element={<MatchDashboard />} />
          <Route path="donors" element={<DonorsPage />} />
          <Route path="recipients" element={<RecipientsPage />} />
          <Route path="reports" element={<div className="p-8 text-center text-gray-500">Reports (Coming Soon)</div>} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
