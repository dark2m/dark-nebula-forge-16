
// Main AdminStorage class that combines all services
import AuthService from './auth';
import CartService from './cartService';
import ProductService from './productService';
import UserService from './userService';
import SettingsService from './settingsService';

// Re-export types for backward compatibility
export type { Product, AdminUser, SiteSettings, PageTexts, CartItem } from '../types/admin';

class AdminStorage {
  // Authentication methods
  static authenticateAdmin = AuthService.authenticateAdmin;
  static getCurrentUser = AuthService.getCurrentUser;
  static isAdminAuthenticated = AuthService.isAdminAuthenticated;
  static hasPermission = AuthService.hasPermission;

  // Cart methods
  static getCart = CartService.getCart;
  static addToCart = CartService.addToCart;
  static removeFromCart = CartService.removeFromCart;
  static clearCart = CartService.clearCart;

  // Product methods
  static getProducts = ProductService.getProducts;
  static saveProducts = ProductService.saveProducts;
  static addProduct = ProductService.addProduct;
  static updateProduct = ProductService.updateProduct;
  static deleteProduct = ProductService.deleteProduct;

  // User methods
  static getAdminUsers = UserService.getAdminUsers;
  static saveAdminUsers = UserService.saveAdminUsers;
  static updateAdminUser = UserService.updateAdminUser;
  static addAdminUser = UserService.addAdminUser;
  static deleteAdminUser = UserService.deleteAdminUser;

  // Settings methods
  static getSiteSettings = SettingsService.getSiteSettings;
  static saveSiteSettings = SettingsService.saveSiteSettings;
}

export default AdminStorage;
