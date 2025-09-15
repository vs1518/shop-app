import { Injectable, computed, effect, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User, Role } from '../models/user.model';

const SESSION_KEY = 'auth_current_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Mock users (admin + user par défaut)
  private _users = signal<User[]>([
    { id: '1', email: 'admin@example.com', password: 'admin123', role: 'admin', createdAt: new Date().toISOString() },
    { id: '2', email: 'user@example.com',  password: 'user123',  role: 'user',  createdAt: new Date().toISOString() }
  ]);

  private _current = signal<User | null>(AuthService.loadSession());
  current = this._current.asReadonly();

  isAuthenticated = computed(() => this._current() !== null);
  role = computed<Role | null>(() => this._current()?.role ?? null);
  isAdmin = computed<boolean>(() => this.role() === 'admin');

  constructor(private router: Router) {
    // Persister la session
    effect(() => {
      const user = this._current();
      if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      else localStorage.removeItem(SESSION_KEY);
    });
  }

  private static loadSession(): User | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) as User : null;
    } catch { return null; }
  }

  async login(email: string, password: string): Promise<{ ok: true } | { ok: false; error: string }> {
    await new Promise(r => setTimeout(r, 400)); // petite latence mock
    const user = this._users().find(u => u.email === email && u.password === password);
    if (!user) return { ok: false, error: 'Email ou mot de passe incorrect.' };
    this._current.set(user);
    return { ok: true };
  }

  async register(email: string, password: string): Promise<{ ok: true } | { ok: false; error: string }> {
    await new Promise(r => setTimeout(r, 500));
    if (this._users().some(u => u.email === email)) return { ok: false, error: 'Cet email est déjà utilisé.' };
    const newUser: User = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      email, password, role: 'user',
      createdAt: new Date().toISOString()
    };
    this._users.update(xs => [...xs, newUser]);
    this._current.set(newUser);
    return { ok: true };
  }

  async logout(): Promise<void> {
    await new Promise(r => setTimeout(r, 150));
    this._current.set(null);
    await this.router.navigateByUrl('/catalog');
  }
}
