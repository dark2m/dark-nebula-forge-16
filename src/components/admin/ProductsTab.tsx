
import React from 'react';
import { Plus, Trash2, Edit3, Save, Image, Video, Star, Package, DollarSign } from 'lucide-react';
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
    { value: 'pubg', label: 'هكر ببجي موبايل', color: 'bg-red-500', icon: '🎮' },
    { value: 'web', label: 'برمجة مواقع', color: 'bg-blue-500', icon: '🌐' },
    { value: 'discord', label: 'بوتات ديسكورد', color: 'bg-purple-500', icon: '🤖' },
    { value: 'other', label: 'خدمات أخرى', color: 'bg-green-500', icon: '⚡' }
  ];

  const addProductByCategory = (category: string) => {
    const categoryLabels: { [key: string]: string } = {
      pubg: 'هكر ببجي موبايل',
      web: 'موقع ويب',
      discord: 'بوت ديسكورد',
      other: 'خدمة'
    };

    const newProduct = addProduct();
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
    <div className="space-y-6 p-6">
      {/* Header بسيط وجميل */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">إدارة المنتجات</h2>
              <p className="text-gray-400">أضف وعدل منتجاتك بسهولة</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{products.length}</div>
            <div className="text-gray-400 text-sm">منتج</div>
          </div>
        </div>
      </div>

      {/* أزرار إضافة المنتجات - تصميم بسيط */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => addProductByCategory(cat.value)}
            className={`${cat.color} p-4 rounded-xl hover:scale-105 transition-all duration-300 group`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="text-2xl group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Plus className="w-4 h-4 text-white" />
                <span className="font-medium text-white text-sm">{cat.label}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* قائمة المنتجات - تصميم نظيف وبسيط */}
      <div className="space-y-4">
        {products.map((product) => {
          const mediaHandlers = createMediaChangeHandler(product.id);
          const categoryInfo = categories.find(c => c.value === product.category);
          
          return (
            <div key={product.id} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-blue-400/30 transition-all duration-300">
              {/* Header المنتج */}
              <div className={`${categoryInfo?.color || 'bg-gray-600'} p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="text-2xl">{categoryInfo?.icon || '📦'}</div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {product.name} #{product.id}
                      </h3>
                      <span className="text-white/80 text-sm">{categoryInfo?.label}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="bg-white/20 rounded-lg px-3 py-1 flex items-center space-x-1 rtl:space-x-reverse">
                      <DollarSign className="w-4 h-4 text-white" />
                      <span className="text-white font-medium">{product.price}</span>
                    </div>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="bg-red-500/20 hover:bg-red-500/40 rounded-lg p-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-300" />
                    </button>
                  </div>
                </div>
              </div>

              {/* محتوى المنتج */}
              <div className="p-6 space-y-6">
                {/* المعلومات الأساسية - شبكة بسيطة */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-blue-300 text-sm font-medium mb-2">اسم المنتج</label>
                    <input
                      type="text"
                      value={product.name || ''}
                      onChange={(e) => handleInputChange(product.id, 'name', e.target.value)}
                      className="w-full bg-black/20 text-white border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="اسم المنتج..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-purple-300 text-sm font-medium mb-2">الفئة</label>
                    <select
                      value={product.category || 'pubg'}
                      onChange={(e) => handleInputChange(product.id, 'category', e.target.value)}
                      className="w-full bg-black/20 text-white border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400 transition-colors"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value} className="bg-gray-800">
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-green-300 text-sm font-medium mb-2">السعر ($)</label>
                    <input
                      type="number"
                      value={product.price || 0}
                      onChange={(e) => handleInputChange(product.id, 'price', Number(e.target.value))}
                      className="w-full bg-black/20 text-white border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:border-green-400 transition-colors"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* الوصف */}
                <div>
                  <label className="block text-cyan-300 text-sm font-medium mb-2">الوصف</label>
                  <textarea
                    value={product.description || ''}
                    onChange={(e) => handleInputChange(product.id, 'description', e.target.value)}
                    className="w-full bg-black/20 text-white border border-white/20 rounded-lg px-3 py-3 focus:outline-none focus:border-cyan-400 transition-colors h-20 resize-none"
                    placeholder="وصف المنتج..."
                  />
                </div>

                {/* إدارة الوسائط - تصميم بسيط */}
                <div className="bg-black/10 rounded-lg p-4">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
                    <Image className="w-5 h-5 text-blue-400" />
                    <Video className="w-5 h-5 text-purple-400" />
                    <h4 className="text-white font-medium">الصور والفيديوهات</h4>
                  </div>
                  
                  <MediaManager
                    productId={product.id}
                    images={product.images || []}
                    videos={product.videos || []}
                    onImagesChange={mediaHandlers.onImagesChange}
                    onVideosChange={mediaHandlers.onVideosChange}
                  />
                </div>

                {/* المميزات - تصميم بسيط */}
                <div className="bg-black/10 rounded-lg p-4">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <h4 className="text-white font-medium">مميزات المنتج</h4>
                  </div>
                  
                  <ProductFeaturesManager
                    features={product.features || []}
                    onFeaturesChange={(features) => {
                      updateProduct(product.id, { features });
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State - بسيط وجميل */}
      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-white mb-2">لا توجد منتجات</h3>
            <p className="text-gray-400 mb-6">ابدأ بإضافة منتجك الأول</p>
            <div className="flex justify-center space-x-3 rtl:space-x-reverse">
              {categories.slice(0, 2).map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => addProductByCategory(cat.value)}
                  className={`${cat.color} px-4 py-2 rounded-lg text-white font-medium hover:scale-105 transition-transform`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTab;
