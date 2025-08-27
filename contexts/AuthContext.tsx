import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { User, AuthContextType } from '../types';
import { useToast } from './ToastContext';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://127.0.0.1:5000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    // Comprueba si hay una sesión de usuario en localStorage
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error al parsear el usuario desde localStorage", error);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null); // Limpiar error anterior
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, contraseña: password }),
      });

      if (!response.ok) {
        let errorMsg = 'Usuario no registrado o credenciales inválidas';
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMsg = errorData.error;
          }
        } catch (e) {
          // Si no es JSON, ignora
        }
        setError(errorMsg); // Establecer el nuevo error
        return; 
      }

      const userData: User = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      addToast(`¡Bienvenido, ${userData.nombre_usuario || userData.username || ''}!`, 'success');
    } catch (err) {
        // Captura de errores de red u otros imprevistos
        setError('Se produjo un error de red. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const register = useCallback(async (username: string, email: string, password: string, company_name: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_usuario: username, correo: email, contraseña: password, nombre_empresa: company_name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'El registro falló');
      }

      const newUser: User = await response.json();
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      addToast('¡Registro exitoso! Revisa tu correo para activar tu cuenta.', 'success');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    setError(null);
  }, []);

  const value = { user, loading, login, register, logout, error, clearError };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
