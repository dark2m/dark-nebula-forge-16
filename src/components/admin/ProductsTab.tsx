
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ProductFeaturesManager from '../ProductFeaturesManager';
import MediaManager from '../MediaManager';
import { useToast } from '@/hooks/use-toast';
import { useProductManagement } from '@/hooks/useProductManagement';

interface ProductsTabProps {
  canAccess: (role: 'مدير عام' | 'مبرمج' | 'مشرف') => boolean;
}

const ProductsTab: React.FC<ProductsTabProps> = ({ canAccess }) => {
  const { toast } = useToast();
  const { products, addProduct, updateProduct, deleteProduct } = useProductManagement(canAccess, toast);

  const categories = [
    { value: 'pubg', label: 'هكر ببجي موبايل' },
    { value: 'web', label: 'برمجة مواقع' },
    { value: 'discord', label: 'برمجة بوتات ديسكورد' },
    { value: 'other', label: 'خدمات أخرى' }
  ];

  const addProductByCategory = async (category: string) => {
    const categoryLabels: { [key: string]: string } = {
      pubg: 'هكر ببجي موبايل',
      web: 'موقع ويب',
      discord: 'بوت ديسكورد',
      other: 'خدمة'
    };

    const newProduct = await addProduct();
    if (newProduct) {
      setTimeout(() => {
        updateProduct(newProduct.id, { 
          category, 
          name: `${categoryLabels[category]} جديد` 
        });
      }, 100);
    }
  };

  const handleInputChange = (productId: number, field: string, value: any) => {
    console.log('Immediate save for product:', productId, field, value);
    updateProduct(productId, { [field]: value });
  };

  const createMediaChangeHandler = (productId: number) => {
    return {
      onImagesChange: (receivedProductId: number, images: string[]) => {
        console.log(`Saving images for product ${receivedProductId}`);
        updateProduct(receivedProductId, { images });
      },
      onVideosChange: (receivedProductId: number, videos: string[]) => {
        console.log(`Saving videos for product ${receivedProductId}`);
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
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                  <div className="lg:col-span-2">
                    <label className="block text-gray-400 text-sm mb-2">اسم المنتج</label>
                    <input
                      type="text"
                      value={product.name || ''}
                      onChange={(e) => handleInputChange(product.id, 'name', e.target.value)}
                      className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">الفئة</label>
                    <select
                      value={product.category || 'pubg'}
                      onChange={(e) => handleInputChange(product.id, 'category', e.target.value)}
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
                      value={product.description || ''}
                      onChange={(e) => handleInputChange(product.id, 'description', e.target.value)}
                      className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400 h-20 resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">السعر ($)</label>
                    <input
                      type="number"
                      value={product.price || 0}
                      onChange={(e) => handleInputChange(product.id, 'price', Number(e.target.value))}
                      className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                <MediaManager
                  productId={product.id}
                  images={product.images || []}
                  videos={product.videos || []}
                  onImagesChange={mediaHandlers.onImagesChange}
                  onVideosChange={mediaHandlers.onVideosChange}
                />

                <ProductFeaturesManager
                  features={product.features || []}
                  onFeaturesChange={(features) => {
                    updateProduct(product.id, { features });
                  }}
                />

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-400 hover:text-red-300 transition-colors p-2 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>حذف المنتج</span>
                  </button>
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
