import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UserForm from './UserForm';
import UserList from './UserList';
import DashboardSidebar from '../DashboardSidebar';
import DashboardHeader from '../DashboardHeader';


const UserAdminPage: React.FC = () => {
  const { user } = useAuth();
  const [editingUser, setEditingUser] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user || user.nombre_tipo !== 'administrador') {
    return <div className="p-8 text-center text-red-600 font-bold">Acceso denegado</div>;
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden">
      <DashboardSidebar isSidebarOpen={isSidebarOpen} />
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      <div className="flex-1 flex flex-col">
        <DashboardHeader toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col items-center">
          <div className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Gestión de Usuarios</h2>
            <div className="mb-8">
              <UserForm editingUser={editingUser} onSaved={() => { setEditingUser(null); setRefresh(r => !r); }} />
            </div>
            <UserList onEdit={setEditingUser} refresh={refresh} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserAdminPage;
