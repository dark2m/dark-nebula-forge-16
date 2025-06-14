
import { LocalStorageService } from './localStorageService';
import type { AdminUser } from '../types/admin';

class UserService {
  static getAdminUsers(): AdminUser[] {
    return LocalStorageService.getAdminUsers();
  }

  static addAdminUser(user: Omit<AdminUser, 'id'>): AdminUser {
    const users = this.getAdminUsers();
    const newUser = {
      ...user,
      id: Date.now()
    };
    users.push(newUser);
    LocalStorageService.saveAdminUsers(users);
    return newUser;
  }

  static updateAdminUser(id: number, updates: Partial<AdminUser>): void {
    const users = this.getAdminUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      LocalStorageService.saveAdminUsers(users);
    }
  }

  static deleteAdminUser(id: number): void {
    const users = this.getAdminUsers().filter(u => u.id !== id);
    LocalStorageService.saveAdminUsers(users);
  }

  static validateAdmin(username: string, password: string): AdminUser | null {
    return LocalStorageService.validateAdmin(username, password);
  }
}

export default UserService;
