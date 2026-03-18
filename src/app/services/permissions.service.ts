//src/app/services/permissions.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private userPermissions = signal<string[]>([]);

  // Setter: asigna permisos al usuario
  setPermissions(perms: string[]) {
    this.userPermissions.set(perms);
  }

  // Getter: devuelve la lista actual de permisos
  get permissions(): string[] {
    return this.userPermissions();
  }

  // Métodos de verificación
  hasPermission(permiso: string): boolean {
    return this.userPermissions().includes(permiso);
  }

  hasAnyPermission(perms: string[]): boolean {
    return perms.some(p => this.hasPermission(p));
  }
}
  
/*
import { Injectable, computed, signal } from '@angular/core';

export const PERMISSIONS_BY_DOMAIN = {
  group: ['group:view', 'group:edit', 'group:add', 'group:delete'],
  ticket: ['ticket:view', 'ticket:edit', 'ticket:add', 'ticket:delete', 'ticket:edit_state'],
  user: ['user:view', 'user:edit', 'user:add', 'user:delete']
} as const;

export type Permission =
  | (typeof PERMISSIONS_BY_DOMAIN.group)[number]
  | (typeof PERMISSIONS_BY_DOMAIN.ticket)[number]
  | (typeof PERMISSIONS_BY_DOMAIN.user)[number];

export const DEFAULT_USER_PERMISSIONS: readonly Permission[] = [
  'group:view',
  'ticket:view',
  'ticket:edit_state',
  'user:view',
  'user:edit'
] as const;

export const ALL_PERMISSIONS: readonly Permission[] = [
  ...PERMISSIONS_BY_DOMAIN.group,
  ...PERMISSIONS_BY_DOMAIN.ticket,
  ...PERMISSIONS_BY_DOMAIN.user
] as const;

interface StoredAuthUser {
  username: string;
  isSuperuser: boolean;
  permissions: Permission[];
}

export interface AuthUser {
  username: string;
  isSuperuser: boolean;
  permissions: readonly Permission[];
}

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private readonly storageKey = 'erp-auth-user';

  private readonly currentUserSignal = signal<AuthUser | null>(this.loadStoredUser());

  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);
  readonly isSuperuser = computed(() => this.currentUserSignal()?.isSuperuser ?? false);
  readonly activePermissions = computed<readonly Permission[]>(() => {
    const user = this.currentUserSignal();
    if (!user) {
      return [];
    }
    if (user.isSuperuser) {
      return ALL_PERMISSIONS;
    }
    return user.permissions;
  });

  loginAsDefaultUser(username: string): void {
    this.setCurrentUser({
      username,
      isSuperuser: false,
      permissions: [...DEFAULT_USER_PERMISSIONS]
    });
  }

  loginWithPermissions(username: string, permissions: readonly Permission[]): void {
    this.setCurrentUser({
      username,
      isSuperuser: false,
      permissions: [...permissions]
    });
  }

  loginAsSuperuser(username: string): void {
    this.setCurrentUser({
      username,
      isSuperuser: true,
      permissions: [...ALL_PERMISSIONS]
    });
  }

  logout(): void {
    this.currentUserSignal.set(null);
    const storage = this.getStorage();
    storage?.removeItem(this.storageKey);
  }

  hasPermission(permission: Permission): boolean {
    const user = this.currentUserSignal();
    if (!user) {
      return false;
    }
    if (user.isSuperuser) {
      return true;
    }
    return user.permissions.includes(permission);
  }

  hasAnyPermissions(permissions: readonly Permission[]): boolean {
    if (permissions.length === 0) {
      return true;
    }
    return permissions.some(permission => this.hasPermission(permission));
  }

  hasAllPermissions(permissions: readonly Permission[]): boolean {
    if (permissions.length === 0) {
      return true;
    }
    return permissions.every(permission => this.hasPermission(permission));
  }

  private setCurrentUser(user: AuthUser): void {
    this.currentUserSignal.set(user);
    const serializable: StoredAuthUser = {
      username: user.username,
      isSuperuser: user.isSuperuser,
      permissions: [...user.permissions]
    };
    const storage = this.getStorage();
    storage?.setItem(this.storageKey, JSON.stringify(serializable));
  }

  private loadStoredUser(): AuthUser | null {
    const storage = this.getStorage();
    const rawUser = storage?.getItem(this.storageKey);
    if (!rawUser) {
      return null;
    }

    try {
      const parsed = JSON.parse(rawUser) as StoredAuthUser;
      if (!parsed.username || !Array.isArray(parsed.permissions)) {
        return null;
      }
      return {
        username: parsed.username,
        isSuperuser: Boolean(parsed.isSuperuser),
        permissions: parsed.permissions.filter((permission): permission is Permission =>
          (ALL_PERMISSIONS as readonly string[]).includes(permission)
        )
      };
    } catch {
      return null;
    }
  }

  private getStorage(): Storage | null {
    return globalThis.localStorage ?? null;
  }
}
  */