
class DownloadCategoriesService {
  private static readonly STORAGE_KEY = 'download_categories';

  static getCategories(): string[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const categories = JSON.parse(saved);
        // If we have saved categories, return them
        if (categories && categories.length > 0) {
          return categories;
        }
      }
    } catch (error) {
      console.error('Error loading download categories:', error);
    }
    
    // الفئات الافتراضية المحدودة الجديدة
    const defaultCategories = ['أدوات', 'بيباس'];
    this.saveCategories(defaultCategories);
    return defaultCategories;
  }

  static saveCategories(categories: string[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories));
      console.log('Download categories saved successfully:', categories);
    } catch (error) {
      console.error('Error saving download categories:', error);
      throw new Error('فشل في حفظ الفئات');
    }
  }

  static addCategory(category: string): void {
    const categories = this.getCategories();
    if (!categories.includes(category) && category.trim()) {
      categories.push(category.trim());
      this.saveCategories(categories);
    }
  }

  static removeCategory(category: string): void {
    const categories = this.getCategories().filter(c => c !== category);
    // تأكد من وجود فئة واحدة على الأقل
    if (categories.length === 0) {
      categories.push('أدوات');
    }
    this.saveCategories(categories);
  }

  static updateCategory(oldCategory: string, newCategory: string): void {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c === oldCategory);
    if (index !== -1 && newCategory.trim()) {
      categories[index] = newCategory.trim();
      this.saveCategories(categories);
    }
  }

  // Reset to default limited categories
  static resetToDefault(): void {
    const defaultCategories = ['أدوات', 'بيباس'];
    this.saveCategories(defaultCategories);
  }
}

export default DownloadCategoriesService;
