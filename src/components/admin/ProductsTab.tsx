
import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Edit, Save, X } from 'lucide-react';
import { Product } from '../../types/admin';
import { useProductManagement } from '../../hooks/useProductManagement';

interface ProductsTabProps {
  canAccess: (role: 'مدير عام' | 'مبرمج' | 'مشرف') => boolean;
  products?: Product[];
  addProduct?: (product: Product) => void;
  updateProduct?: (product: Product) => void;
  deleteProduct?: (id: number) => void;
}

const ProductsTab: React.FC<ProductsTabProps> = ({ canAccess }) => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    loading
  } = useProductManagement();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'pubg',
    description: '',
    features: [],
    images: [],
    videos: []
  });

  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.price !== undefined) {
      const productToAdd = {
        id: Date.now(),
        name: newProduct.name,
        price: newProduct.price,
        category: newProduct.category || 'pubg',
        description: newProduct.description || '',
        features: newProduct.features || [],
        images: newProduct.images || [],
        videos: newProduct.videos || [],
        titleSize: 'large' as const,
        textSize: 'medium' as const
      };
      
      await addProduct(productToAdd);
      setNewProduct({
        name: '',
        price: 0,
        category: 'pubg',
        description: '',
        features: [],
        images: [],
        videos: []
      });
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    await updateProduct(product);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      await deleteProduct(id);
    }
  };

  if (!canAccess('مشرف')) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">ليس لديك صلاحية للوصول إلى هذا القسم</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-white">جاري تحميل المنتجات...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">إدارة المنتجات</h2>
      
      {/* Add New Product */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">إضافة منتج جديد</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="اسم المنتج"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
          />
          <input
            type="number"
            placeholder="السعر"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
            className="bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
          />
          <select
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            className="bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
          >
            <option value="pubg">PUBG Hacks</option>
            <option value="web">Web Development</option>
            <option value="discord">Discord Bots</option>
          </select>
        </div>
        <textarea
          placeholder="وصف المنتج"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          className="w-full mt-4 bg-white/10 text-white border border-white/20 rounded px-3 py-2 h-24 resize-none focus:outline-none focus:border-blue-400"
        />
        <button
          onClick={handleAddProduct}
          className="glow-button mt-4 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة المنتج
        </button>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="admin-card rounded-xl p-6">
            {editingProduct?.id === product.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  />
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                    className="bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  />
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  >
                    <option value="pubg">PUBG Hacks</option>
                    <option value="web">Web Development</option>
                    <option value="discord">Discord Bots</option>
                  </select>
                </div>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 h-24 resize-none focus:outline-none focus:border-blue-400"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateProduct(editingProduct)}
                    className="glow-button flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    حفظ
                  </button>
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    إلغاء
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{product.name}</h3>
                  <p className="text-gray-300">${product.price}</p>
                  <p className="text-gray-400 text-sm">{product.category}</p>
                  {product.description && (
                    <p className="text-gray-300 mt-2">{product.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="text-blue-400 hover:text-blue-300 transition-colors p-2"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-400 hover:text-red-300 transition-colors p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">لا توجد منتجات حالياً</p>
        </div>
      )}
    </div>
  );
};

export default ProductsTab;
