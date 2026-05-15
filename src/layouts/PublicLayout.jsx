import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { cn } from '../utils/cn';

export function PublicLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Register as Donor', path: '/register/donor' },
    { name: 'Request Organ', path: '/register/recipient' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-blue-800" fill="currentColor" />
              <span className="text-2xl font-bold tracking-tight text-gray-900">LifeMatch</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-blue-800",
                    location.pathname === link.path ? "text-blue-800" : "text-gray-600"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-4 ml-4 border-l border-gray-200 pl-8">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-blue-800 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-800 rounded-lg hover:bg-blue-900 transition-colors"
                >
                  Admin Portal
                </Link>
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    location.pathname === link.path
                      ? "bg-blue-50 text-blue-800"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-800"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-100 px-3 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-base font-medium text-gray-700 hover:text-blue-800"
                >
                  Log in
                </Link>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-base font-medium text-blue-800"
                >
                  Admin Portal
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-gray-400" />
            <span className="text-xl font-bold text-gray-400">LifeMatch</span>
          </div>
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Smart Organ Donation Matching System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
