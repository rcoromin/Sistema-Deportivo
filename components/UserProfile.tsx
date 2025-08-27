import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto mt-12 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Mi Perfil</h2>
      <div className="space-y-4">
        <div>
          <span className="block text-gray-500 text-sm">Nombre de usuario</span>
          <span className="block text-lg font-semibold text-gray-800 dark:text-white">{user.nombre_usuario || user.username}</span>
        </div>
        <div>
          <span className="block text-gray-500 text-sm">Correo</span>
          <span className="block text-lg font-semibold text-gray-800 dark:text-white">{user.correo || user.email}</span>
        </div>
        <div>
          <span className="block text-gray-500 text-sm">Empresa</span>
          <span className="block text-lg font-semibold text-gray-800 dark:text-white">{user.nombre_empresa || user.companyName || '-'}</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
