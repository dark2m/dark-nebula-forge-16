
import { SiteSettings } from '@/types/admin';
import { LocalStorageService } from './localStorageService';

// Event system for settings updates
class SettingsEventEmitter {
  private listeners: Array<(settings: SiteSettings) => void> = [];

  subscribe(callback: (settings: SiteSettings) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  emit(settings: SiteSettings) {
    this.listeners.forEach(listener => listener(settings));
  }
}

const settingsEmitter = new SettingsEventEmitter();

export class SettingsService {
  private static cachedSettings: SiteSettings | null = null;

  static getSiteSettings(): SiteSettings {
    if (!this.cachedSettings) {
      this.cachedSettings = LocalStorageService.getSiteSettings();
    }
    return this.cachedSettings;
  }

  static async updateSiteSettings(settings: SiteSettings): Promise<void> {
    this.cachedSettings = settings;
    LocalStorageService.saveSiteSettings(settings);
    settingsEmitter.emit(settings);
  }

  static subscribe(callback: (settings: SiteSettings) => void) {
    return settingsEmitter.subscribe(callback);
  }

  static invalidateCache(): void {
    this.cachedSettings = null;
  }
}
