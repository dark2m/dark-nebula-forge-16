
interface UserSessionData {
  email: string;
  rememberMe: boolean;
  lastLoginTime: string;
}

class UserDataPersistence {
  private static SESSION_KEY = 'user_session_data';
  private static BACKUP_KEY = 'user_backup_data';

  // حفظ معلومات الجلسة
  static saveUserSession(email: string, rememberMe: boolean = false) {
    const sessionData: UserSessionData = {
      email,
      rememberMe,
      lastLoginTime: new Date().toISOString()
    };

    try {
      if (rememberMe) {
        // حفظ في localStorage للجلسات الطويلة
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
      } else {
        // حفظ في sessionStorage للجلسة الحالية فقط
        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
      }
      console.log('User session saved:', email);
    } catch (error) {
      console.error('Error saving user session:', error);
    }
  }

  // استرجاع معلومات الجلسة
  static getUserSession(): UserSessionData | null {
    try {
      // البحث في localStorage أولاً
      let stored = localStorage.getItem(this.SESSION_KEY);
      if (!stored) {
        // ثم البحث في sessionStorage
        stored = sessionStorage.getItem(this.SESSION_KEY);
      }

      if (stored) {
        const sessionData = JSON.parse(stored);
        console.log('User session found:', sessionData.email);
        return sessionData;
      }
    } catch (error) {
      console.error('Error loading user session:', error);
    }
    return null;
  }

  // حذف معلومات الجلسة
  static clearUserSession() {
    localStorage.removeItem(this.SESSION_KEY);
    sessionStorage.removeItem(this.SESSION_KEY);
    console.log('User session cleared');
  }

  // إنشاء نسخة احتياطية من بيانات المستخدم المهمة
  static createUserBackup(userData: any) {
    try {
      const backup = {
        data: userData,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backup));
      console.log('User backup created');
    } catch (error) {
      console.error('Error creating backup:', error);
    }
  }

  // استعادة النسخة الاحتياطية
  static restoreUserBackup(): any | null {
    try {
      const stored = localStorage.getItem(this.BACKUP_KEY);
      if (stored) {
        const backup = JSON.parse(stored);
        console.log('User backup found:', backup.timestamp);
        return backup.data;
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
    }
    return null;
  }

  // تنظيف البيانات القديمة (احتفاظ بالبيانات لمدة 30 يوم)
  static cleanOldData() {
    try {
      const session = this.getUserSession();
      if (session) {
        const lastLogin = new Date(session.lastLoginTime);
        const now = new Date();
        const daysDiff = (now.getTime() - lastLogin.getTime()) / (1000 * 3600 * 24);
        
        if (daysDiff > 30) {
          this.clearUserSession();
          console.log('Old session data cleaned');
        }
      }
    } catch (error) {
      console.error('Error cleaning old data:', error);
    }
  }
}

export default UserDataPersistence;
