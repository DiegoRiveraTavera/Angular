import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../app/enviroments/enviroment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly api = `${environment.apiUrl}/users`;

  // ─── Signals ─────────────────────────────────────────────
  private usersSignal = signal<User[]>([]);
  private currentUserSignal = signal<User | null>(this.loadFromStorage());

  users = computed(() => this.usersSignal());
  currentUser = computed(() => this.currentUserSignal());
  isLoggedIn = computed(() => this.currentUserSignal() !== null);

  constructor(private http: HttpClient) {}

  // ─── AUTH ─────────────────────────────────────────────────
login(email: string, password: string): Observable<{token: string, user: User}> {
  return this.http.post<{token: string, user: User}>(`${this.api}/login`, { email, password }).pipe(
    tap(res => {
      this.currentUserSignal.set(res.user);
      localStorage.setItem('current_user', JSON.stringify(res.user));
      localStorage.setItem('token', res.token);
    })
  );
}

logout(): void {
  this.currentUserSignal.set(null);
  localStorage.removeItem('current_user');
  localStorage.removeItem('token');
}

private loadFromStorage(): User | null {
  try {
    const raw = localStorage.getItem('current_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}


  // ─── HTTP CRUD ────────────────────────────────────────────

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.api}`).pipe(
      tap(users => this.usersSignal.set(users))
    );
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.api}/${id}`);
  }

  // ─── MÉTODOS LOCALES (compatibilidad con permissions-management) ──

  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    this.usersSignal.update(users => [...users, newUser]);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): void {
    this.usersSignal.update(users =>
      users.map(u => u.id === id ? { ...u, ...updates } : u)
    );
  }

  deleteUser(id: string): void {
    this.usersSignal.update(users => users.filter(u => u.id !== id));
  }

  assignPermissions(userId: string, permissions: string[]): void {
    this.updateUser(userId, { permissions });
  }

  addPermission(userId: string, permission: string): void {
    const user = this.getUserById(userId);
    if (user && !user.permissions?.includes(permission)) {
      this.updateUser(userId, {
        permissions: [...(user.permissions || []), permission]
      });
    }
  }

  removePermission(userId: string, permission: string): void {
    const user = this.getUserById(userId);
    if (user) {
      this.updateUser(userId, {
        permissions: (user.permissions || []).filter(p => p !== permission)
      });
    }
  }

  setCurrentUser(userId: string): void {
    const user = this.usersSignal().find(u => u.id === userId);
    if (user) this.currentUserSignal.set(user);
  }

  getUserById(id: string): User | undefined {
    return this.usersSignal().find(u => u.id === id);
  }

  getUserCount(): number {
    return this.usersSignal().length;
  }

  getActiveUsers(): User[] {
    return this.usersSignal().filter(u => u.active);
  }

  // ─── STORAGE ──────────────────────────────────────────────

  updateProfile(id: string, data: Partial<User>): Observable<User> {
  return this.http.put<User>(`${this.api}/${id}`, data);
}
}