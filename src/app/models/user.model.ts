export interface User {
  id: string;
  name: string;
  email: string;
  permissions: string[];
  active: boolean;
  createdAt?: Date;
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
