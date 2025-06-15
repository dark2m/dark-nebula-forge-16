
export interface DownloadItem {
  id: number;
  title: string;
  description: string;
  category: string;
  size: string;
  downloads: number;
  rating: number;
  version: string;
  lastUpdate: string;
  features: string[];
  status: string;
  icon: string;
  downloadUrl?: string;
  filename?: string;
  images?: string[];
  videos?: string[];
  passwordCategory?: string; // فئة كلمة المرور المطلوبة
}

export interface DownloadPassword {
  id: number;
  name: string;
  password: string;
  allowedCategories: string[];
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
  description?: string;
}
