// Componente LoginPage
// Renderiza el formulario de inicio de sesión, validando email y contraseña.
// Usa el contexto de autenticación para manejar el login y el contexto de tema para estilos.
// Permite alternar a la vista de registro.
import React, { useState, useEffect } from 'react'; // Importa React y el hook useState para manejar el estado del componente.
import { Link, useNavigate } from 'react-router-dom'; // Importa Link y useNavigate para navegación entre páginas.
import { useAuth } from '../contexts/AuthContext'; // Importa el hook useAuth para acceder al contexto de autenticación.
import { useTheme } from '../contexts/ThemeContext'; // Importa el hook useTheme para acceder al contexto del tema.
import Input from './Input'; // Importa el componente de campo de entrada reutilizable.
import Button from './Button'; // Importa el componente de botón reutilizable.

import { getBackgroundImage } from '../utils/themeUtils'; // Importa la función para obtener la imagen de fondo según el tema.

interface LoginPageProps {
  onToggleForm: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, user, error, clearError } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { colors } = theme;
  const backgroundImage = getBackgroundImage(theme);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      // Idealmente, el contexto también podría manejar este tipo de error de validación.
      // Por ahora, lo mantenemos local, pero el error de la API vendrá del contexto.
      return;
    }
    await login(email, password);
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-900 overflow-hidden p-4">
      <div className="absolute inset-0 z-0">
        <div
          style={{
            backgroundImage,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '100%',
          }}
        />
        <div className={`absolute inset-0 ${colors.background.overlay}`} />
      </div>
      <div className={`w-full max-w-md p-8 space-y-8 ${colors.background.form} rounded-2xl shadow-lg z-10`}>
        <div className="text-center">
          <h1 className={`text-3xl font-bold ${colors.text.header}`}>Iniciar Sesión</h1>
          <p className={`mt-2 text-sm ${colors.text.body}`}>Accede a tu cuenta</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="flex flex-col items-center text-center bg-red-900/80 text-red-100 p-4 rounded-lg mb-4 border border-red-700 shadow-lg">
              <span className="font-bold text-lg mb-2">{error}</span>
              <button
                onClick={clearError}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-200"
              >
                Cerrar
              </button>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-4">
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Button type="submit" disabled={loading} fullWidth={true}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </form>
        <p className={`mt-4 text-sm text-center ${colors.text.body}`}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className={`font-medium ${colors.text.link} ${colors.text.linkHover} hover:underline transition-colors duration-200`}>
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;