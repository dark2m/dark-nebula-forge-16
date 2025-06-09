
import React from 'react';
import { Trash2 } from 'lucide-react';
import { SiteSettings } from '../../utils/adminStorage';

interface NavigationTabProps {
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  saveSiteSettings: () => void;
}

const NavigationTab: React.FC<NavigationTabProps> = ({ 
  siteSettings, 
  setSiteSettings, 
  saveSiteSettings 
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">إدارة شريط التنقل</h2>
      
      <div className="admin-card rounded-xl p-6">
        <div className="space-y-4">
          {siteSettings.navigation?.map((item, index) => (
            <div key={item.id} className="border border-white/10 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">الاسم</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const newNavigation = [...siteSettings.navigation];
                      newNavigation[index] = { ...item, name: e.target.value };
                      setSiteSettings({ ...siteSettings, navigation: newNavigation });
                    }}
                    className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-1">المسار</label>
                  <input
                    type="text"
                    value={item.path}
                    onChange={(e) => {
                      const newNavigation = [...siteSettings.navigation];
                      newNavigation[index] = { ...item, path: e.target.value };
                      setSiteSettings({ ...siteSettings, navigation: newNavigation });
                    }}
                    className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">الأيقونة</label>
                  <input
                    type="text"
                    value={item.icon}
                    onChange={(e) => {
                      const newNavigation = [...siteSettings.navigation];
                      newNavigation[index] = { ...item, icon: e.target.value };
                      setSiteSettings({ ...siteSettings, navigation: newNavigation });
                    }}
                    className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={item.visible}
                    onChange={(e) => {
                      const newNavigation = [...siteSettings.navigation];
                      newNavigation[index] = { ...item, visible: e.target.checked };
                      setSiteSettings({ ...siteSettings, navigation: newNavigation });
                    }}
                    className="ml-2"
                  />
                  <label className="text-gray-300">مرئي</label>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      const newNavigation = siteSettings.navigation.filter((_, i) => i !== index);
                      setSiteSettings({ ...siteSettings, navigation: newNavigation });
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={saveSiteSettings}
          className="w-full glow-button mt-6"
        >
          حفظ إعدادات التنقل
        </button>
      </div>
    </div>
  );
};

export default NavigationTab;
