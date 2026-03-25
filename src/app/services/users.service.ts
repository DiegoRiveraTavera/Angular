import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private usersSignal = signal<User[]>([
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@test.com',
      permissions: [
        'user:ver', 'user:editar', 'user:crear', 'user:eliminar',
        'grupos:ver', 'grupos:agre', 'grupos:eliminar', 'grupos:editar',
        'tickets:ver', 'tickets:agre', 'tickets:eliminar', 'tickets:editar', 'tickets:cambiar_estado',
        'reportes:ver', 'reportes:descargar', 'reportes:crear'
      ],
      active: true,
      createdAt: new Date()
    }
  ]);

  private currentUserIdSignal = signal<string>('1');

  // Signals públicos
  users = computed(() => this.usersSignal());
  currentUserId = computed(() => this.currentUserIdSignal());
  currentUser = computed(() => {
    const userId = this.currentUserIdSignal();
    return this.usersSignal().find(u => u.id === userId);
  });

  // Obtener un usuario por ID
  getUserById(id: string): User | undefined {
    return this.usersSignal().find(u => u.id === id);
  }

  // Crear usuario
  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    this.usersSignal.update(users => [...users, newUser]);
    return newUser;
  }

  // Actualizar usuario
  updateUser(id: string, updates: Partial<User>): void {
    this.usersSignal.update(users =>
      users.map(u => u.id === id ? { ...u, ...updates } : u)
    );
  }

  // Eliminar usuario
  deleteUser(id: string): void {
    this.usersSignal.update(users =>
      users.filter(u => u.id !== id)
    );
  }

  // Asignar permisos a usuario
  assignPermissions(userId: string, permissions: string[]): void {
    this.updateUser(userId, { permissions });
  }

  // Agregar permiso individual
  addPermission(userId: string, permission: string): void {
    const user = this.getUserById(userId);
    if (user && !user.permissions.includes(permission)) {
      this.updateUser(userId, {
        permissions: [...user.permissions, permission]
      });
    }
  }

  // Remover permiso individual
  removePermission(userId: string, permission: string): void {
    const user = this.getUserById(userId);
    if (user) {
      this.updateUser(userId, {
        permissions: user.permissions.filter(p => p !== permission)
      });
    }
  }

  // Cambiar usuario actual
  setCurrentUser(userId: string): void {
    if (this.usersSignal().find(u => u.id === userId)) {
      this.currentUserIdSignal.set(userId);
    }
  }

  // Contar usuarios
  getUserCount(): number {
    return this.usersSignal().length;
  }

  // Obtener usuarios activos
  getActiveUsers(): User[] {
    return this.usersSignal().filter(u => u.active);
  }
}
