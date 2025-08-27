// Componente DashboardStatCard
// Muestra una tarjeta con estadísticas o información relevante en el dashboard.

import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
}

const DashboardStatCard: React.FC<StatCardProps> = ({ icon, title, value, change, changeType }) => {
  const isIncrease = changeType === 'increase';
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-semibold ${isIncrease ? 'text-green-500' : 'text-red-500'}`}>
          {isIncrease ? '▲' : '▼'} {change}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs. el mes pasado</span>
      </div>
    </div>
  );
};

export default DashboardStatCard;