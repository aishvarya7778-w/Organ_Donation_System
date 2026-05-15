import { useState } from 'react';
import { Heart, Upload, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import API from '../services/api';

const initialFormData = {
  fullName: '',
  age: '',
  bloodGroup: '',
  organType: '',
  organHealthScore: '',
  city: '',
  availabilityStatus: '',
  reportFile: null,
};

export function DonorRegistration() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
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
    const requiredFields = [
      'fullName',
      'age',
      'bloodGroup',
      'organType',
      'organHealthScore',
      'city',
      'availabilityStatus',
    ];

    requiredFields.forEach((field) => {
      if (!String(formData[field]).trim()) {
        nextErrors[field] = 'This field is required';
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!validateForm()) {
      setMessage('Please fill in all required fields.');
      setMessageType('error');
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = new FormData();
      payload.append('fullName', formData.fullName);
      payload.append('age', formData.age);
      payload.append('bloodGroup', formData.bloodGroup);
      payload.append('organType', formData.organType);
      payload.append('organHealthScore', formData.organHealthScore);
      payload.append('city', formData.city);
      payload.append('availabilityStatus', formData.availabilityStatus);

      if (formData.reportFile) {
        payload.append('reportFile', formData.reportFile);
      }

      const response = await API.post('/donor/register', payload);
      const donor = response.data?.data?.donor || response.data?.data;

      console.log('Registered donor:', donor);
      setMessage('Donor registered successfully.');
      setMessageType('success');
      setFormData(initialFormData);
      setErrors({});
      setSubmitted(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to register donor. Please try again.';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterAnother = () => {
    setSubmitted(false);
    setMessage('');
    setMessageType('');
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-8">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Registration Complete</h2>
        <p className="text-xl text-gray-600 mb-8">
          Thank you for registering as an organ donor. Your willingness to help others is truly inspiring.
        </p>
        {message && <p className="text-green-700 mb-6">{message}</p>}
        <Button onClick={handleRegisterAnother} variant="outline">
          Register Another Donor
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Heart className="h-12 w-12 text-blue-800 mx-auto mb-4" fill="currentColor" />
          <h1 className="text-3xl font-bold text-gray-900">Donor Registration</h1>
          <p className="mt-2 text-gray-600">Please provide accurate medical and personal information.</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Personal & Medical Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {message && (
                <div
                  className={`rounded-md px-4 py-3 text-sm ${
                    messageType === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  error={errors.fullName}
                  required
                />
                <Input
                  label="Age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  type="number"
                  min="18"
                  max="100"
                  placeholder="30"
                  error={errors.age}
                  required
                />
                
                <Select
                  label="Blood Group"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  error={errors.bloodGroup}
                  required
                  options={[
                    { value: 'A+', label: 'A+' },
                    { value: 'A-', label: 'A-' },
                    { value: 'B+', label: 'B+' },
                    { value: 'B-', label: 'B-' },
                    { value: 'AB+', label: 'AB+' },
                    { value: 'AB-', label: 'AB-' },
                    { value: 'O+', label: 'O+' },
                    { value: 'O-', label: 'O-' },
                  ]}
                />
                
                <Select
                  label="Organ Type"
                  name="organType"
                  value={formData.organType}
                  onChange={handleChange}
                  error={errors.organType}
                  required
                  options={[
                    { value: 'kidney', label: 'Kidney' },
                    { value: 'liver', label: 'Liver' },
                    { value: 'heart', label: 'Heart' },
                    { value: 'lungs', label: 'Lungs' },
                    { value: 'corneas', label: 'Corneas' },
                  ]}
                />

                <Input
                  label="Organ Health Score (1-100)"
                  name="organHealthScore"
                  value={formData.organHealthScore}
                  onChange={handleChange}
                  type="number"
                  min="1"
                  max="100"
                  placeholder="95"
                  error={errors.organHealthScore}
                  required
                />
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="New York"
                  error={errors.city}
                  required
                />
                
                <Select
                  label="Availability Status"
                  name="availabilityStatus"
                  value={formData.availabilityStatus}
                  onChange={handleChange}
                  error={errors.availabilityStatus}
                  required
                  options={[
                    { value: 'available', label: 'Available immediately' },
                    { value: 'unavailable', label: 'Currently unavailable' },
                  ]}
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Medical Report</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors bg-gray-50">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-800 hover:text-blue-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 px-2 py-1">
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="reportFile"
                          type="file"
                          accept=".pdf,image/*"
                          onChange={handleChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1 pt-1">or drag and drop</p>
                    </div>
                    {formData.reportFile && (
                      <p className="text-xs text-blue-800">{formData.reportFile.name}</p>
                    )}
                    <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
