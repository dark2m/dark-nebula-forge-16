
import { AdminUser } from '../types/admin';
import UserService from './userService';

class AuthService {
  private static CURRENT_USER_KEY = 'current_admin_user';

  static authenticateAdmin(username: string, password: string): boolean {
    console.log('AuthService: Attempting login for:', username);
    
    const users = UserService.getAdminUsers();
    console.log('AuthService: Available users:', users);
    
    const user = users.find(u => u.username === username && u.password === password);
    console.log('AuthService: Found user:', user);
    
    if (user) {
      localStorage.setItem('adminToken', JSON.stringify({ userId: user.id, timestamp: Date.now() }));
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      console.log('AuthService: Login successful');
      return true;
    }
    
    console.log('AuthService: Login failed - invalid credentials');
    return false;
  }

  static getCurrentUser(): AdminUser | null {
    try {
      const stored = localStorage.getItem(this.CURRENT_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('AuthService: Error getting current user:', error);
      return null;
    }
  }

  static isAdminAuthenticated(): boolean {
    const token = localStorage.getItem('adminToken');
    const currentUser = this.getCurrentUser();
    const isAuth = !!token && !!currentUser;
    console.log('AuthService: Is authenticated:', isAuth);
    return isAuth;
  }

  static hasPermission(requiredRole: 'مدير عام' | 'مبرمج' | 'مشرف'): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;
    
    // المدير العام له تحكم كامل في كل شيء
    if (currentUser.role === 'مدير عام') return true;
    
    const roleHierarchy = { 'مدير عام': 3, 'مبرمج': 2, 'مشرف': 1 };
    return roleHierarchy[currentUser.role] >= roleHierarchy[requiredRole];
  }

  static logout(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem(this.CURRENT_USER_KEY);
    console.log('AuthService: Logged out successfully');
  }
}

export default AuthService;
