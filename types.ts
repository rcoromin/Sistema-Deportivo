export interface User {
  id_usuario: string;
  nombre_usuario: string;
  correo: string;
  nombre_empresa?: string;
  esta_confirmado?: number;
  id_tipo_usuario?: number;
  nombre_tipo?: string; // nombre del tipo de usuario (invitado, usuario, administrador)
  // Compatibilidad con nombres antiguos para evitar errores en el frontend
  id?: string;
  username?: string;
  email?: string;
  companyName?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, companyName: string) => Promise<void>;
  logout: () => void;
}