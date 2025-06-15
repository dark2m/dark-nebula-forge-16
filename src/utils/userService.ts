
import { AdminUser } from '../types/admin';

class UserService {
  private static USERS_KEY = 'admin_users';

  static getAdminUsers(): AdminUser[] {
    try {
      const stored = localStorage.getItem(this.USERS_KEY);
      if (stored) {
        const users = JSON.parse(stored);
        console.log('UserService: Loaded users:', users);
        return users;
      }
    } catch (error) {
      console.error('UserService: Error loading users:', error);
    }
    
    const defaultUsers: AdminUser[] = [
      { 
        id: 1, 
        username: 'dark', 
        password: 'dark', 
        role: 'مدير عام',
        email: 'admin@example.com',
        permissions: ['overview', 'products', 'users', 'passwords', 'tools', 'customerSupport', 'siteControl', 'texts', 'navigation', 'contact', 'design', 'preview', 'backup'],
        isActive: true,
        createdAt: new Date().toISOString()
      },
    ];
    
    this.saveAdminUsers(defaultUsers);
    return defaultUsers;
  }

  static saveAdminUsers(users: AdminUser[]): void {
    try {
      console.log('UserService: Saving users:', users);
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      console.log('UserService: Users saved successfully');
    } catch (error) {
      console.error('UserService: Error saving users:', error);
      throw new Error('تم تجاوز حد التخزين المسموح');
    }
  }

  static updateAdminUser(id: number, updates: Partial<AdminUser>): void {
    console.log('UserService: Updating user:', id, updates);
    const users = this.getAdminUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.saveAdminUsers(users);
      console.log('UserService: User updated successfully');
    } else {
      console.warn('UserService: User not found for update:', id);
    }
  }

  static addAdminUser(user: Omit<AdminUser, 'id'>): AdminUser {
    console.log('UserService: Adding new user:', user);
    const users = this.getAdminUsers();
    const newUser: AdminUser = {
      ...user,
      id: Date.now()
    };
    users.push(newUser);
    this.saveAdminUsers(users);
    console.log('UserService: New user added:', newUser);
    return newUser;
  }

  static deleteAdminUser(id: number): void {
    console.log('UserService: Deleting user:', id);
    const users = this.getAdminUsers().filter(u => u.id !== id);
    this.saveAdminUsers(users);
    console.log('UserService: User deleted successfully');
  }
}

export default UserService;
