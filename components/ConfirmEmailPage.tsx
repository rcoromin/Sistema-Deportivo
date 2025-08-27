// Componente ConfirmEmailPage
// Muestra el resultado de la confirmación de correo electrónico usando el token de la URL.
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ConfirmEmailPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState('Confirmando tu correo...');
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/confirm/${token}`);
        const data = await response.json();
        if (response.ok) {
          setMessage(data.message || '¡Correo confirmado! Ya puedes iniciar sesión.');
          setSuccess(true);
        } else {
          setMessage(data.error || 'El enlace no es válido o ha expirado.');
          setSuccess(false);
        }
      } catch (error) {
        setMessage('Ocurrió un error al confirmar tu correo.');
        setSuccess(false);
      }
    };
    if (token) confirmEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Confirmación de correo</h1>
        <p className={success === false ? 'text-red-400' : 'text-green-400'}>{message}</p>
        {success && (
          <Link to="/" className="mt-6 inline-block text-blue-400 hover:underline">Ir a iniciar sesión</Link>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
