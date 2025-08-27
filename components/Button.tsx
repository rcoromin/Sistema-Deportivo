// Componente Button
// Este componente renderiza un botón reutilizable con estilos personalizados según el tema actual.
// Recibe props para tipo, deshabilitado, ancho completo y contenido del botón.
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'danger';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', fullWidth = false, ...props }) => {
  const { theme } = useTheme();

  const baseClasses = "group relative flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";

  const getVariantClasses = () => {
    if (variant === 'danger') {
      return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
    }
    // Default to primary theme color
    const { bg, hoverBg, focusRing } = theme.colors.primary;
    return `${bg} ${hoverBg} ${focusRing}`;
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      {...props}
      className={`${baseClasses} ${getVariantClasses()} ${widthClass}`}
    >
      {children}
    </button>
  );
};

export default Button;