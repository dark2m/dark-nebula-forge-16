
interface PendingChanges {
  products: boolean;
  settings: boolean;
  timestamp: number;
}

class PersistenceService {
  private static CHANGES_KEY = 'pending_changes';
  private static BACKUP_PREFIX = 'backup_';

  static hasPendingChanges(): boolean {
    const changes = this.getPendingChanges();
    return changes.products || changes.settings;
  }

  static setPendingChanges(type: 'products' | 'settings', value: boolean): void {
    const current = this.getPendingChanges();
    current[type] = value;
    current.timestamp = Date.now();
    
    localStorage.setItem(this.CHANGES_KEY, JSON.stringify(current));
    
    // إطلاق حدث لإعلام المكونات بالتغيير
    window.dispatchEvent(new CustomEvent('pendingChangesUpdated', {
      detail: { hasPending: this.hasPendingChanges() }
    }));
  }

  static getPendingChanges(): PendingChanges {
    try {
      const stored = localStorage.getItem(this.CHANGES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading pending changes:', error);
    }
    
    return { products: false, settings: false, timestamp: 0 };
  }

  static clearPendingChanges(): void {
    localStorage.removeItem(this.CHANGES_KEY);
    window.dispatchEvent(new CustomEvent('pendingChangesUpdated', {
      detail: { hasPending: false }
    }));
  }

  static createBackup(type: 'products' | 'settings', data: any): void {
    try {
      const backupKey = `${this.BACKUP_PREFIX}${type}_${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify(data));
      console.log(`Backup created: ${backupKey}`);
    } catch (error) {
      console.error('Error creating backup:', error);
    }
  }

  static commitChanges(): boolean {
    try {
      const changes = this.getPendingChanges();
      
      if (changes.products) {
        // إنشاء نسخة احتياطية من المنتجات
        const products = JSON.parse(localStorage.getItem('admin_products') || '[]');
        this.createBackup('products', products);
      }
      
      if (changes.settings) {
        // إنشاء نسخة احتياطية من الإعدادات
        const settings = JSON.parse(localStorage.getItem('site_settings') || '{}');
        this.createBackup('settings', settings);
      }
      
      this.clearPendingChanges();
      
      // إطلاق حدث التثبيت
      window.dispatchEvent(new CustomEvent('changesCommitted', {
        detail: { timestamp: Date.now() }
      }));
      
      return true;
    } catch (error) {
      console.error('Error committing changes:', error);
      return false;
    }
  }
}

export default PersistenceService;
