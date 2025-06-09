
import { AdminUser } from '../types/admin';

class UserService {
  private static USERS_KEY = 'admin_users';

  static getAdminUsers(): AdminUser[] {
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

  static saveAdminUsers(users: AdminUser[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  static updateAdminUser(id: number, updates: Partial<AdminUser>): void {
    const users = this.getAdminUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.saveAdminUsers(users);
    }
  }

  static addAdminUser(user: Omit<AdminUser, 'id'>): AdminUser {
    const users = this.getAdminUsers();
    const newUser: AdminUser = {
      ...user,
      id: Date.now()
    };
    users.push(newUser);
    this.saveAdminUsers(users);
    return newUser;
  }

  static deleteAdminUser(id: number): void {
    const users = this.getAdminUsers().filter(u => u.id !== id);
    this.saveAdminUsers(users);
  }
}

export default UserService;
