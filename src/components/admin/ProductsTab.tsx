
import React from 'react';
import { Plus, Trash2, Edit3, Save, Image, Video, Star, Package, DollarSign } from 'lucide-react';
import ProductFeaturesManager from '../ProductFeaturesManager';
import MediaManager from '../MediaManager';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';

interface ProductsTabProps {
  canAccess: (role: 'مدير عام' | 'مبرمج' | 'مشرف') => boolean;
}

const ProductsTab: React.FC<ProductsTabProps> = ({ canAccess }) => {
  const { toast } = useToast();
  const { products, isLoading, isSaving, addProduct, updateProduct, deleteProduct } = useSupabaseProducts();

  const categories = [
    { value: 'pubg', label: 'هكر ببجي موبايل', color: 'bg-gradient-to-r from-blue-500 to-blue-600', icon: '🎮' },
    { value: 'web', label: 'برمجة مواقع', color: 'bg-gradient-to-r from-purple-500 to-purple-600', icon: '🌐' },
    { value: 'discord', label: 'بوتات ديسكورد', color: 'bg-gradient-to-r from-indigo-500 to-indigo-600', icon: '🤖' },
    { value: 'other', label: 'خدمات أخرى', color: 'bg-gradient-to-r from-teal-500 to-teal-600', icon: '⚡' }
  ];

  const addProductByCategory = async (category: string) => {
    if (!canAccess('مبرمج')) {
      toast({
        title: "غير مسموح",
        description: "ليس لديك صلاحية لإضافة المنتجات",
        variant: "destructive"
      });
      return;
    }
    
    await addProduct(category);
  };

  const handleInputChange = async (productId: number, field: string, value: any) => {
    if (!canAccess('مبرمج')) {
      toast({
        title: "غير مسموح",
        description: "ليس لديك صلاحية لتعديل المنتجات",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Immediate save for product:', productId, field, value);
    await updateProduct(productId, { [field]: value });
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!canAccess('مبرمج')) {
      toast({
        title: "غير مسموح",
        description: "ليس لديك صلاحية لحذف المنتجات",
        variant: "destructive"
      });
      return;
    }
    
    await deleteProduct(productId);
  };

  const createMediaChangeHandler = (productId: number) => {
    return {
      onImagesChange: async (receivedProductId: number, images: string[]) => {
        console.log(`Saving images for product ${receivedProductId}`);
        await updateProduct(receivedProductId, { images });
      },
      onVideosChange: async (receivedProductId: number, videos: string[]) => {
        console.log(`Saving videos for product ${receivedProductId}`);
        await updateProduct(receivedProductId, { videos });
      }
    };
  };

  const renderStars = (rating: number, productId: number) => {
    return (
      <div className="flex items-center space-x-1 rtl:space-x-reverse">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleInputChange(productId, 'rating', star)}
            className="transition-colors hover:scale-110 transform duration-200"
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-400 hover:text-yellow-300'
              }`}
            />
          </button>
        ))}
        <span className="text-gray-400 text-sm mr-2">{rating}/5</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">جاري تحميل المنتجات...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header محسن */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl flex items-center justify-center">
              <Package className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">إدارة المنتجات</h2>
              <p className="text-gray-400">أضف وعدل منتجاتك - محفوظة للجميع</p>
            </div>
          </div>
          <div className="text-center bg-white/5 rounded-xl p-4">
            <div className="text-3xl font-bold text-blue-400">{products.length}</div>
            <div className="text-gray-400 text-sm">منتج</div>
          </div>
        </div>
      </div>

      {/* أزرار إضافة المنتجات - تصميم محسن */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => addProductByCategory(cat.value)}
            disabled={isSaving}
            className={`${cat.color} p-6 rounded-2xl hover:scale-105 transition-all duration-300 group shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Plus className="w-5 h-5 text-white" />
                <span className="font-medium text-white">{cat.label}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* حالة الحفظ */}
      {isSaving && (
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
            <span className="text-blue-300">جاري الحفظ...</span>
          </div>
        </div>
      )}

      {/* قائمة المنتجات - تصميم محسن */}
      <div className="space-y-6">
        {products.map((product) => {
          const mediaHandlers = createMediaChangeHandler(product.id);
          const categoryInfo = categories.find(c => c.value === product.category);
          
          return (
            <div key={product.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-blue-400/30 transition-all duration-300 shadow-lg">
              {/* Header المنتج محسن */}
              <div className={`${categoryInfo?.color || 'bg-gradient-to-r from-gray-600 to-gray-700'} p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="text-3xl bg-white/20 rounded-xl p-3">
                      {categoryInfo?.icon || '📦'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {product.name} #{product.id}
                      </h3>
                      <span className="text-white/80">{categoryInfo?.label}</span>
                      <div className="mt-2">
                        {renderStars(product.rating || 5, product.id)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="bg-white/20 rounded-xl px-4 py-2 flex items-center space-x-2 rtl:space-x-reverse">
                      <DollarSign className="w-5 h-5 text-white" />
                      <span className="text-white font-medium text-lg">{product.price}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      disabled={isSaving}
                      className="bg-orange-500/20 hover:bg-orange-500/40 rounded-xl p-3 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5 text-orange-300" />
                    </button>
                  </div>
                </div>
              </div>

              {/* محتوى المنتج */}
              <div className="p-8 space-y-8">
                {/* المعلومات الأساسية */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-blue-300 text-sm font-medium mb-3">اسم المنتج</label>
                    <input
                      type="text"
                      value={product.name || ''}
                      onChange={(e) => handleInputChange(product.id, 'name', e.target.value)}
                      disabled={isSaving}
                      className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 transition-colors disabled:opacity-50"
                      placeholder="اسم المنتج..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-purple-300 text-sm font-medium mb-3">الفئة</label>
                    <select
                      value={product.category || 'pubg'}
                      onChange={(e) => handleInputChange(product.id, 'category', e.target.value)}
                      disabled={isSaving}
                      className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-400 transition-colors disabled:opacity-50"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value} className="bg-gray-800">
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-green-300 text-sm font-medium mb-3">السعر ($)</label>
                    <input
                      type="number"
                      value={product.price || 0}
                      onChange={(e) => handleInputChange(product.id, 'price', Number(e.target.value))}
                      disabled={isSaving}
                      className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 transition-colors disabled:opacity-50"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* التقييم */}
                <div>
                  <label className="block text-yellow-300 text-sm font-medium mb-3">تقييم المنتج</label>
                  <div className="bg-black/10 rounded-xl p-4">
                    {renderStars(product.rating || 5, product.id)}
                  </div>
                </div>

                {/* الوصف */}
                <div>
                  <label className="block text-cyan-300 text-sm font-medium mb-3">الوصف</label>
                  <textarea
                    value={product.description || ''}
                    onChange={(e) => handleInputChange(product.id, 'description', e.target.value)}
                    disabled={isSaving}
                    className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-4 py-4 focus:outline-none focus:border-cyan-400 transition-colors h-24 resize-none disabled:opacity-50"
                    placeholder="وصف المنتج..."
                  />
                </div>

                {/* إدارة الوسائط */}
                <div className="bg-black/10 rounded-xl p-6">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
                    <Image className="w-6 h-6 text-blue-400" />
                    <Video className="w-6 h-6 text-purple-400" />
                    <h4 className="text-white font-medium text-lg">الصور والفيديوهات</h4>
                  </div>
                  
                  <MediaManager
                    productId={product.id}
                    images={product.images || []}
                    videos={product.videos || []}
                    onImagesChange={mediaHandlers.onImagesChange}
                    onVideosChange={mediaHandlers.onVideosChange}
                  />
                </div>

                {/* المميزات */}
                <div className="bg-black/10 rounded-xl p-6">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
                    <Star className="w-6 h-6 text-yellow-400" />
                    <h4 className="text-white font-medium text-lg">مميزات المنتج</h4>
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

      {/* Empty State محسن */}
      {products.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10">
            <div className="text-6xl mb-6">📦</div>
            <h3 className="text-2xl font-bold text-white mb-3">لا توجد منتجات</h3>
            <p className="text-gray-400 mb-8 text-lg">ابدأ بإضافة منتجك الأول</p>
            <div className="flex justify-center space-x-4 rtl:space-x-reverse">
              {categories.slice(0, 2).map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => addProductByCategory(cat.value)}
                  disabled={isSaving}
                  className={`${cat.color} px-6 py-3 rounded-xl text-white font-medium hover:scale-105 transition-transform shadow-lg disabled:opacity-50`}
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
