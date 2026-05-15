import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LoginView } from './components/LoginView';
import { RegisterView } from './components/RegisterView';
import { ForgotPasswordView } from './components/ForgotPasswordView';
import { DashboardView } from './components/DashboardView';
import HomePage from './pages/HomePage';
import ServicesListingPage from './pages/ServicesListingPage';
import ServiceDetailPage from './components/home/ServiceDetailPage';
import MessagingPage from './pages/Messagingpage';
import ProviderDashboard from './pages/ProviderDashboard';
import { authApi } from './api/auth';
import ProfilePage from './pages/ProfilePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = authApi.getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/profile"   element={<ProfilePage />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/forgot-password" element={<ForgotPasswordView />} />

        <Route path="/services" element={<ServicesListingPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />

        <Route path="/dashboard" element={<ProtectedRoute><DashboardView /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><MessagingPage /></ProtectedRoute>} />
        <Route path="/provider" element={<ProtectedRoute><ProviderDashboard /></ProtectedRoute>} />

        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;