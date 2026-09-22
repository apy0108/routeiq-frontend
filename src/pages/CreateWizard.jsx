import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  Globe,
  FileText,
  Check,
  Upload,
  AlertCircle,
  HelpCircle,
  Palette,
  Layout,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Navbar from '../components/Navbar';
import ChatWidgetPreview from '../components/ChatWidgetPreview';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import { BUSINESS_TYPES, DEFAULT_BOT_COLORS } from '../config';
import { createBot, updateBot, trainUrl, trainPdf, trainText, getTrainingStatus } from '../api';

export default function CreateWizard() {
  const navigate = useNavigate();

  // Wizard Step State (1, 2, 3)
  const [currentStep, setCurrentStep] = useState(1);
  const [botId, setBotId] = useState(null); // Real backend UUID only

  // Step 1: About Your Bot
  const [botName, setBotName] = useState('My Assistant');
  const [businessType, setBusinessType] = useState('general');
  const [welcomeMessage, setWelcomeMessage] = useState(
    'Hello! Welcome to our website. How can I help you with our services and pricing today?'
  );
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isCreatingBot, setIsCreatingBot] = useState(false);
  const [step1Error, setStep1Error] = useState('');

  // Step 2: Content Training
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isStartingScan, setIsStartingScan] = useState(false);
  const [trainingStatus, setTrainingStatus] = useState('idle'); // 'idle' | 'scanning' | 'processing' | 'ready' | 'failed'
  const [trainingStatusText, setTrainingStatusText] = useState('');
  const [chunksFound, setChunksFound] = useState(0);
  const [step2Error, setStep2Error] = useState('');
  const pollIntervalRef = useRef(null);

  // Optional PDF / Manual
  const [isPdfSectionOpen, setIsPdfSectionOpen] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState('');
  const [pdfError, setPdfError] = useState('');

  const [isManualSectionOpen, setIsManualSectionOpen] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualText, setManualText] = useState('');
  const [isSavingManual, setIsSavingManual] = useState(false);
  const [manualSuccess, setManualSuccess] = useState('');

  // Step 3: Customize
  const [primaryColor, setPrimaryColor] = useState('#4f46e5');
  const [position, setPosition] = useState('bottom-right');
  const [isLaunching, setIsLaunching] = useState(false);
  const [step3Error, setStep3Error] = useState('');

  // Clean up polling interval on unmount or step change
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, []);

  // Check if botId is available on Step 2
  useEffect(() => {
    if (currentStep === 2 && !botId) {
      setStep2Error('Bot creation failed, please go back to Step 1');
    }
  }, [currentStep, botId]);

  // Handle Business Type Selection & Auto-fill Welcome Message
  const handleBusinessTypeSelect = (type) => {
    setBusinessType(type.id);
    setWelcomeMessage(type.defaultWelcome);
  };

  // STEP 1: CREATE BOT (Calls POST /api/bots)
  const handleCreateBotStep1 = async (e) => {
    e?.preventDefault();
    if (!botName.trim()) {
      setStep1Error('Bot name is required.');
      return;
    }
    if (!welcomeMessage.trim()) {
      setStep1Error('Welcome message is required.');
      return;
    }

    setIsCreatingBot(true);
    setStep1Error('');

    try {
      const response = await createBot({
        name: botName.trim(),
        businessType,
        welcomeMessage: welcomeMessage.trim(),
        whatsappNumber: whatsappNumber.trim()
      });

      const newBotId = response.botId || response.id || response.bot?.id;
      if (!newBotId) {
        throw new Error('Server did not return a valid bot ID.');
      }

      setBotId(newBotId);
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setStep1Error(err.message || 'Failed to create chatbot. Please check your backend connection.');
    } finally {
      setIsCreatingBot(false);
    }
  };

  // STEP 2: START URL TRAINING & POLL STATUS
const startPolling = (targetBotId) => {
  if (!targetBotId) {
    setStep2Error('Bot creation failed, please go back to Step 1');
    setTrainingStatus('failed');
    setTrainingStatusText('Bot creation failed, please go back to Step 1');
    return;
  }

  if (pollIntervalRef.current) {
    clearInterval(pollIntervalRef.current);
    pollIntervalRef.current = null;
  }

  let consecutiveErrors = 0;

  const fetchStatus = async () => {
    try {
      const response = await getTrainingStatus(targetBotId);
      consecutiveErrors = 0; // reset on success
      
      if (response && response.status === 'ready') {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
        setTrainingStatus('ready');
        const count = response.chunkCount ?? 0;
        setChunksFound(count);
        setTrainingStatusText(`Done! Found ${count} chunks`);
      } else if (response && (response.status === 'failed' || response.status === 'error')) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
        setTrainingStatus('failed');
        const errorMsg = response.errorMessage || response.error || 'Training failed.';
        setTrainingStatusText(errorMsg);
        setStep2Error(errorMsg);
      } else {
        // Still training or pending — keep polling
        setTrainingStatus('training');
        setTrainingStatusText('Scanning website...');
      }
    } catch (pollErr) {
      consecutiveErrors++;
      console.error(`Poll error #${consecutiveErrors}:`, pollErr.message);
      if (consecutiveErrors >= 4) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
        setTrainingStatus('failed');
        setTrainingStatusText('Cannot connect to server. Check your connection.');
        setStep2Error(`Connection failed: ${pollErr.message}. Make sure the backend is running.`);
      }
    }
  };

  fetchStatus(); // run immediately
  pollIntervalRef.current = setInterval(fetchStatus, 3000);

  // Safety timeout after 5 minutes
  setTimeout(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
      setTrainingStatus('failed');
      setTrainingStatusText('Timed out after 5 minutes.');
      setStep2Error('Training timed out. Try again with fewer pages.');
    }
  }, 300000);
};

  const handleStartUrlScan = async (e) => {
    e?.preventDefault();
    if (!botId) {
      setStep2Error('Bot creation failed, please go back to Step 1');
      return;
    }
    if (!websiteUrl.trim()) return;

    let formattedUrl = websiteUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    setIsStartingScan(true);
    setStep2Error('');
    setTrainingStatus('training');
    setTrainingStatusText('Scanning website...');

    try {
      await trainUrl(botId, formattedUrl);
      setIsStartingScan(false);

      // Start Polling GET /api/train/{botId}/status every 3 seconds
      startPolling(botId);
    } catch (err) {
      setIsStartingScan(false);
      setTrainingStatus('failed');
      const errorMsg = err.message || 'Failed to start website scan.';
      setTrainingStatusText(errorMsg);
      setStep2Error(errorMsg);
    }
  };

  // Step 2: Upload PDF
  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !botId) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setPdfError('Please upload a .pdf file.');
      return;
    }

    setIsUploadingPdf(true);
    setPdfError('');
    setPdfSuccess('');

    try {
      const res = await trainPdf(botId, file);
      const chunks = res.chunks || res.chunksFound || '';
      setPdfSuccess(`PDF processed successfully! ${chunks ? `(${chunks} chunks)` : ''}`);
      setTrainingStatus('ready');
    } catch (err) {
      setPdfError(err.message || 'PDF upload failed.');
    } finally {
      setIsUploadingPdf(false);
    }
  };

  // Step 2: Manual Text
  const handleManualTextSubmit = async (e) => {
    e.preventDefault();
    if (!manualText.trim() || !botId) return;

    setIsSavingManual(true);
    setManualSuccess('');

    try {
      await trainText(botId, manualText.trim(), manualTitle.trim() || 'Custom Notes');
      setManualSuccess('Knowledge added successfully.');
      setManualText('');
      setManualTitle('');
      setTrainingStatus('ready');
    } catch (err) {
      setStep2Error(err.message || 'Failed to save notes.');
    } finally {
      setIsSavingManual(false);
    }
  };

  // STEP 3: LAUNCH CHATBOT (Calls PUT /api/bots/:botId)
  const handleLaunchBot = async () => {
    if (!botId) return;

    setIsLaunching(true);
    setStep3Error('');

    try {
      await updateBot(botId, {
        primaryColor,
        position,
        name: botName,
        welcomeMessage
      });

      // Navigate to Embed page with real UUID
      navigate(`/embed/${botId}`);
    } catch (err) {
      // If PUT endpoint isn't supported on backend, still navigate cleanly with real ID
      navigate(`/embed/${botId}`);
    } finally {
      setIsLaunching(false);
    }
  };

  const isNextDisabledInStep2 = trainingStatus !== 'ready';

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar showCreateButton={false} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Progress Tracker */}
        <div className="mb-10">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">

            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${currentStep === 1
                    ? 'bg-indigo-600 text-white'
                    : currentStep > 1
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
              >
                {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
              </div>
              <span className={`text-sm font-medium ${currentStep === 1 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                Setup
              </span>
            </div>

            <div className="flex-1 mx-4 h-px bg-gray-200" />

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${currentStep === 2
                    ? 'bg-indigo-600 text-white'
                    : currentStep > 2
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
              >
                {currentStep > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
              </div>
              <span className={`text-sm font-medium ${currentStep === 2 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                Train
              </span>
            </div>

            <div className="flex-1 mx-4 h-px bg-gray-200" />

            {/* Step 3 */}
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${currentStep === 3
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-400'
                  }`}
              >
                3
              </div>
              <span className={`text-sm font-medium ${currentStep === 3 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                Customize
              </span>
            </div>

          </div>
        </div>

        {/* STEP 1: SETUP */}
        {currentStep === 1 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">
                About Your Bot
              </h1>
              <p className="text-sm text-gray-600">
                Configure your chatbot profile and category.
              </p>
            </div>

            {step1Error && (
              <ErrorMessage message={step1Error} onDismiss={() => setStep1Error('')} />
            )}

            <form onSubmit={handleCreateBotStep1} className="space-y-6 bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">

              {/* Bot Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-900">
                  Bot Name
                </label>
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  placeholder="e.g. Sales Assistant, Support Bot"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 transition-colors"
                />
              </div>

              {/* Business Type Grid */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Business Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {BUSINESS_TYPES.map((type) => {
                    const isSelected = businessType === type.id;
                    return (
                      <button
                        type="button"
                        key={type.id}
                        onClick={() => handleBusinessTypeSelect(type)}
                        className={`p-3.5 rounded-lg text-left border transition-colors ${isSelected
                            ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                          }`}
                      >
                        <div className="text-sm font-semibold text-gray-900">
                          {type.title}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {type.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Welcome Message */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-900">
                  Welcome Message
                </label>
                <textarea
                  rows={3}
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 transition-colors"
                />
              </div>

              {/* WhatsApp Number (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-900">
                  WhatsApp Number <span className="text-xs font-normal text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 transition-colors"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isCreatingBot}
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {isCreatingBot ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating bot...</span>
                    </>
                  ) : (
                    <>
                      <span>Next: Train Content</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* STEP 2: TRAIN */}
        {currentStep === 2 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Train Your Bot
              </h1>
              <p className="text-sm text-gray-600">
                Enter your website URL to scan pages and generate knowledge chunks.
              </p>
            </div>

            {step2Error && (
              <ErrorMessage message={step2Error} onDismiss={() => setStep2Error('')} />
            )}

            <div className="space-y-4">

              {/* Section A: Website URL */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <span>Scan Website URL</span>
                </div>

                <form onSubmit={handleStartUrlScan} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="flex-1 bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!websiteUrl.trim() || isStartingScan || trainingStatus === 'training' || trainingStatus === 'scanning' || trainingStatus === 'processing'}
                      className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors shrink-0 shadow-sm"
                    >
                      {isStartingScan ? 'Starting...' : 'Scan Website'}
                    </button>
                  </div>

                  {/* Status Indicator */}
                  {trainingStatus !== 'idle' && (
                    <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-gray-700 font-medium">
                        {(trainingStatus === 'training' || trainingStatus === 'scanning' || trainingStatus === 'processing') && (
                          <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                        )}
                        {trainingStatus === 'ready' && (
                          <Check className="w-4 h-4 text-emerald-600" />
                        )}
                        {trainingStatus === 'failed' && (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span>{trainingStatusText}</span>
                      </div>
                      {trainingStatus === 'ready' && (
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Complete
                        </span>
                      )}
                    </div>
                  )}
                </form>
              </div>

              {/* Section B: Upload PDF (Collapsible) */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setIsPdfSectionOpen(!isPdfSectionOpen)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span>Upload PDF Documents</span>
                    <span className="text-xs font-normal text-gray-500">(Optional)</span>
                  </div>
                  {isPdfSectionOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>

                {isPdfSectionOpen && (
                  <div className="p-4 pt-0 border-t border-gray-100 space-y-3">
                    <label className="border border-dashed border-gray-300 hover:border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100/60 transition-colors">
                      <Upload className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-xs font-medium text-gray-700">Click to select PDF</span>
                      <span className="text-[11px] text-gray-400 mt-0.5">Max 10MB</span>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfUpload}
                        className="hidden"
                      />
                    </label>

                    {isUploadingPdf && <LoadingSpinner size="sm" message="Uploading and processing PDF..." />}
                    {pdfError && <ErrorMessage message={pdfError} onDismiss={() => setPdfError('')} />}
                    {pdfSuccess && <SuccessMessage message={pdfSuccess} onDismiss={() => setPdfSuccess('')} />}
                  </div>
                )}
              </div>

              {/* Section C: Add Manually (Collapsible) */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setIsManualSectionOpen(!isManualSectionOpen)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span>Add Knowledge Manually</span>
                    <span className="text-xs font-normal text-gray-500">(Optional)</span>
                  </div>
                  {isManualSectionOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>

                {isManualSectionOpen && (
                  <form onSubmit={handleManualTextSubmit} className="p-4 pt-0 border-t border-gray-100 space-y-3">
                    <input
                      type="text"
                      value={manualTitle}
                      onChange={(e) => setManualTitle(e.target.value)}
                      placeholder="Title (e.g. Return Policy, Store Hours)"
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600"
                    />
                    <textarea
                      rows={3}
                      value={manualText}
                      onChange={(e) => setManualText(e.target.value)}
                      placeholder="Enter information or answers..."
                      className="w-full bg-white border border-gray-300 rounded-lg p-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!manualText.trim() || isSavingManual}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-gray-800 disabled:opacity-40 transition-colors"
                      >
                        {isSavingManual ? 'Saving...' : 'Add Knowledge'}
                      </button>
                    </div>
                    {manualSuccess && <SuccessMessage message={manualSuccess} onDismiss={() => setManualSuccess('')} />}
                  </form>
                )}
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-xs text-gray-500 hover:text-gray-800 underline"
                  >
                    Skip for now
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    disabled={isNextDisabledInStep2}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <span>Next: Customize</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* STEP 3: CUSTOMIZE */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="space-y-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                Customize Widget & Live Preview
              </h1>
              <p className="text-sm text-gray-600">
                Select your theme color and widget placement.
              </p>
            </div>

            {step3Error && (
              <ErrorMessage message={step3Error} onDismiss={() => setStep3Error('')} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

              {/* Controls */}
              <div className="md:col-span-6 space-y-6 bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">

                {/* Color presets */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Theme Color
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {DEFAULT_BOT_COLORS.map((c) => {
                      const isSelected = primaryColor.toLowerCase() === c.hex.toLowerCase();
                      return (
                        <button
                          type="button"
                          key={c.hex}
                          onClick={() => setPrimaryColor(c.hex)}
                          title={c.name}
                          className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all ${isSelected ? 'ring-2 ring-offset-2 ring-gray-900' : 'opacity-85 hover:opacity-100'
                            }`}
                          style={{ backgroundColor: c.hex }}
                        >
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Position picker */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Placement
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPosition('bottom-right')}
                      className={`p-3.5 rounded-lg border text-left text-sm font-medium transition-colors ${position === 'bottom-right'
                          ? 'border-indigo-600 bg-indigo-50/40 text-indigo-900 ring-1 ring-indigo-600'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      Bottom Right
                    </button>

                    <button
                      type="button"
                      onClick={() => setPosition('bottom-left')}
                      className={`p-3.5 rounded-lg border text-left text-sm font-medium transition-colors ${position === 'bottom-left'
                          ? 'border-indigo-600 bg-indigo-50/40 text-indigo-900 ring-1 ring-indigo-600'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      Bottom Left
                    </button>
                  </div>
                </div>

                {/* Launch Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleLaunchBot}
                    disabled={isLaunching}
                    className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    {isLaunching ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving chatbot...</span>
                      </>
                    ) : (
                      <>
                        <span>Launch My Chatbot →</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" /> Back to Training
                  </button>
                </div>

              </div>

              {/* Live Preview */}
              <div className="md:col-span-6 flex flex-col items-center">
                <div className="w-full max-w-sm">
                  <div className="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Live Preview
                  </div>
                  <ChatWidgetPreview
                    botName={botName}
                    welcomeMessage={welcomeMessage}
                    primaryColor={primaryColor}
                    position={position}
                    botId={botId}
                  />
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
