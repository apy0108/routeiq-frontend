import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  BarChart2,
  PlusCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CodeBlock from '../components/CodeBlock';
import ChatWidgetPreview from '../components/ChatWidgetPreview';
import LoadingSpinner from '../components/LoadingSpinner';
import { getBot } from '../api';

export default function EmbedSuccess() {
  const { botId } = useParams();
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePlatformTab, setActivePlatformTab] = useState('wordpress');

  useEffect(() => {
    async function loadBotData() {
      try {
        const data = await getBot(botId);
        if (data?.bot) {
          setBot(data.bot);
        } else if (data) {
          setBot(data);
        }
      } catch (err) {
        // Handled silently
      } finally {
        setLoading(false);
      }
    }
    if (botId) loadBotData();
  }, [botId]);

  // Exact script tag requirement
  const scriptTagCode = `<script src="http://161.118.169.58:3000/widget/widget.js" data-bot-id="${botId}" async></script>`;

  const platformGuides = {
    wordpress: {
      name: 'WordPress',
      steps: [
        'Install the "Insert Headers and Footers" plugin from WordPress plugins.',
        'Go to Settings → Insert Headers and Footers.',
        'Paste the code snippet into the "Footer" section.',
        'Click Save Changes.'
      ]
    },
    wix: {
      name: 'Wix',
      steps: [
        'Go to your Wix site dashboard → Settings → Custom Code.',
        'Click "+ Add Custom Code".',
        'Paste the script code into the code box and select "Body - end".',
        'Click Apply.'
      ]
    },
    shopify: {
      name: 'Shopify',
      steps: [
        'In your Shopify admin, go to Online Store → Themes.',
        'Click Actions (three dots) → Edit code.',
        'Open the theme.liquid file.',
        'Paste the script tag directly before the closing </body> tag and click Save.'
      ]
    },
    html: {
      name: 'HTML',
      steps: [
        'Open your website HTML template in your code editor.',
        'Paste the script snippet immediately before the closing </body> tag.',
        'Save and publish your updated webpage.'
      ]
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" message="Loading bot details..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar showCreateButton={false} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Success Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ready for Deployment</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Your chatbot is ready!
          </h1>

          <p className="text-sm text-gray-600">
            Test your live bot below and copy the embed code to add it to your website.
          </p>
        </div>

        {/* Section 1 & Section 2 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Section 1: Test It Live Widget */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-sm font-semibold text-gray-900">
              Test It Live
            </div>

            <ChatWidgetPreview
              botName={bot?.name || 'ChatIQ Bot'}
              welcomeMessage={bot?.welcomeMessage || 'Hello! How can I help you today?'}
              primaryColor={bot?.primaryColor || '#4f46e5'}
              position={bot?.position || 'bottom-right'}
              botId={botId}
            />
          </div>

          {/* Section 2 & 3: Embed Code & Platform Guides */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Section 2: Embed Code */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-900">
                Add to Your Website
              </div>
              <p className="text-xs text-gray-600">
                Copy and paste this script tag into your website HTML:
              </p>

              <CodeBlock
                code={scriptTagCode}
                title="Embed Script"
              />
            </div>

            {/* Section 3: Platform Guides */}
            <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="text-sm font-semibold text-gray-900">
                Platform Guides
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-b border-gray-200 pb-2">
                {Object.keys(platformGuides).map((key) => {
                  const guide = platformGuides[key];
                  const isActive = activePlatformTab === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActivePlatformTab(key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {guide.name}
                    </button>
                  );
                })}
              </div>

              {/* Steps */}
              <ol className="space-y-2.5 pt-1">
                {platformGuides[activePlatformTab].steps.map((stepText, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold flex items-center justify-center shrink-0 text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{stepText}</span>
                  </li>
                ))}
              </ol>
            </div>

          </div>

        </div>

        {/* Section 4: Manage Your Bot */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <h3 className="text-base font-semibold text-gray-900">
              Manage Your Chatbot
            </h3>
            <p className="text-xs text-gray-500">
              View captured leads and manage your bot settings from the dashboard.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/dashboard/${botId}`}
              className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>View Leads & Dashboard</span>
            </Link>

            <Link
              to="/create"
              className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Another Bot</span>
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
