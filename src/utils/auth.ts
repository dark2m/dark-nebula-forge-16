
import { AdminUser } from '../types/admin';

class AuthService {
  private static USERS_KEY = 'admin_users';
  private static CURRENT_USER_KEY = 'current_admin_user';

  static authenticateAdmin(username: string, password: string): boolean {
    const users = this.getAdminUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('adminToken', JSON.stringify({ userId: user.id, timestamp: Date.now() }));
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  }

  static getCurrentUser(): AdminUser | null {
    const stored = localStorage.getItem(this.CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  static isAdminAuthenticated(): boolean {
    const token = localStorage.getItem('adminToken');
    return !!token;
  }

  static hasPermission(requiredRole: 'مدير عام' | 'مبرمج' | 'مشرف'): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;
    
    // المدير العام له تحكم كامل في كل شيء
    if (currentUser.role === 'مدير عام') return true;
    
    const roleHierarchy = { 'مدير عام': 3, 'مبرمج': 2, 'مشرف': 1 };
    return roleHierarchy[currentUser.role] >= roleHierarchy[requiredRole];
  }

  private static getAdminUsers(): AdminUser[] {
    const stored = localStorage.getItem(this.USERS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    const defaultUsers: AdminUser[] = [
      { id: 1, username: 'dark', password: 'dark', role: 'مدير عام' },
    ];
    
    this.saveAdminUsers(defaultUsers);
    return defaultUsers;
  }

  private static saveAdminUsers(users: AdminUser[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }
}

export default AuthService;
