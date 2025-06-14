
import { useState, useEffect } from 'react';
import { SiteSettings, Product, Tool } from '@/types/admin';
import { LocalStorageService } from '@/utils/localStorageService';

export const useSiteData = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => 
    LocalStorageService.getSiteSettings()
  );
  const [products, setProducts] = useState<Product[]>(() => 
    LocalStorageService.getProducts()
  );
  const [tools, setTools] = useState<Tool[]>(() => 
    LocalStorageService.getTools()
  );
  const [loading, setLoading] = useState(false);

  const updateSiteSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    LocalStorageService.saveSiteSettings(newSettings);
  };

  const updateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    LocalStorageService.saveProducts(newProducts);
  };

  const updateTools = (newTools: Tool[]) => {
    setTools(newTools);
    LocalStorageService.saveTools(newTools);
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = LocalStorageService.addProduct(product);
    setProducts(LocalStorageService.getProducts());
    return newProduct;
  };

  const updateProduct = (id: number, updates: Partial<Product>) => {
    LocalStorageService.updateProduct(id, updates);
    setProducts(LocalStorageService.getProducts());
  };

  const deleteProduct = (id: number) => {
    LocalStorageService.deleteProduct(id);
    setProducts(LocalStorageService.getProducts());
  };

  const refreshData = () => {
    setSiteSettings(LocalStorageService.getSiteSettings());
    setProducts(LocalStorageService.getProducts());
    setTools(LocalStorageService.getTools());
  };

  return {
    siteSettings,
    products,
    tools,
    loading,
    updateSiteSettings,
    updateProducts,
    updateTools,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshData
  };
};
