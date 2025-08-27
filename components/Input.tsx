
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ icon, ...props }) => {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <div className="h-5 w-5 text-gray-400">{icon}</div>
        </span>
      )}
      <input
        {...props}
        className={`w-full py-3 pr-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 transition duration-150 ease-in-out ${
          icon ? 'pl-10' : 'pl-3'
        }`}
      />
    </div>
  );
};

export default Input;
