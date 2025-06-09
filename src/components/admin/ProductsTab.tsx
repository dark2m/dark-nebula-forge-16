
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ProductFeaturesManager from '../ProductFeaturesManager';
import MediaManager from '../MediaManager';
import type { Product } from '../../types/admin';

interface ProductsTabProps {
  products: Product[];
  addProduct: () => void;
  updateProduct: (id: number, updates: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
}

const ProductsTab: React.FC<ProductsTabProps> = ({ 
  products, 
  addProduct, 
  updateProduct, 
  deleteProduct 
}) => {
  const categories = [
    { value: 'pubg', label: 'هكر ببجي موبايل' },
    { value: 'web', label: 'برمجة مواقع' },
    { value: 'discord', label: 'برمجة بوتات ديسكورد' },
    { value: 'other', label: 'خدمات أخرى' }
  ];

  const addProductByCategory = (category: string) => {
    const categoryLabels: { [key: string]: string } = {
      pubg: 'هكر ببجي موبايل',
      web: 'موقع ويب',
      discord: 'بوت ديسكورد',
      other: 'خدمة'
    };

    const newProduct = {
      name: `${categoryLabels[category]} جديد`,
      price: 0,
      category,
      images: [],
      videos: [],
      description: 'وصف المنتج',
      features: [],
      textSize: 'medium' as const,
      titleSize: 'large' as const
    };

    // استخدام addProduct الموجودة مع تحديث الفئة
    addProduct();
    // ثم تحديث آخر منتج مضاف بالفئة المطلوبة
    setTimeout(() => {
      const allProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
      if (allProducts.length > 0) {
        const lastProduct = allProducts[allProducts.length - 1];
        updateProduct(lastProduct.id, { category, name: newProduct.name });
      }
    }, 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">إدارة المنتجات</h2>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => addProductByCategory(cat.value)}
              className="glow-button flex items-center space-x-2 rtl:space-x-reverse text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة {cat.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="admin-card rounded-xl p-6">
        <div className="space-y-8">
          {products.map((product) => (
            <div key={product.id} className="border border-white/10 rounded-lg p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-gray-400 text-sm mb-2">اسم المنتج</label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => updateProduct(product.id, { name: e.target.value })}
                    className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">الفئة</label>
                  <select
                    value={product.category}
                    onChange={(e) => updateProduct(product.id, { category: e.target.value })}
                    className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="lg:col-span-2">
                  <label className="block text-gray-400 text-sm mb-2">الوصف</label>
                  <textarea
                    value={product.description}
                    onChange={(e) => updateProduct(product.id, { description: e.target.value })}
                    className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400 h-20 resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">السعر ($)</label>
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) => updateProduct(product.id, { price: Number(e.target.value) })}
                    className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">حجم النص</label>
                  <select
                    value={product.textSize}
                    onChange={(e) => updateProduct(product.id, { textSize: e.target.value as 'small' | 'medium' | 'large' })}
                    className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  >
                    <option value="small">صغير</option>
                    <option value="medium">متوسط</option>
                    <option value="large">كبير</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">لون الخلفية</label>
                  <input
                    type="color"
                    value={product.backgroundColor || '#000000'}
                    onChange={(e) => updateProduct(product.id, { backgroundColor: e.target.value })}
                    className="w-full h-10 rounded border border-white/20"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">صورة الخلفية</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          updateProduct(product.id, { backgroundImage: event.target?.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <MediaManager
                images={product.images || []}
                videos={product.videos || []}
                onImagesChange={(images) => updateProduct(product.id, { images })}
                onVideosChange={(videos) => updateProduct(product.id, { videos })}
              />

              <ProductFeaturesManager
                features={product.features || []}
                onFeaturesChange={(features) => updateProduct(product.id, { features })}
              />

              <div className="flex justify-end">
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="text-red-400 hover:text-red-300 transition-colors p-2 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف المنتج</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsTab;
