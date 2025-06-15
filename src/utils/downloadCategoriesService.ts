class DownloadCategoriesService {
  private static readonly STORAGE_KEY = 'download_categories';

  static getCategories(): string[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading download categories:', error);
    }
    
    // الفئات الافتراضية
    return ['ألعاب', 'أدوات', 'تصميم', 'برمجة', 'موسيقى', 'فيديو', 'كتب', 'أمان', 'بيباس', 'هكر'];
  }

  static saveCategories(categories: string[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories));
      console.log('Download categories saved successfully');
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
}

export default DownloadCategoriesService;
