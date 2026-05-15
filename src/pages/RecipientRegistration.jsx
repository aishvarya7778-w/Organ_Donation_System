import { useState } from 'react';
import { Users, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import API from '../services/api';

const initialFormData = {
  patientName: '',
  age: '',
  bloodGroup: '',
  requiredOrgan: '',
  urgencyLevel: '',
  requiredHealthThreshold: '',
  city: '',
};

export function RecipientRegistration() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    Object.entries(formData).forEach(([field, value]) => {
      if (!String(value).trim()) {
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
      const response = await API.post('/recipient/register', formData);
      const recipient = response.data?.data?.recipient || response.data?.data;

      console.log('Registered recipient:', recipient);
      setMessage('Recipient registered successfully.');
      setMessageType('success');
      setFormData(initialFormData);
      setErrors({});
      setSubmitted(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to register recipient. Please try again.';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAnother = () => {
    setSubmitted(false);
    setMessage('');
    setMessageType('');
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 mb-8">
          <CheckCircle className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Request Submitted</h2>
        <p className="text-xl text-gray-600 mb-8">
          Your organ request has been successfully added to our matching system. We will notify you immediately if a suitable match is found.
        </p>
        {message && <p className="text-blue-700 mb-6">{message}</p>}
        <Button onClick={handleSubmitAnother} variant="outline">
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Users className="h-8 w-8 text-blue-800" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Registration</h1>
          <p className="mt-2 text-gray-600">Register a patient for the organ transplant waiting list.</p>
        </div>

        <Card className="shadow-lg border-t-4 border-t-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-800" />
              Patient & Requirements
            </CardTitle>
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
                  label="Patient Name"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  error={errors.patientName}
                  required
                />
                <Input
                  label="Age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  max="120"
                  placeholder="45"
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
                  label="Required Organ"
                  name="requiredOrgan"
                  value={formData.requiredOrgan}
                  onChange={handleChange}
                  error={errors.requiredOrgan}
                  required
                  options={[
                    { value: 'kidney', label: 'Kidney' },
                    { value: 'liver', label: 'Liver' },
                    { value: 'heart', label: 'Heart' },
                    { value: 'lungs', label: 'Lungs' },
                    { value: 'corneas', label: 'Corneas' },
                  ]}
                />

                <Select
                  label="Urgency Level"
                  name="urgencyLevel"
                  value={formData.urgencyLevel}
                  onChange={handleChange}
                  error={errors.urgencyLevel}
                  required
                  options={[
                    { value: 'low', label: 'Low (Stable)' },
                    { value: 'medium', label: 'Medium (Monitoring)' },
                    { value: 'high', label: 'High (Needs soon)' },
                    { value: 'critical', label: 'Critical (Immediate)' },
                  ]}
                />
                
                <Input
                  label="Required Health Threshold (1-100)"
                  name="requiredHealthThreshold"
                  value={formData.requiredHealthThreshold}
                  onChange={handleChange}
                  type="number"
                  min="1"
                  max="100"
                  placeholder="80"
                  error={errors.requiredHealthThreshold}
                  required
                />
                
                <div className="md:col-span-2">
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Los Angeles"
                    error={errors.city}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-100">
                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Add to Waiting List'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
