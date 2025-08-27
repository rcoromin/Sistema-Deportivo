
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';
import ConfirmEmailPage from './components/ConfirmEmailPage';
import UserAdminPage from './components/admin/UserAdminPage';
import UserProfile from './components/UserProfile';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage onToggleForm={() => {}} />} />
      <Route path="/register" element={<RegisterPage onToggleForm={() => {}} />} />
      <Route path="/confirmar/:token" element={<ConfirmEmailPage />} />
  <Route path="/admin/usuarios" element={<UserAdminPage />} />
  <Route path="/perfil" element={<UserProfile />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;