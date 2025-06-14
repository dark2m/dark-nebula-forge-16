
import { LocalStorageService } from './localStorageService';
import { AdminUser } from '@/types/admin';

const AUTH_TOKEN_KEY = 'admin_auth_token';

export class AuthService {
  static login(username: string, password: string): AdminUser | null {
    const user = LocalStorageService.validateAdmin(username, password);
    if (user) {
      // Store auth token
      const token = btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }));
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      return user;
    }
    return null;
  }

  static logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return false;

    try {
      const decoded = JSON.parse(atob(token));
      // Check if token is less than 24 hours old
      const tokenAge = Date.now() - decoded.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      return tokenAge < maxAge;
    } catch {
      return false;
    }
  }

  static getCurrentUser(): AdminUser | null {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token || !this.isAuthenticated()) return null;

    try {
      const decoded = JSON.parse(atob(token));
      const users = LocalStorageService.getAdminUsers();
      return users.find(user => user.id === decoded.userId) || null;
    } catch {
      return null;
    }
  }
}
