import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, ArrowRight } from 'lucide-react';

export default function Navbar({ showCreateButton = true }) {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Chat<span className="text-indigo-600">IQ</span>
            </span>
          </Link>

          {/* Navigation Links & CTA */}
          <div className="flex items-center gap-6">
            {isLanding && (
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                <a href="#features" className="hover:text-gray-900 transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="hover:text-gray-900 transition-colors">
                  How it works
                </a>
                <a href="#comparison" className="hover:text-gray-900 transition-colors">
                  Comparison
                </a>
              </nav>
            )}

            {showCreateButton && (
              <Link
                to="/create"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <span>Create Chatbot</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
