import React from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  FileText,
  Code2,
  ArrowRight,
  Check,
  X,
  MessageSquare
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LandingPage() {
  const comparisonData = [
    {
      feature: 'Setup Time',
      tidio: '15 - 30 minutes',
      chatbase: '5 - 10 minutes',
      chatiq: 'Under 1 minute',
    },
    {
      feature: 'Website Scanner',
      tidio: 'Limited',
      chatbase: 'Supported',
      chatiq: 'Automatic 1-Click Scan',
    },
    {
      feature: 'PDF & Document Upload',
      tidio: 'Not available',
      chatbase: 'Supported',
      chatiq: 'Unlimited Documents',
    },
    {
      feature: 'Direct WhatsApp Handoff',
      tidio: 'Add-on ($)',
      chatbase: 'Not available',
      chatiq: 'Built-in Support',
    },
    {
      feature: 'Platform Compatibility',
      tidio: 'Limited plugins',
      chatbase: 'Script tag',
      chatiq: 'WordPress, Wix, Shopify, HTML',
    },
    {
      feature: 'Custom AI Theming',
      tidio: 'Basic',
      chatbase: 'Standard',
      chatiq: 'Full Theme & Position Control',
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar showCreateButton={true} />

      {/* Hero Section */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28 border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
            <span>Next-Generation AI Chatbot Builder</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Turn Any Website Into a Smart Chatbot
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            AI-powered chatbots trained on your website. No technical skills needed.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <span>Create Your Chatbot</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center border border-gray-300 text-gray-700 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              <span>See Demo</span>
            </a>
          </div>

        </div>
      </section>

      {/* Features Section (3 columns) */}
      <section id="features" className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Features built for speed and simplicity
            </h2>
            <p className="text-base text-gray-600">
              Connect your data sources in seconds and deploy a customized chatbot on any web platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Any Website
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Paste your URL. We read your entire site automatically and structure your content for instant answering.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                PDF Support
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Upload menus, catalogs, brochures. Bot knows it all. Simply drop files to expand your assistant's knowledge base.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Embed Anywhere
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                One script tag. Works on WordPress, Wix, Shopify, HTML. Lightweight snippet loads smoothly without affecting page speed.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works (3 steps numbered) */}
      <section id="how-it-works" className="py-20 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              How it works
            </h2>
            <p className="text-base text-gray-600">
              Launch a fully trained chatbot in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-6 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                1
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                Create your chatbot
              </h3>
              <p className="text-xs text-indigo-600 font-medium">30 seconds</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Choose your business type, assign a bot name, and configure your welcome message.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                2
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                Train on your content
              </h3>
              <p className="text-indigo-600 text-xs font-medium">Automatic</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Scan your website URL or upload PDF documents. Our system vectorizes the content automatically.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                3
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                Embed on your website
              </h3>
              <p className="text-indigo-600 text-xs font-medium">Copy-paste</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Copy your customized embed code and add it to your website header or footer.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Competitor Comparison Table */}
      <section id="comparison" className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Platform Comparison
            </h2>
            <p className="text-base text-gray-600">
              See how ChatIQ compares with traditional alternatives.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="p-4 font-semibold text-gray-900">Feature</th>
                  <th className="p-4 font-semibold text-gray-600">Tidio</th>
                  <th className="p-4 font-semibold text-gray-600">Chatbase</th>
                  <th className="p-4 font-bold text-indigo-600 bg-indigo-50/50 border-l border-r border-indigo-100">
                    ChatIQ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">
                      {row.feature}
                    </td>
                    <td className="p-4 text-gray-600">
                      {row.tidio}
                    </td>
                    <td className="p-4 text-gray-600">
                      {row.chatbase}
                    </td>
                    <td className="p-4 font-semibold text-gray-900 bg-indigo-50/30 border-l border-r border-indigo-100">
                      <div className="flex items-center gap-2 text-indigo-700">
                        <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>{row.chatiq}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
