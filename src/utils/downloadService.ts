
import type { DownloadItem } from '../types/downloads';

class DownloadService {
  private static readonly STORAGE_KEY = 'admin_downloads';

  static getDownloads(): DownloadItem[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading downloads:', error);
    }
    
    // Default downloads
    return [
      {
        id: 1,
        title: "PUBG Mobile Hack V2.0",
        description: "أحدث إصدار من هاك ببجي موبايل مع ميزات متقدمة",
        category: "ألعاب",
        size: "15.2 MB",
        downloads: 2847,
        rating: 4.8,
        version: "2.0.1",
        lastUpdate: "منذ يومين",
        features: ["Wall Hack", "Aimbot", "Speed Hack", "Recoil Control"],
        status: "جديد",
        icon: 'Shield'
      },
      {
        id: 2,
        title: "Discord Bot Builder",
        description: "أداة إنشاء بوتات ديسكورد بدون برمجة",
        category: "أدوات",
        size: "8.7 MB",
        downloads: 1523,
        rating: 4.6,
        version: "1.5.3",
        lastUpdate: "منذ أسبوع",
        features: ["واجهة بصرية", "قوالب جاهزة", "دعم API", "تحديثات تلقائية"],
        status: "محدث",
        icon: 'Package'
      },
      {
        id: 3,
        title: "Website Template Pack",
        description: "مجموعة قوالب مواقع احترافية جاهزة للاستخدام",
        category: "تصميم",
        size: "45.8 MB",
        downloads: 892,
        rating: 4.9,
        version: "3.2.0",
        lastUpdate: "منذ 3 أيام",
        features: ["HTML5/CSS3", "Bootstrap", "Responsive", "SEO Ready"],
        status: "شائع",
        icon: 'FileText'
      }
    ];
  }

  static saveDownloads(downloads: DownloadItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(downloads));
      console.log('Downloads saved successfully');
      
      // Dispatch event for other components to listen
      window.dispatchEvent(new CustomEvent('downloadsUpdated', {
        detail: { downloads }
      }));
    } catch (error) {
      console.error('Error saving downloads:', error);
      throw new Error('فشل في حفظ التنزيلات');
    }
  }
}

export default DownloadService;
