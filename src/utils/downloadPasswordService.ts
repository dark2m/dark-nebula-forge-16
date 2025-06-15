
import type { DownloadPassword } from '../types/downloads';
import DownloadCategoriesService from './downloadCategoriesService';

class DownloadPasswordService {
  private static readonly STORAGE_KEY = 'download_passwords';

  static getDownloadPasswords(): DownloadPassword[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading download passwords:', error);
    }
    
    // كلمات مرور افتراضية
    return [
      {
        id: 1,
        name: "العضوية العامة",
        password: "dark123",
        allowedCategories: ["ألعاب", "أدوات", "تصميم"],
        isActive: true,
        createdAt: new Date().toISOString(),
        usageCount: 0,
        description: "الوصول للفئات الأساسية"
      },
      {
        id: 2,
        name: "عضوية الألعاب",
        password: "games456",
        allowedCategories: ["ألعاب"],
        isActive: true,
        createdAt: new Date().toISOString(),
        usageCount: 0,
        description: "الوصول للألعاب فقط"
      },
      {
        id: 3,
        name: "عضوية الأمان",
        password: "security789",
        allowedCategories: ["أمان", "أدوات"],
        isActive: true,
        createdAt: new Date().toISOString(),
        usageCount: 0,
        description: "الوصول لأدوات الأمان"
      },
      {
        id: 4,
        name: "وصول كامل",
        password: "fullaccess999",
        allowedCategories: ["وصول كامل"],
        isActive: true,
        createdAt: new Date().toISOString(),
        usageCount: 0,
        description: "الوصول لجميع الفئات والمحتوى"
      }
    ];
  }

  static saveDownloadPasswords(passwords: DownloadPassword[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(passwords));
      console.log('Download passwords saved successfully');
    } catch (error) {
      console.error('Error saving download passwords:', error);
      throw new Error('فشل في حفظ كلمات المرور');
    }
  }

  static addPassword(password: Omit<DownloadPassword, 'id' | 'createdAt' | 'usageCount'>): DownloadPassword {
    const passwords = this.getDownloadPasswords();
    const newPassword: DownloadPassword = {
      ...password,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      usageCount: 0
    };
    passwords.push(newPassword);
    this.saveDownloadPasswords(passwords);
    return newPassword;
  }

  static updatePassword(id: number, updates: Partial<DownloadPassword>): void {
    const passwords = this.getDownloadPasswords();
    const index = passwords.findIndex(p => p.id === id);
    if (index !== -1) {
      passwords[index] = { ...passwords[index], ...updates };
      this.saveDownloadPasswords(passwords);
    }
  }

  static deletePassword(id: number): void {
    const passwords = this.getDownloadPasswords().filter(p => p.id !== id);
    this.saveDownloadPasswords(passwords);
  }

  static validatePassword(password: string): DownloadPassword | null {
    const passwords = this.getDownloadPasswords();
    const found = passwords.find(p => p.password === password && p.isActive);
    
    if (found) {
      // إذا كانت كلمة مرور "وصول كامل"، قم بتحديث الفئات المسموحة لتشمل جميع الفئات المتاحة
      if (found.allowedCategories.includes("وصول كامل")) {
        const allCategories = DownloadCategoriesService.getCategories();
        found.allowedCategories = allCategories;
      }
      
      // تحديث عداد الاستخدام
      this.updatePassword(found.id, {
        usageCount: found.usageCount + 1,
        lastUsed: new Date().toISOString()
      });
    }
    
    return found || null;
  }

  static getPasswordForCategories(categories: string[]): DownloadPassword | null {
    const passwords = this.getDownloadPasswords();
    return passwords.find(p => 
      p.isActive && 
      (p.allowedCategories.includes("وصول كامل") || 
       categories.some(cat => p.allowedCategories.includes(cat)))
    ) || null;
  }

  // دالة للتحقق من وجود وصول كامل
  static hasFullAccess(passwordData: DownloadPassword): boolean {
    return passwordData.allowedCategories.includes("وصول كامل");
  }
}

export default DownloadPasswordService;
