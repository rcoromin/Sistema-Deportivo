// Componente DashboardHeader
// Renderiza la cabecera del dashboard, mostrando el nombre de usuario y opciones de navegación.

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BellIcon, MenuIcon } from './icons/Icons';

interface HeaderProps {
  toggleSidebar: () => void;
}

const DashboardHeader: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center">
         <button onClick={toggleSidebar} className="md:hidden mr-4 text-gray-600 dark:text-gray-300">
            <div className="w-6 h-6"><MenuIcon/></div>
         </button>
         <div>
           <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
             ¡Hola, {user?.nombre_usuario || user?.username}!
           </h1>
           {user?.nombre_tipo && (
             <span className="text-xs text-gray-500 dark:text-gray-300 font-medium block mt-1">
               Tipo: {user.nombre_tipo}
             </span>
           )}
         </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
          <div className="w-6 h-6"><BellIcon /></div>
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
         <img src={`https://picsum.photos/seed/${user?.id_usuario || user?.id}/40/40`} alt="User Avatar" className="w-10 h-10 rounded-full hidden md:block" />
      </div>
    </header>
  );
};

export default DashboardHeader;