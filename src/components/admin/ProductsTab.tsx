
import React from 'react';
import { Plus, Trash2, Edit3, Save, Image, Video, Star } from 'lucide-react';
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
    { value: 'pubg', label: 'هكر ببجي موبايل', color: 'from-red-500 to-orange-500', icon: '🎮' },
    { value: 'web', label: 'برمجة مواقع', color: 'from-blue-500 to-cyan-500', icon: '🌐' },
    { value: 'discord', label: 'برمجة بوتات ديسكورد', color: 'from-purple-500 to-pink-500', icon: '🤖' },
    { value: 'other', label: 'خدمات أخرى', color: 'from-green-500 to-emerald-500', icon: '⚡' }
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
    <div className="space-y-8 p-6">
      {/* Enhanced Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-2xl blur-xl"></div>
        <div className="relative bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-2">
                🎯 إدارة المنتجات المتطورة
              </h2>
              <p className="text-gray-300 text-lg">إدارة احترافية بتقنيات متقدمة</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-400">{products.length}</div>
              <div className="text-gray-400">منتج</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Category Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => addProductByCategory(cat.value)}
            className={`group relative overflow-hidden bg-gradient-to-r ${cat.color} p-6 rounded-2xl hover:scale-105 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]`}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative flex flex-col items-center space-y-3">
              <div className="text-3xl group-hover:scale-125 transition-transform duration-300">
                {cat.icon}
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Plus className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span className="font-semibold text-white text-sm">{cat.label}</span>
              </div>
            </div>
            
            {/* Animated Border */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-pulse"></div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Enhanced Products List */}
      <div className="space-y-6">
        {products.map((product) => {
          const mediaHandlers = createMediaChangeHandler(product.id);
          const categoryInfo = categories.find(c => c.value === product.category);
          
          return (
            <div key={product.id} className="group relative">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
                {/* Product Header */}
                <div className={`bg-gradient-to-r ${categoryInfo?.color || 'from-gray-600 to-gray-700'} p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="text-3xl">{categoryInfo?.icon || '📦'}</div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {product.name} #{product.id}
                        </h3>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse text-white/80">
                          <Star className="w-4 h-4" />
                          <span>{categoryInfo?.label}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                        <span className="text-white font-semibold">${product.price}</span>
                      </div>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="bg-red-500/20 hover:bg-red-500/40 backdrop-blur-sm rounded-lg p-2 transition-colors group"
                      >
                        <Trash2 className="w-5 h-5 text-red-300 group-hover:text-red-100" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Content */}
                <div className="p-8 space-y-8">
                  {/* Basic Info Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-4">
                      <label className="block text-blue-300 text-sm font-semibold mb-3 flex items-center">
                        <Edit3 className="w-4 h-4 mr-2" />
                        اسم المنتج
                      </label>
                      <input
                        type="text"
                        value={product.name || ''}
                        onChange={(e) => handleInputChange(product.id, 'name', e.target.value)}
                        className="w-full bg-black/30 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                        placeholder="اسم المنتج..."
                      />
                    </div>
                    
                    <div className="lg:col-span-3">
                      <label className="block text-purple-300 text-sm font-semibold mb-3">الفئة</label>
                      <select
                        value={product.category || 'pubg'}
                        onChange={(e) => handleInputChange(product.id, 'category', e.target.value)}
                        className="w-full bg-black/30 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                      >
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value} className="bg-gray-800">
                            {cat.icon} {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="lg:col-span-3">
                      <label className="block text-green-300 text-sm font-semibold mb-3">السعر ($)</label>
                      <input
                        type="number"
                        value={product.price || 0}
                        onChange={(e) => handleInputChange(product.id, 'price', Number(e.target.value))}
                        className="w-full bg-black/30 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                        placeholder="0"
                      />
                    </div>
                    
                    <div className="lg:col-span-2 flex items-end">
                      <div className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-3 text-center">
                        <Save className="w-6 h-6 text-blue-300 mx-auto mb-1" />
                        <span className="text-xs text-white/80">حفظ تلقائي</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-cyan-300 text-sm font-semibold mb-3">الوصف التفصيلي</label>
                    <textarea
                      value={product.description || ''}
                      onChange={(e) => handleInputChange(product.id, 'description', e.target.value)}
                      className="w-full bg-black/30 text-white border border-white/20 rounded-xl px-4 py-4 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 h-24 resize-none"
                      placeholder="وصف مفصل للمنتج..."
                    />
                  </div>

                  {/* Enhanced Media Manager */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-2xl"></div>
                    <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Image className="w-6 h-6 text-blue-400" />
                          <Video className="w-6 h-6 text-purple-400" />
                        </div>
                        <h4 className="text-xl font-bold text-white">إدارة الوسائط المتقدمة</h4>
                        <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-purple-500/50"></div>
                      </div>
                      
                      <MediaManager
                        productId={product.id}
                        images={product.images || []}
                        videos={product.videos || []}
                        onImagesChange={mediaHandlers.onImagesChange}
                        onVideosChange={mediaHandlers.onVideosChange}
                      />
                    </div>
                  </div>

                  {/* Enhanced Features Manager */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-red-500/5 to-pink-500/5 rounded-2xl"></div>
                    <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
                        <Star className="w-6 h-6 text-yellow-400" />
                        <h4 className="text-xl font-bold text-white">مميزات المنتج</h4>
                        <div className="flex-1 h-px bg-gradient-to-r from-yellow-500/50 to-orange-500/50"></div>
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
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
              <div className="text-6xl mb-6">📦</div>
              <h3 className="text-2xl font-bold text-white mb-4">لا توجد منتجات بعد</h3>
              <p className="text-gray-400 mb-8">ابدأ بإضافة منتجك الأول باستخدام الأزرار أعلاه</p>
              <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                {categories.slice(0, 2).map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => addProductByCategory(cat.value)}
                    className={`bg-gradient-to-r ${cat.color} px-6 py-3 rounded-xl text-white font-semibold hover:scale-105 transition-transform duration-300`}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTab;
