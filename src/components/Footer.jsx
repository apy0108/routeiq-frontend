import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50 text-gray-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-gray-200">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Chat<span className="text-indigo-600">IQ</span>
              </span>
            </div>
            
            <p className="text-sm text-gray-600 max-w-sm">
              AI-powered chatbots trained on your website. No technical skills needed.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Product</h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link to="/create" className="hover:text-gray-900 transition-colors">
                  Create Chatbot
                </Link>
              </li>
              <li>
                <a href="#features" className="hover:text-gray-900 transition-colors">
                  Website Scanner
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-gray-900 transition-colors">
                  How it works
                </a>
              </li>
            </ul>
          </div>

          {/* Platforms */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Integrations</h4>
            <ul className="space-y-1.5 text-sm text-gray-500">
              <li>WordPress</li>
              <li>Shopify</li>
              <li>Wix</li>
              <li>Custom HTML</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} ChatIQ. All rights reserved.</p>
          <p>Built for modern web teams and businesses.</p>
        </div>
      </div>
    </footer>
  );
}
