import { Theme } from '../config/themes';

export const getBackgroundImage = (theme: Theme): string => {
  if (theme.name === 'Voleibol') {
    return "url('/fondo-login3.png')";
  } else if (theme.name === 'Baloncesto') {
    return "url('/fondo-login2.png')";
  } else {
    return "url('/fondo-login1.png')";
  }
};
