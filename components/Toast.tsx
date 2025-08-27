import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from './icons/Icons';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // El toast se cierra automáticamente después de 5 segundos

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const typeStyles = {
    success: {
      bg: 'bg-green-500',
      icon: <CheckCircleIcon />,
    },
    error: {
      bg: 'bg-red-500',
      icon: <XCircleIcon />,
    },
  };

  const { bg, icon } = typeStyles[type];

  return (
    <div className={`fixed top-5 right-5 flex items-center p-4 rounded-lg shadow-lg text-white ${bg} z-50 animate-fade-in-down`}>
      <div className="w-6 h-6 mr-3">
        {icon}
      </div>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-xl font-semibold">&times;</button>
    </div>
  );
};

export default Toast;
