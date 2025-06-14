
import { CartService } from './cartService';
import { ProductService } from './productService';
import { LocalStorageService } from './localStorageService';
import { SettingsService } from './settingsService';

class AdminStorage {
  // Get all data for backup
  static getAllData() {
    return {
      products: ProductService.getProducts(),
      settings: SettingsService.getSiteSettings(),
      cart: CartService.getCartItems(),
      adminUsers: LocalStorageService.getAdminUsers(),
      tools: LocalStorageService.getTools()
    };
  }

  // Clear all data
  static clearAllData() {
    LocalStorageService.saveProducts([]);
    LocalStorageService.clearCart();
    SettingsService.invalidateCache();
  }

  // Import data from backup
  static importData(data: any) {
    if (data.products) {
      LocalStorageService.saveProducts(data.products);
    }
    if (data.settings) {
      LocalStorageService.saveSiteSettings(data.settings);
    }
    if (data.adminUsers) {
      LocalStorageService.saveAdminUsers(data.adminUsers);
    }
    if (data.tools) {
      LocalStorageService.saveTools(data.tools);
    }
    
    // Clear cache to reload fresh data
    SettingsService.invalidateCache();
  }

  // Get storage statistics
  static getStorageStats() {
    const data = this.getAllData();
    return {
      products: data.products.length,
      settings: Object.keys(data.settings).length,
      cartItems: data.cart.length,
      adminUsers: data.adminUsers.length,
      tools: data.tools.length
    };
  }
}

export default AdminStorage;
