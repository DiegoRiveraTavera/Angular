export interface User {
  id: string;
  name: string;
  email: string;
  permissions: string[];       // ⚠️ esto no viene de la BD directamente (viene de user_permissions)
  active: boolean;
  created_at?: string;         // snake_case igual que la BD
  // Campos opcionales que vienen de Supabase
  calle?: string;
  colonia?: string;
  no_exterior?: string;
  telefono?: string;
}

export const AVAILABLE_PERMISSIONS = {
  'Usuarios': [
    'user:ver',
    'user:editar',
    'user:crear',
    'user:eliminar'
  ],
  'Grupos': [
    'grupos:ver',
    'grupos:agre',
    'grupos:eliminar',
    'grupos:editar'
  ],
  'Tickets': [
    'tickets:ver',
    'tickets:agre',
    'tickets:eliminar',
    'tickets:editar',
    'tickets:cambiar_estado'
  ],
  'Reportes': [
    'reportes:ver',
    'reportes:descargar',
    'reportes:crear'
  ]
};