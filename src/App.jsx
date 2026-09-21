import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreateWizard from './pages/CreateWizard';
import EmbedSuccess from './pages/EmbedSuccess';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<CreateWizard />} />
        <Route path="/embed/:botId" element={<EmbedSuccess />} />
        <Route path="/dashboard/:botId" element={<Dashboard />} />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
