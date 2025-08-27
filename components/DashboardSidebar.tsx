// Componente DashboardSidebar
// Renderiza la barra lateral de navegación del dashboard con accesos a distintas secciones.
import React from 'react';
import { DashboardIcon, AnalyticsIcon, UsersIcon, SettingsIcon, LogoutIcon } from './icons/Icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { systemConfig } from '../config/system';

interface SidebarProps {
  isSidebarOpen: boolean;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ isSidebarOpen }) => {
  const { logout, user } = useAuth();
  const { theme } = useTheme();
  
    const navItems = [
        { icon: <DashboardIcon />, name: 'Panel', href: '/' },
        { icon: <AnalyticsIcon />, name: 'Análisis', href: '#' },
        { icon: <UsersIcon />, name: 'Usuarios', href: '#' },
        { icon: <SettingsIcon />, name: 'Configuración', href: '#' },
    ];

  const activeItemClasses = `${theme.colors.primary.bg.replace('bg-', 'hover:bg-').replace('600', '700')} text-white`; // A bit of a hack for hover, but works for these colors
  const activeBg = theme.colors.primary.bg;

  return (
    <aside className={`absolute inset-y-0 left-0 bg-gray-900 text-gray-300 w-64 space-y-6 py-7 px-2 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-20 flex flex-col`}>
        <div className="px-4">
            <h2 className="text-2xl font-extrabold text-white">{systemConfig.softwareName}</h2>
        </div>
        
        <nav className="flex-grow">
                                    {navItems.map((item) => {
                                            // Mostrar el botón Usuarios solo para usuarios tipo 2
                                            if (item.name === 'Usuarios' && user?.id_tipo_usuario !== 2) return null;
                                            // Redirigir a /perfil para usuarios tipo 2
                                            const href = (item.name === 'Usuarios' && user?.id_tipo_usuario === 2) ? '/perfil' : item.href;
                                            return (
                                                <a
                                                    key={item.name}
                                                    href={href}
                                                    className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors duration-200 hover:bg-gray-700 hover:text-white ${item.name === 'Panel' ? `${activeBg} text-white` : ''}`}
                                                >
                                                    <div className="w-6 h-6">{item.icon}</div>
                                                    <span>{item.name}</span>
                                                </a>
                                            );
                                    })}
                        {/* Solo administradores pueden ver el enlace de gestión de usuarios */}
                        {user?.nombre_tipo === 'administrador' && (
                                <a
                                        href="/admin/usuarios"
                                        className="flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors duration-200 hover:bg-blue-700 hover:text-white mt-2 bg-blue-600 text-white"
                                >
                                        <div className="w-6 h-6"><UsersIcon /></div>
                                        <span>Administrar Usuarios</span>
                                </a>
                        )}
        </nav>

        <div className="px-4 border-t border-gray-700 pt-4">
            <div className="flex items-center space-x-4">
                <img src={`https://picsum.photos/seed/${user?.id}/40/40`} alt="User Avatar" className="w-10 h-10 rounded-full" />
                <div>
                    <p className="font-semibold text-white">{user?.username}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                    {user?.companyName && <p className={`text-xs ${theme.colors.text.link} mt-1`}>{user.companyName}</p>}
                </div>
            </div>
             <button
                onClick={logout}
                className="w-full flex items-center space-x-3 mt-4 py-3 px-4 rounded-lg transition-colors duration-200 hover:bg-red-500 hover:text-white"
            >
                <div className="w-6 h-6"><LogoutIcon /></div>
                <span>Cerrar Sesión</span>
            </button>
        </div>
    </aside>
  );
};

export default DashboardSidebar;