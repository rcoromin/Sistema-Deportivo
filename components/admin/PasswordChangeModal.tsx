import React, { useState } from 'react';

interface PasswordChangeModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onPasswordChanged: () => void;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({ user, isOpen, onClose, onPasswordChanged }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!password || password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      const adminId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id_usuario : null;
      if (!adminId) throw new Error('No autenticado');
      const res = await fetch(`http://127.0.0.1:5000/usuarios/${user.id_usuario}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': adminId },
        body: JSON.stringify({ contraseña: password })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al actualizar la contraseña');
        setLoading(false);
        return;
      }
      setPassword('');
      setLoading(false);
      setSuccess('¡Contraseña actualizada correctamente!');
      onPasswordChanged();
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 1500);
    } catch (err) {
      setError('Error de red o servidor');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">✕</button>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Actualizar contraseña</h2>
        {success ? (
          <div className="text-green-600 text-center font-semibold py-4">{success}</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Nueva contraseña"
              className="input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={6}
              required
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" disabled={loading}>
              {loading ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PasswordChangeModal;
