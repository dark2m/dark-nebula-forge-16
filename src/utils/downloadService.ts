
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
    
    // Default downloads with images and videos
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
        icon: 'Shield',
        images: [
          "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600",
          "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600"
        ],
        videos: [
          "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
        ],
        passwordCategory: "ألعاب"
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
        icon: 'Package',
        images: [
          "https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=800&h=600"
        ],
        passwordCategory: "أدوات"
      },
      {
        id: 3,
        title: "Security Scanner Pro",
        description: "أداة فحص الأمان المتقدمة للشبكات والتطبيقات",
        category: "أمان",
        size: "25.4 MB",
        downloads: 892,
        rating: 4.9,
        version: "3.2.0",
        lastUpdate: "منذ 3 أيام",
        features: ["فحص الثغرات", "مراقبة الشبكة", "تقارير مفصلة", "حماية متقدمة"],
        status: "شائع",
        icon: 'Shield',
        images: [
          "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600",
          "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600"
        ],
        passwordCategory: "أمان"
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

  static addImage(downloadId: number, imageUrl: string): void {
    const downloads = this.getDownloads();
    const download = downloads.find(d => d.id === downloadId);
    if (download) {
      if (!download.images) download.images = [];
      download.images.push(imageUrl);
      this.saveDownloads(downloads);
    }
  }

  static removeImage(downloadId: number, imageUrl: string): void {
    const downloads = this.getDownloads();
    const download = downloads.find(d => d.id === downloadId);
    if (download && download.images) {
      download.images = download.images.filter(img => img !== imageUrl);
      this.saveDownloads(downloads);
    }
  }

  static addVideo(downloadId: number, videoUrl: string): void {
    const downloads = this.getDownloads();
    const download = downloads.find(d => d.id === downloadId);
    if (download) {
      if (!download.videos) download.videos = [];
      download.videos.push(videoUrl);
      this.saveDownloads(downloads);
    }
  }

  static removeVideo(downloadId: number, videoUrl: string): void {
    const downloads = this.getDownloads();
    const download = downloads.find(d => d.id === downloadId);
    if (download && download.videos) {
      download.videos = download.videos.filter(vid => vid !== videoUrl);
      this.saveDownloads(downloads);
    }
  }
}

export default DownloadService;
