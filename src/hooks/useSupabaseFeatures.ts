
import { useSiteData } from './useSiteData';

export const useSupabaseFeatures = () => {
  const siteData = useSiteData();
  
  return {
    ...siteData,
    // Legacy compatibility properties
    data: siteData,
    saving: false,
    saveData: siteData.refreshData,
    autoSave: false,
    loadData: siteData.refreshData
  };
};
