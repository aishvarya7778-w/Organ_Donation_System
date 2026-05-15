import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, HeartPulse, LogIn } from 'lucide-react';
import API from '../services/api';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  age: '',
  bloodGroup: '',
  organType: '',
  organHealthScore: '',
  city: '',
  availabilityStatus: 'available',
};

export function DonorAuth({ mode = 'login' }) {
  const isRegister = mode === 'register';
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      setLoading(true);
      const payload = isRegister ? formData : { email: formData.email, password: formData.password };
      const response = await API.post(isRegister ? '/donor/register' : '/donor/login', payload);
      const token = response.data?.data?.token;
      const donor = response.data?.data?.donor;

      localStorage.setItem('donorToken', token);
      localStorage.setItem('donorUser', JSON.stringify(donor));
      setMessage({ type: 'success', text: isRegister ? 'Registration complete.' : 'Login successful.' });
      navigate('/donor/dashboard', { replace: true });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Request failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <HeartPulse className="h-8 w-8 text-blue-800" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">{isRegister ? 'Donor Registration' : 'Donor Login'}</h1>
          <p className="mt-2 text-gray-500">Access your donor application and match status.</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {message.text && (
            <div className={`mb-5 rounded-md border px-4 py-3 text-sm ${message.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {isRegister && <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />}
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <div className="relative">
              <Input label="Password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required />
              <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-9 text-gray-400">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {isRegister && (
              <>
                <Input label="Age" name="age" type="number" min="18" value={formData.age} onChange={handleChange} required />
                <Select label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((value) => ({ value, label: value }))} />
                <Select label="Organ Type" name="organType" value={formData.organType} onChange={handleChange} required options={['kidney', 'liver', 'heart', 'lungs', 'corneas'].map((value) => ({ value, label: value }))} />
                <Input label="Organ Health Score" name="organHealthScore" type="number" min="1" max="100" value={formData.organHealthScore} onChange={handleChange} required />
                <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
              </>
            )}
          </div>

          <Button type="submit" disabled={loading} className="mt-6 w-full gap-2">
            <LogIn className="h-4 w-4" />
            {loading ? 'Please wait...' : isRegister ? 'Create Donor Account' : 'Login'}
          </Button>

          <p className="mt-5 text-center text-sm text-gray-500">
            {isRegister ? 'Already registered?' : 'Need an account?'}{' '}
            <Link to={isRegister ? '/donor/login' : '/donor/register'} className="font-medium text-blue-800">
              {isRegister ? 'Login' : 'Register'}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
