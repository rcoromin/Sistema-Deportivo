import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { themes, defaultTheme, Theme } from '../config/themes';

interface ThemeContextType {
  theme: Theme;
  setTheme: (themeName: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Estado para el tema, inicia con el tema por defecto
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  // Al montar, consulta el backend para obtener el tema desde la BDD
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/configuration');
        if (!response.ok) throw new Error('No se pudo obtener la configuración del servidor.');
        const config = await response.json();
        // Busca el valor del tema en la respuesta
        const themeConfig = config.find((c: { key: string; value: string }) => c.key === 'theme');
        const themeName = themeConfig?.value || 'default';
        console.log('Respuesta /configuration:', config);
        console.log('Tema recibido:', themeName);
        if (themes[themeName]) {
          setThemeState(themes[themeName]);
          localStorage.setItem('theme', themeName);
          console.log('Tema aplicado:', themes[themeName]);
        } else {
          setThemeState(defaultTheme);
          localStorage.setItem('theme', 'default');
          console.log('Tema por defecto aplicado');
        }
      } catch (error) {
        setThemeState(defaultTheme);
        localStorage.setItem('theme', 'default');
      }
    };
    fetchTheme();
  }, []);

  // Cambia el tema y lo guarda en localStorage
  const setTheme = (themeName: string) => {
    const newTheme = themes[themeName] || defaultTheme;
    setThemeState(newTheme);
    localStorage.setItem('theme', themeName);
  };

  const value = { theme, setTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};
