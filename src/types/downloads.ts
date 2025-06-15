
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
}
