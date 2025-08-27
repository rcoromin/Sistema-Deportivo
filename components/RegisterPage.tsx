// Componente RegisterPage
// Renderiza el formulario de registro de usuario, validando los campos requeridos.
// Usa el contexto de autenticación para registrar y el contexto de tema para estilos.
// Permite alternar a la vista de login.
import React, { useState } from 'react'; // Importa React y el hook useState para manejar el estado del componente.
import { Link } from 'react-router-dom'; // Importa Link para navegación entre páginas.
import { useAuth } from '../contexts/AuthContext'; // Importa el hook useAuth para acceder al contexto de autenticación.
import { useTheme } from '../contexts/ThemeContext'; // Importa el hook useTheme para acceder al contexto del tema.
import Input from './Input'; // Importa el componente de campo de entrada reutilizable.
import Button from './Button'; // Importa el componente de botón reutilizable.
import { UserIcon, MailIcon, LockIcon, BuildingIcon, CompanyLogoIcon } from './icons/Icons'; // Importa los iconos utilizados en el formulario.
import { systemConfig } from '../config/system'; // Importa la configuración del sistema (nombre de la empresa, etc.).

import { getBackgroundImage } from '../utils/themeUtils'; // Importa la función para obtener la imagen de fondo según el tema.

interface RegisterPageProps {
  onToggleForm: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onToggleForm }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const { theme } = useTheme();
  const { colors } = theme;
  const backgroundImage = getBackgroundImage(theme);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !email || !password || !companyName) {
      setError('Por favor, rellena todos los campos.');
      return;
    }
    try {
      await register(username, email, password, companyName);
      // El mensaje de éxito ahora se maneja en AuthContext
      setUsername('');
      setEmail('');
      setPassword('');
      setCompanyName('');
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta. Por favor, inténtalo de nuevo.');
    }
  };

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

        <div className="absolute bottom-4 left-4 flex items-center space-x-3 text-gray-400 z-10">
          <div className="w-10 h-10"><CompanyLogoIcon /></div>
          <div>
            <p className="font-bold text-sm text-gray-200">{systemConfig.companyName}</p>
            <p className="text-xs">{systemConfig.softwareName}</p>
          </div>
        </div>
        
        <div className={`w-full max-w-md p-8 space-y-6 ${colors.background.form} rounded-2xl shadow-2xl z-10`}>
            <div className="text-center">
                <h1 className={`text-3xl font-bold ${colors.text.header}`}>Crear Cuenta</h1>
                <p className={`mt-2 text-sm ${colors.text.body}`}>¡Únete a {systemConfig.softwareName}!</p>
            </div>
            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <div className="flex flex-col gap-4">
                    <Input id="username" name="username" type="text" required placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} icon={<UserIcon />} />
                    <Input id="companyName" name="companyName" type="text" required placeholder="Nombre de la Empresa" value={companyName} onChange={(e) => setCompanyName(e.target.value)} icon={<BuildingIcon />} />
                    <Input id="email-address" name="email" type="email" required placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} icon={<MailIcon />} />
                    <Input id="password" name="password" type="password" required placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} icon={<LockIcon />} />
                </div>
                <div>
                    <Button type="submit" disabled={loading} fullWidth={true}>
                        {loading ? 'Creando cuenta...' : 'Registrarse'}
                    </Button>
                </div>
            </form>
      <p className={`mt-4 text-sm text-center ${colors.text.body}`}>
        ¿Ya tienes una cuenta?{' '}
        <Link to="/login" className={`font-medium ${colors.text.link} ${colors.text.linkHover} transition-colors duration-200`}>
          Inicia sesión
        </Link>
      </p>
        </div>
     </div>
  );
};

export default RegisterPage;