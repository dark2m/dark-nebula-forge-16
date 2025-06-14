import { Product, SiteSettings, AdminUser } from '../types/admin';
import AuthService from './auth';
import SettingsService from './settingsService';
import ProductService from './productService';

export class AdminStorage {
  private static STORAGE_KEYS = {
    PRODUCTS: 'admin_products',
    SETTINGS: 'admin_settings',
    USERS: 'admin_users',
    BACKUP_PREFIX: 'admin_backup_'
  };

  // Products Management
  static async getProducts(): Promise<Product[]> {
    try {
      return await ProductService.getProducts();
    } catch (error) {
      console.error('AdminStorage: Error getting products:', error);
      return [];
    }
  }

  static async saveProducts(products: Product[]): Promise<void> {
    try {
      await ProductService.saveProducts(products);
    } catch (error) {
      console.error('AdminStorage: Error saving products:', error);
      throw error;
    }
  }

  // Settings Management
  static async getSettings(): Promise<SiteSettings> {
    try {
      return await SettingsService.getSiteSettings();
    } catch (error) {
      console.error('AdminStorage: Error getting settings:', error);
      throw error;
    }
  }

  static async saveSettings(settings: SiteSettings): Promise<void> {
    try {
      await SettingsService.saveSiteSettings(settings);
    } catch (error) {
      console.error('AdminStorage: Error saving settings:', error);
      throw error;
    }
  }

  // Backup and Restore
  static async createBackup(): Promise<string> {
    try {
      const timestamp = new Date().toISOString();
      const backupKey = `${this.STORAGE_KEYS.BACKUP_PREFIX}${timestamp}`;
      
      const products = await this.getProducts();
      const settings = await this.getSettings();
      
      const backupData = {
        timestamp,
        products,
        settings
      };

      localStorage.setItem(backupKey, JSON.stringify(backupData));
      
      // Keep only last 10 backups
      this.cleanupOldBackups();
      
      return backupKey;
    } catch (error) {
      console.error('AdminStorage: Error creating backup:', error);
      throw error;
    }
  }

  static getBackups(): Array<{key: string, timestamp: string, data: any}> {
    const backups: Array<{key: string, timestamp: string, data: any}> = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.STORAGE_KEYS.BACKUP_PREFIX)) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          backups.push({ key, timestamp: data.timestamp, data });
        } catch (error) {
          console.error('AdminStorage: Error parsing backup:', error);
        }
      }
    }
    
    return backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  static async restoreBackup(backupKey: string): Promise<void> {
    try {
      const backupData = localStorage.getItem(backupKey);
      if (!backupData) {
        throw new Error('Backup not found');
      }

      const { products, settings } = JSON.parse(backupData);
      
      if (products) {
        await this.saveProducts(products);
      }
      
      if (settings) {
        await this.saveSettings(settings);
      }
    } catch (error) {
      console.error('AdminStorage: Error restoring backup:', error);
      throw error;
    }
  }

  static deleteBackup(backupKey: string): void {
    localStorage.removeItem(backupKey);
  }

  private static cleanupOldBackups(): void {
    const backups = this.getBackups();
    const maxBackups = 10;
    
    if (backups.length > maxBackups) {
      const oldBackups = backups.slice(maxBackups);
      oldBackups.forEach(backup => {
        localStorage.removeItem(backup.key);
      });
    }
  }

  // Users Management
  static getUsers(): AdminUser[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.USERS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('AdminStorage: Error getting users:', error);
      return [];
    }
  }

  static saveUsers(users: AdminUser[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.error('AdminStorage: Error saving users:', error);
      throw error;
    }
  }

  // Export/Import functionality
  static exportData(): string {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        products: this.getProducts(),
        settings: this.getSettings(),
        users: this.getUsers()
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('AdminStorage: Error exporting data:', error);
      throw error;
    }
  }

  static async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.products) {
        await this.saveProducts(data.products);
      }
      
      if (data.settings) {
        await this.saveSettings(data.settings);
      }
      
      if (data.users) {
        this.saveUsers(data.users);
      }
    } catch (error) {
      console.error('AdminStorage: Error importing data:', error);
      throw error;
    }
  }

  // Clear all data
  static async clearAllData(): Promise<void> {
    try {
      await this.saveProducts([]);
      
      const defaultSettings = await SettingsService.getSiteSettings();
      await this.saveSettings(defaultSettings);
      
      this.saveUsers([]);
      
      // Clear backups
      const backups = this.getBackups();
      backups.forEach(backup => this.deleteBackup(backup.key));
    } catch (error) {
      console.error('AdminStorage: Error clearing data:', error);
      throw error;
    }
  }
}

export default AdminStorage;
