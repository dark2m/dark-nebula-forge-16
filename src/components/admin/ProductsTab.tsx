
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import ProductFeaturesManager from '../ProductFeaturesManager';
import MediaManager from '../MediaManager';
import { useToast } from '@/hooks/use-toast';
import { useProductManagement } from '@/hooks/useProductManagement';
import type { Product } from '../../types/admin';

interface ProductsTabProps {
  canAccess: (role: 'مدير عام' | 'مبرمج' | 'مشرف') => boolean;
}

const ProductsTab: React.FC<ProductsTabProps> = ({ canAccess }) => {
  const { toast } = useToast();
  const { products, addProduct, updateProduct, deleteProduct } = useProductManagement(canAccess, toast);
  const [editedProducts, setEditedProducts] = useState<{[key: number]: Partial<Product>}>({});

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

    console.log('Adding product with category:', category);
    const newProduct = addProduct();
    
    if (newProduct) {
      // تحديث الفئة والاسم للمنتج الجديد
      setTimeout(() => {
        updateProduct(newProduct.id, { 
          category, 
          name: `${categoryLabels[category]} جديد` 
        });
      }, 100);
    }
  };

  const handleProductChange = (productId: number, field: string, value: any) => {
    console.log('Product change:', productId, field, value);
    setEditedProducts(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value
      }
    }));
  };

  const saveProduct = (productId: number) => {
    const changes = editedProducts[productId];
    console.log('Saving product changes:', productId, changes);
    
    if (changes) {
      updateProduct(productId, changes);
      setEditedProducts(prev => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
      toast({
        title: "تم حفظ المنتج",
        description: "تم حفظ التغييرات بنجاح"
      });
    }
  };

  const removeBackgroundImage = (productId: number) => {
    console.log('Removing background image for product:', productId);
    updateProduct(productId, { backgroundImage: '' });
    
    toast({
      title: "تم حذف صورة الخلفية",
      description: "تم حذف صورة الخلفية للمنتج بنجاح"
    });
  };

  const getProductValue = (product: Product, field: string) => {
    const productId = product.id;
    const editedValue = editedProducts[productId]?.[field];
    const originalValue = product[field as keyof Product];
    
    if (editedValue !== undefined) {
      return editedValue;
    }
    
    if (field === 'images' && !originalValue) return [];
    if (field === 'videos' && !originalValue) return [];
    if (field === 'features' && !originalValue) return [];
    if (field === 'textSize' && !originalValue) return 'medium';
    if (field === 'titleSize' && !originalValue) return 'large';
    
    return originalValue || '';
  };

  const hasChanges = (productId: number) => {
    return editedProducts[productId] && Object.keys(editedProducts[productId]).length > 0;
  };

  // إنشاء دالة منفصلة لكل منتج لضمان عدم خلط المعرفات
  const createMediaChangeHandler = (productId: number) => {
    return {
      onImagesChange: (receivedProductId: number, images: string[]) => {
        console.log(`Images change handler called for product ${receivedProductId}`);
        
        if (receivedProductId !== productId) {
          console.error('Product ID mismatch!', { received: receivedProductId, expected: productId });
          return;
        }
        
        updateProduct(receivedProductId, { images });
      },
      onVideosChange: (receivedProductId: number, videos: string[]) => {
        console.log(`Videos change handler called for product ${receivedProductId}`);
        
        if (receivedProductId !== productId) {
          console.error('Product ID mismatch!', { received: receivedProductId, expected: productId });
          return;
        }
        
        updateProduct(receivedProductId, { videos });
      }
    };
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
          {products.map((product) => {
            const mediaHandlers = createMediaChangeHandler(product.id);
            
            return (
              <div key={product.id} className="border border-white/10 rounded-lg p-6 space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    المنتج #{product.id} - {product.name} ({categories.find(c => c.value === product.category)?.label})
                  </h3>
                  {hasChanges(product.id) && (
                    <button
                      onClick={() => saveProduct(product.id)}
                      className="glow-button flex items-center gap-2 text-sm"
                    >
                      <Save className="w-4 h-4" />
                      حفظ التغييرات
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                  <div className="lg:col-span-2">
                    <label className="block text-gray-400 text-sm mb-2">اسم المنتج</label>
                    <input
                      type="text"
                      value={getProductValue(product, 'name') || ''}
                      onChange={(e) => handleProductChange(product.id, 'name', e.target.value)}
                      className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">الفئة</label>
                    <select
                      value={getProductValue(product, 'category') || 'pubg'}
                      onChange={(e) => handleProductChange(product.id, 'category', e.target.value)}
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
                      value={getProductValue(product, 'description') || ''}
                      onChange={(e) => handleProductChange(product.id, 'description', e.target.value)}
                      className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400 h-20 resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">السعر ($)</label>
                    <input
                      type="number"
                      value={getProductValue(product, 'price') || 0}
                      onChange={(e) => handleProductChange(product.id, 'price', Number(e.target.value))}
                      className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                <MediaManager
                  productId={product.id}
                  images={getProductValue(product, 'images') || []}
                  videos={getProductValue(product, 'videos') || []}
                  onImagesChange={mediaHandlers.onImagesChange}
                  onVideosChange={mediaHandlers.onVideosChange}
                />

                <ProductFeaturesManager
                  features={getProductValue(product, 'features') || []}
                  onFeaturesChange={(features) => handleProductChange(product.id, 'features', features)}
                />

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-400 hover:text-red-300 transition-colors p-2 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>حذف المنتج</span>
                  </button>
                  
                  {hasChanges(product.id) && (
                    <button
                      onClick={() => saveProduct(product.id)}
                      className="glow-button flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      حفظ المنتج
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductsTab;
