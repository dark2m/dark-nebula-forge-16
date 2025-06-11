
import React from 'react';
import { Save } from 'lucide-react';
import { SiteSettings } from '../../types/admin';

interface ContactTabProps {
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  saveSiteSettings: () => void;
}

const ContactTab: React.FC<ContactTabProps> = ({ 
  siteSettings, 
  setSiteSettings, 
  saveSiteSettings 
}) => {
  const handleSave = () => {
    console.log('ContactTab: Saving contact settings:', siteSettings.contactInfo);
    saveSiteSettings();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">إعدادات التواصل</h2>
      
      <div className="admin-card rounded-xl p-6">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">تيليجرام</label>
              <input
                type="text"
                value={siteSettings.contactInfo?.telegram || ''}
                onChange={(e) => setSiteSettings({
                  ...siteSettings,
                  contactInfo: { ...siteSettings.contactInfo, telegram: e.target.value }
                })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                placeholder="@username"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">ديسكورد</label>
              <input
                type="text"
                value={siteSettings.contactInfo?.discord || ''}
                onChange={(e) => setSiteSettings({
                  ...siteSettings,
                  contactInfo: { ...siteSettings.contactInfo, discord: e.target.value }
                })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                placeholder="Discord Server"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">واتساب</label>
              <input
                type="text"
                value={siteSettings.contactInfo?.whatsapp || ''}
                onChange={(e) => setSiteSettings({
                  ...siteSettings,
                  contactInfo: { ...siteSettings.contactInfo, whatsapp: e.target.value }
                })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                placeholder="+966 XX XXX XXXX"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={siteSettings.contactInfo?.email || ''}
                onChange={(e) => setSiteSettings({
                  ...siteSettings,
                  contactInfo: { ...siteSettings.contactInfo, email: e.target.value }
                })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                placeholder="support@dark.com"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="glow-button flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Save className="w-4 h-4" />
            <span>حفظ إعدادات التواصل</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactTab;
