
import React from 'react';
import { Trash2, Save, Plus } from 'lucide-react';
import { useSupabaseSiteSettings } from '@/hooks/useSupabaseSiteSettings';

const NavigationTabWithSupabase: React.FC = () => {
  const { settings, loading, saving, saveSettings, autoSave } = useSupabaseSiteSettings();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-lg">جارِ تحميل إعدادات التنقل...</div>
      </div>
    );
  }

  const addNavigationItem = () => {
    const newItem = {
      id: `nav_${Date.now()}`,
      name: 'عنصر جديد',
      path: '/',
      icon: 'Home',
      visible: true
    };
    
    const updatedSettings = {
      ...settings,
      navigation: [...(settings.navigation || []), newItem]
    };
    
    autoSave(updatedSettings);
  };

  const removeNavigationItem = (index: number) => {
    const updatedSettings = {
      ...settings,
      navigation: settings.navigation?.filter((_, i) => i !== index) || []
    };
    
    autoSave(updatedSettings);
  };

  const updateNavigationItem = (index: number, updates: any) => {
    const newNavigation = [...(settings.navigation || [])];
    newNavigation[index] = { ...newNavigation[index], ...updates };
    
    const updatedSettings = {
      ...settings,
      navigation: newNavigation
    };
    
    autoSave(updatedSettings);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">إدارة شريط التنقل</h2>
        <div className="flex gap-3">
          <button
            onClick={addNavigationItem}
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة عنصر</span>
          </button>
          <button
            onClick={() => saveSettings(settings)}
            disabled={saving}
            className="glow-button flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'جارِ الحفظ...' : 'حفظ إعدادات التنقل'}</span>
          </button>
        </div>
      </div>
      
      <div className="admin-card rounded-xl p-6">
        <div className="space-y-4">
          {settings.navigation?.map((item, index) => (
            <div key={item.id} className="border border-white/10 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">الاسم</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateNavigationItem(index, { name: e.target.value })}
                    className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-1">المسار</label>
                  <input
                    type="text"
                    value={item.path}
                    onChange={(e) => updateNavigationItem(index, { path: e.target.value })}
                    className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">الأيقونة</label>
                  <input
                    type="text"
                    value={item.icon}
                    onChange={(e) => updateNavigationItem(index, { icon: e.target.value })}
                    className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={item.visible}
                    onChange={(e) => updateNavigationItem(index, { visible: e.target.checked })}
                    className="ml-2"
                  />
                  <label className="text-gray-300">مرئي</label>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => removeNavigationItem(index)}
                    className="text-red-400 hover:text-red-300 transition-colors p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {!settings.navigation?.length && (
          <div className="text-center py-8 text-gray-400">
            لا توجد عناصر تنقل. اضغط "إضافة عنصر" لإنشاء أول عنصر.
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationTabWithSupabase;
