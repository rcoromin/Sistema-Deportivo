import React, { useEffect, useState } from 'react';
import { PencilSquareIcon, TrashIcon, ArrowPathIcon, KeyIcon } from '@heroicons/react/24/outline';

interface UserListProps {
  onEdit: (user: any) => void;
  onPassword: (user: any) => void;
  refresh: boolean;
}

interface UserListProps {
  onEdit: (user: any) => void;
  refresh: boolean;
}

const UserList: React.FC<UserListProps> = ({ onEdit, onPassword, refresh }) => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const adminId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id_usuario : null;
      if (!adminId) return;
      const res = await fetch('http://127.0.0.1:5000/usuarios', {
        headers: { 'X-User-Id': adminId }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setUsers([]);
      }
    };
    fetchUsers();
  }, [refresh]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 mt-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Usuarios registrados</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <th className="p-3 rounded-l-lg border border-gray-300 dark:border-gray-700">Usuario</th>
              <th className="p-3 border border-gray-300 dark:border-gray-700">Correo</th>
              <th className="p-3 border border-gray-300 dark:border-gray-700">Tipo</th>
              <th className="p-3 border border-gray-300 dark:border-gray-700">Empresa</th>
              <th className="p-3 border border-gray-300 dark:border-gray-700">Estado</th>
              <th className="p-3 rounded-r-lg border border-gray-300 dark:border-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && <tr><td colSpan={6} className="text-center py-4 text-gray-500">Sin usuarios</td></tr>}
            {users.map(u => (
              <tr key={u.id_usuario} className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
                <td className="p-3 border border-gray-200 dark:border-gray-700">{u.nombre_usuario}</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">{u.correo}</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">{u.nombre_tipo}</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">{u.nombre_empresa}</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">{u.esta_confirmado ? 'Activo' : 'Desactivado'}</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 flex gap-3 items-center justify-center">
                  <button title="Editar" className="text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 p-1 rounded transition" onClick={() => onEdit(u)}>
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button
                    title="Actualizar contraseña"
                    className="text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900 p-1 rounded transition"
                    onClick={() => onPassword(u)}
                  >
                    <KeyIcon className="w-5 h-5" />
                  </button>
                  <button
                    title={u.esta_confirmado ? 'Desactivar' : 'Reactivar'}
                    className={`transition p-1 rounded ${u.esta_confirmado ? 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900' : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900'}`}
                    onClick={async () => {
                      const adminId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id_usuario : null;
                      if (!adminId) return;
                      await fetch(`http://127.0.0.1:5000/usuarios/${u.id_usuario}/estado`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json', 'X-User-Id': adminId },
                        body: JSON.stringify({ activo: u.esta_confirmado ? 0 : 1 })
                      });
                      setUsers(users => users.map(us => us.id_usuario === u.id_usuario ? { ...us, esta_confirmado: u.esta_confirmado ? 0 : 1 } : us));
                    }}
                  >
                    <ArrowPathIcon className="w-5 h-5" />
                  </button>
                  <button
                    title="Eliminar"
                    className="text-gray-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900 p-1 rounded transition"
                    onClick={async () => {
                      const adminId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id_usuario : null;
                      if (!adminId) return;
                      await fetch(`http://127.0.0.1:5000/usuarios/${u.id_usuario}`, {
                        method: 'DELETE',
                        headers: { 'X-User-Id': adminId }
                      });
                      setUsers(users => users.filter(us => us.id_usuario !== u.id_usuario));
                    }}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
