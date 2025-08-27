import React from 'react';
import { BasketballPlayerIcon, VolleyballPlayerIcon, BasketballSilhouetteIcon } from '../components/icons/Icons';

export interface ThemeColors {
  primary: {
    bg: string;
    hoverBg: string;
    focusRing: string;
    text: string;
    hoverText: string;
  };
  text: {
    header: string;
    body: string;
    link: string;
    linkHover: string;
  };
  background: {
    overlay: string;
    form: string;
  };
}

export interface Theme {
  name: string;
  BackgroundImage: React.FC;
  colors: ThemeColors;
}

export const volleyballTheme: Theme = {
  name: 'Voleibol',
  BackgroundImage: VolleyballPlayerIcon,
  colors: {
    primary: {
      bg: 'bg-cyan-600',
      hoverBg: 'hover:bg-cyan-700',
      focusRing: 'focus:ring-cyan-500',
      text: 'text-cyan-600',
      hoverText: 'hover:text-cyan-500',
    },
    text: {
      header: 'text-white',
      body: 'text-gray-300',
      link: 'text-cyan-400',
      linkHover: 'hover:text-cyan-300',
    },
    background: {
      overlay: 'bg-black/60',
      form: 'bg-gray-900/60 backdrop-blur-md',
    },
  },
};

export const basketballTheme: Theme = {
  name: 'Baloncesto',
  BackgroundImage: BasketballPlayerIcon,
  colors: {
    primary: {
      bg: 'bg-orange-600',
      hoverBg: 'hover:bg-orange-700',
      focusRing: 'focus:ring-orange-500',
      text: 'text-orange-600',
      hoverText: 'hover:text-orange-500',
    },
    text: {
      header: 'text-white',
      body: 'text-gray-300',
      link: 'text-orange-400',
      linkHover: 'hover:text-orange-300',
    },
    background: {
      overlay: 'bg-black/60',
      form: 'bg-gray-900/60 backdrop-blur-md',
    },
  },
};

export const defaultTheme: Theme = {
  name: 'Mixto',
  BackgroundImage: BasketballSilhouetteIcon,
  colors: {
    primary: {
      bg: 'bg-indigo-600',
      hoverBg: 'hover:bg-indigo-700',
      focusRing: 'focus:ring-indigo-500',
      text: 'text-indigo-600',
      hoverText: 'hover:text-indigo-500',
    },
    text: {
      header: 'text-white',
      body: 'text-gray-400',
      link: 'text-indigo-400',
      linkHover: 'hover:text-indigo-300',
    },
    background: {
      overlay: 'bg-gray-900/30',
      form: 'bg-gray-800/60 backdrop-blur-sm',
    },
  },
};

export const themes: Record<string, Theme> = {
  volleyball: volleyballTheme,
  basketball: basketballTheme,
  default: defaultTheme,
};
