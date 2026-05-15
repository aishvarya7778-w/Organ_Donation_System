import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, Users, ArrowRight, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import { statisticsData } from '../data/mockData';

export function Home() {
  const stats = [
    { label: 'Total Donors', value: statisticsData.totalDonors, icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Active Patients', value: statisticsData.activePatients, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Successful Matches', value: statisticsData.successfulMatches, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Available Organs', value: statisticsData.availableOrgans, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const features = [
    {
      title: 'Smart Matching Algorithm',
      description: 'Our advanced system uses multiple medical data points to ensure the highest compatibility between donors and recipients.',
      icon: Activity,
    },
    {
      title: 'Secure & Confidential',
      description: 'All medical records and personal information are encrypted and handled with strict adherence to healthcare regulations.',
      icon: ShieldCheck,
    },
    {
      title: 'Real-time Updates',
      description: 'Get instant notifications on match status, urgency escalations, and system-wide organ availability.',
      icon: Clock,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-blue-50/50 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium text-sm mb-8">
            <Heart size={16} className="animate-pulse" />
            <span>Save a life today</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
            Smart Organ <br className="hidden md:block" />
            <span className="text-blue-800">Donation Matching</span>
          </h1>
          
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 mb-10">
            A state-of-the-art platform connecting donors with patients in need. 
            Our intelligent algorithm ensures fast, accurate, and life-saving matches.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register/donor"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-blue-800 rounded-xl hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Become a Donor
              <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
            </Link>
            <Link
              to="/register/recipient"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-blue-800 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all"
            >
              Request an Organ
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">System Impact</h2>
            <p className="mt-4 text-lg text-gray-500">Real-time statistics from our matching network.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
                <div className={`mx-auto h-16 w-16 flex items-center justify-center rounded-full ${stat.bg} mb-6`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <p className="text-4xl font-extrabold text-gray-900 mb-2">{stat.value.toLocaleString()}</p>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose LifeMatch?</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Our platform utilizes cutting-edge technology to streamline the organ donation process, reducing wait times and increasing success rates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 text-blue-800">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-800 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-6">
            Ready to make a difference?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of others in our mission to save lives. Register today.
          </p>
          <Link
            to="/register/donor"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-900 bg-white rounded-xl hover:bg-gray-50 transition-colors shadow-xl"
          >
            Register Now
          </Link>
        </div>
      </section>
    </div>
  );
}
