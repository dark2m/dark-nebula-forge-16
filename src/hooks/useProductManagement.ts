
import { useState, useEffect } from 'react';
import { ProductService } from '../utils/productService';
import type { Product } from '../types/admin';

export const useProductManagement = (canAccess: any, toast: any) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const allProducts = ProductService.getProducts();
    setProducts(allProducts);
  };

  const addProduct = () => {
    const newProduct = {
      name: 'منتج جديد',
      price: 0,
      category: 'pubg',
      description: 'وصف المنتج',
      features: [],
      images: [],
      videos: [],
      textSize: 'medium' as const,
      titleSize: 'large' as const
    };

    const createdProduct = ProductService.addProduct(newProduct);
    loadProducts();
    return createdProduct;
  };

  const updateProduct = (id: number, updates: Partial<Product>) => {
    ProductService.updateProduct(id, updates);
    loadProducts();
  };

  const deleteProduct = (id: number) => {
    ProductService.deleteProduct(id);
    loadProducts();
    toast({
      title: "تم حذف المنتج",
      description: "تم حذف المنتج بنجاح"
    });
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    loadProducts
  };
};
