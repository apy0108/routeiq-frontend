import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MessageSquare,
  Users,
  Database,
  RefreshCw,
  Code2,
  Download,
  Search,
  Phone,
  Mail,
  Calendar,
  AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import SuccessMessage from '../components/SuccessMessage';
import ErrorMessage from '../components/ErrorMessage';
import { getBot, getLeads, trainText } from '../api';

export default function Dashboard() {
  const { botId } = useParams();
  const [bot, setBot] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('leads'); // 'leads' | 'conversations' | 'sources'
  
  // Retrain modal state
  const [isRetrainModalOpen, setIsRetrainModalOpen] = useState(false);
  const [retrainText, setRetrainText] = useState('');
  const [retrainSuccess, setRetrainSuccess] = useState('');
  const [retrainError, setRetrainError] = useState('');
  const [isRetraining, setIsRetraining] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [botRes, leadsRes] = await Promise.allSettled([
          getBot(botId),
          getLeads(botId)
        ]);

        if (botRes.status === 'fulfilled' && botRes.value) {
          setBot(botRes.value.bot || botRes.value);
        }
        if (leadsRes.status === 'fulfilled' && leadsRes.value) {
          const rawLeads = leadsRes.value.leads || leadsRes.value.data || (Array.isArray(leadsRes.value) ? leadsRes.value : []);
          setLeads(rawLeads);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    if (botId) loadDashboardData();
  }, [botId]);

  const handleRetrain = async (e) => {
    e.preventDefault();
    if (!retrainText.trim() || !botId) return;

    setIsRetraining(true);
    setRetrainSuccess('');
    setRetrainError('');

    try {
      await trainText(botId, retrainText.trim(), 'Dashboard Update');
      setRetrainSuccess('Knowledge base updated successfully!');
      setRetrainText('');

      // Refresh bot details
      const refreshed = await getBot(botId);
      if (refreshed?.bot || refreshed) {
        setBot(refreshed.bot || refreshed);
      }
      setTimeout(() => {
        setIsRetrainModalOpen(false);
        setRetrainSuccess('');
      }, 2000);
    } catch (e) {
      setRetrainError(e.message || 'Failed to update knowledge base.');
    } finally {
      setIsRetraining(false);
    }
  };

  const handleExportCSV = () => {
    if (!leads || leads.length === 0) return;
    const headers = ['Name', 'Phone', 'Email', 'Date', 'Status'];
    const rows = leads.map(l => [
      l.name || '',
      l.phone || '',
      l.email || '',
      l.date || l.createdAt || '',
      l.status || ''
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `chatiq-leads-${botId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = (leads || []).filter(l => {
    const name = l.name || '';
    const email = l.email || '';
    const phone = l.phone || '';
    const q = searchQuery.toLowerCase();
    return name.toLowerCase().includes(q) || email.toLowerCase().includes(q) || phone.includes(q);
  });

  const chunksCount = bot?.chunksCount || bot?.chunks || 0;
  const messagesCount = bot?.messagesCount || bot?.messages || 0;
  const leadsCount = leads?.length || bot?.leadsCount || 0;
  const recentChats = bot?.recentChats || bot?.conversations || [];
  const sources = bot?.sources || [];

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" message="Loading dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar showCreateButton={true} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {bot?.name || 'Chatbot Dashboard'}
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active
              </span>
            </div>
            <p className="text-xs text-gray-500 font-mono">
              ID: {botId}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRetrainModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retrain Knowledge</span>
            </button>

            <Link
              to={`/embed/${botId}`}
              className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-gray-500" />
              <span>Embed Code</span>
            </Link>
          </div>
        </div>

        {/* Stats 3-Card Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Knowledge Chunks
              </span>
              <div className="text-2xl font-bold text-gray-900">
                {chunksCount}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Database className="w-5 h-5" />
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Messages Handled
              </span>
              <div className="text-2xl font-bold text-gray-900">
                {messagesCount}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leads Captured
              </span>
              <div className="text-2xl font-bold text-gray-900">
                {leadsCount}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'leads' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>Leads ({leads.length})</span>
            {activeTab === 'leads' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('conversations')}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'conversations' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>Conversations</span>
            {activeTab === 'conversations' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('sources')}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'sources' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>Knowledge Sources</span>
            {activeTab === 'sources' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600" />
            )}
          </button>
        </div>

        {/* TAB 1: LEADS TABLE */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search leads..."
                  className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-3.5 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600"
                />
              </div>

              {leads.length > 0 && (
                <button
                  onClick={handleExportCSV}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              )}
            </div>

            {/* Table or Empty State */}
            {filteredLeads.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-semibold uppercase tracking-wider">
                      <th className="p-3.5">Name</th>
                      <th className="p-3.5">Phone</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-700">
                    {filteredLeads.map((lead, idx) => (
                      <tr key={lead.id || idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-3.5 font-medium text-gray-900">
                          {lead.name || 'Anonymous'}
                        </td>
                        <td className="p-3.5">
                          {lead.phone || '—'}
                        </td>
                        <td className="p-3.5">
                          {lead.email || '—'}
                        </td>
                        <td className="p-3.5 text-gray-500">
                          {lead.date || lead.createdAt || '—'}
                        </td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            {lead.status || 'New'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <Users className="w-8 h-8 text-gray-400 mx-auto" />
                <h4 className="text-sm font-semibold text-gray-900">No leads yet</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Leads will appear here when visitors submit their contact info through your chat widget.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RECENT CONVERSATIONS */}
        {activeTab === 'conversations' && (
          <div className="space-y-3">
            {recentChats.length > 0 ? (
              recentChats.map((chat, idx) => (
                <div
                  key={chat.id || idx}
                  className="p-4 rounded-lg bg-white border border-gray-200 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900">
                        {chat.user || `Visitor #${idx + 1}`}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">{chat.preview || chat.message || ''}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono">{chat.time || ''}</span>
                </div>
              ))
            ) : (
              <div className="p-12 text-center bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <MessageSquare className="w-8 h-8 text-gray-400 mx-auto" />
                <h4 className="text-sm font-semibold text-gray-900">No conversations recorded yet</h4>
                <p className="text-xs text-gray-500">
                  Chat logs will appear here as users interact with your chatbot.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: KNOWLEDGE SOURCES */}
        {activeTab === 'sources' && (
          <div className="space-y-3">
            {sources.length > 0 ? (
              sources.map((src, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-white border border-gray-200 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900">{src.name || 'Source'}</h4>
                      <span className="text-[10px] text-gray-400 capitalize">{src.type || 'Web'} source</span>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                    {src.chunks || 0} Chunks
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <Database className="w-8 h-8 text-gray-400 mx-auto" />
                <h4 className="text-sm font-semibold text-gray-900">Knowledge sources</h4>
                <p className="text-xs text-gray-500">
                  Total indexed chunks: {chunksCount}
                </p>
              </div>
            )}
          </div>
        )}

        {/* RETRAIN KNOWLEDGE MODAL */}
        {isRetrainModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md w-full space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-indigo-600" />
                  <span>Retrain Knowledge</span>
                </h3>
                <button
                  onClick={() => setIsRetrainModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-sm"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-gray-600">
                Enter additional information, FAQs, or updated details to append to your bot's knowledge base.
              </p>

              <form onSubmit={handleRetrain} className="space-y-3">
                <textarea
                  rows={4}
                  value={retrainText}
                  onChange={(e) => setRetrainText(e.target.value)}
                  placeholder="Enter updated information..."
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600"
                />

                {retrainError && <ErrorMessage message={retrainError} />}
                {retrainSuccess && <SuccessMessage message={retrainSuccess} />}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRetrainModalOpen(false)}
                    className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!retrainText.trim() || isRetraining}
                    className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                  >
                    {isRetraining && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>Update Knowledge</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
