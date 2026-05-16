import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, HeartPulse, Lock, Mail, ShieldCheck } from 'lucide-react';
import API from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const initialFormData = {
  email: '',
  password: '',
};

export function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ type: '', message: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/admin/matches';

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Password is required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast({ type: '', message: '' });

    if (!validateForm()) {
      setToast({ type: 'error', message: 'Please enter your admin credentials.' });
      return;
    }

    try {
      setLoading(true);
      const response = await API.post('/api/admin/login', formData);
      const { token, admin } = response.data?.data || {};

      if (!token) {
        throw new Error('Admin token not returned by server');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(admin));
      setToast({ type: 'success', message: 'Login successful. Redirecting to dashboard...' });
      setFormData(initialFormData);

      setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 500);
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Login failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      {toast.message && (
        <div
          className={`fixed right-4 top-4 z-50 rounded-md border px-4 py-3 text-sm shadow-lg ${
            toast.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-green-200 bg-green-50 text-green-700'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="w-full max-w-5xl grid grid-cols-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl lg:grid-cols-[1fr_420px]">
        <section className="hidden bg-blue-900 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <ShieldCheck className="h-4 w-4" />
              Secure Admin Access
            </div>
            <h1 className="mt-8 text-4xl font-bold leading-tight">Organ Donation Control Center</h1>
            <p className="mt-4 max-w-md text-blue-100">
              Review donor and recipient records, run stable matching, and manage critical allocation decisions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-white/10 bg-white/10 p-4">
              <p className="text-sm text-blue-100">Protected</p>
              <p className="mt-1 text-xl font-semibold">JWT Sessions</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/10 p-4">
              <p className="text-sm text-blue-100">Workflow</p>
              <p className="mt-1 text-xl font-semibold">Match Review</p>
            </div>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-8">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <HeartPulse className="h-8 w-8 text-blue-800" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-gray-900">Admin Login</h2>
            <p className="mt-2 text-sm text-gray-500">Sign in to access the hospital matching dashboard.</p>
          </div>

          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <Input
                    label="Email address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@lifematch.org"
                    className="pl-10"
                    error={errors.email}
                  />
                  <Mail className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                </div>

                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className="pl-10 pr-10"
                      error={errors.password}
                    />
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full gap-2">
                  {loading ? 'Signing in...' : 'Sign in'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/" className="text-sm font-medium text-blue-800 hover:text-blue-700">
                  Return to public site
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
