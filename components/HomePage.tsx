// Componente HomePage
// Es la página principal (dashboard) que se muestra tras iniciar sesión.
// Puede mostrar información relevante del usuario y accesos a otras secciones.

import React from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import DashboardStatCard from './DashboardStatCard';
import { RevenueIcon, UsersIcon, SalesIcon, AnalyticsIcon } from './icons/Icons';

const HomePage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
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
        
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <h2 className="text-3xl font-bold mb-6">Resumen del Panel</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardStatCard 
              icon={<div className="w-6 h-6"><RevenueIcon /></div>}
              title="Ingresos Totales"
              value="$45,231.89"
              change="20.1%"
              changeType="increase"
            />
            <DashboardStatCard 
              icon={<div className="w-6 h-6"><UsersIcon /></div>}
              title="Suscripciones"
              value="+2350"
              change="12.5%"
              changeType="increase"
            />
            <DashboardStatCard 
              icon={<div className="w-6 h-6"><SalesIcon /></div>}
              title="Ventas"
              value="+12,234"
              change="5.2%"
              changeType="increase"
            />
            <DashboardStatCard 
              icon={<div className="w-6 h-6"><AnalyticsIcon /></div>}
              title="Activos Ahora"
              value="316"
              change="2.8%"
              changeType="decrease"
            />
          </div>
          
          <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
             <h3 className="text-xl font-semibold mb-4">Actividad Reciente</h3>
             <p className="text-gray-600 dark:text-gray-400">
                Aquí iría un gráfico o una lista de actividades recientes. Por ahora, es solo un marcador de posición para mostrar cómo se puede expandir el diseño del panel con componentes más complejos.
             </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;