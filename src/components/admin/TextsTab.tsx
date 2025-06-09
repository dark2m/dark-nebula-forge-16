
import React, { useState, useEffect } from 'react';
import { Save, FileText, Globe, MessageSquare } from 'lucide-react';
import AdminStorage, { SiteSettings } from '../../utils/adminStorage';
import { useToast } from '@/hooks/use-toast';

const TextsTab = () => {
  const [settings, setSettings] = useState<SiteSettings>(AdminStorage.getSiteSettings());
  const { toast } = useToast();

  useEffect(() => {
    setSettings(AdminStorage.getSiteSettings());
  }, []);

  const saveSettings = () => {
    AdminStorage.saveSiteSettings(settings);
    toast({
      title: "تم حفظ النصوص",
      description: "تم حفظ جميع النصوص بنجاح"
    });
  };

  const updatePageTexts = (page: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      pageTexts: {
        ...prev.pageTexts,
        [page]: {
          ...prev.pageTexts[page as keyof typeof prev.pageTexts],
          [field]: value
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">إدارة النصوص</h2>
      
      {/* Home Page Texts */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          نصوص الصفحة الرئيسية
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">عنوان البطل</label>
            <input
              type="text"
              value={settings.pageTexts.home.heroTitle}
              onChange={(e) => updatePageTexts('home', 'heroTitle', e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">نص تحت العنوان</label>
            <textarea
              value={settings.pageTexts.home.heroSubtitle}
              onChange={(e) => updatePageTexts('home', 'heroSubtitle', e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 h-20 resize-none focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">عنوان المميزات</label>
            <input
              type="text"
              value={settings.pageTexts.home.featuresTitle}
              onChange={(e) => updatePageTexts('home', 'featuresTitle', e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Official Page Texts */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          نصوص الصفحة الرئيسية (الرسمية)
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">عنوان الصفحة</label>
            <input
              type="text"
              value={settings.pageTexts.official.pageTitle}
              onChange={(e) => updatePageTexts('official', 'pageTitle', e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">وصف الصفحة</label>
            <textarea
              value={settings.pageTexts.official.pageSubtitle}
              onChange={(e) => updatePageTexts('official', 'pageSubtitle', e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 h-20 resize-none focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">عنوان "من نحن"</label>
            <input
              type="text"
              value={settings.pageTexts.official.aboutTitle}
              onChange={(e) => updatePageTexts('official', 'aboutTitle', e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">محتوى "من نحن" - الفقرة الأولى</label>
            <textarea
              value={settings.pageTexts.official.aboutContent[0] || ''}
              onChange={(e) => {
                const newContent = [...settings.pageTexts.official.aboutContent];
                newContent[0] = e.target.value;
                updatePageTexts('official', 'aboutContent', newContent);
              }}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 h-24 resize-none focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">محتوى "من نحن" - الفقرة الثانية</label>
            <textarea
              value={settings.pageTexts.official.aboutContent[1] || ''}
              onChange={(e) => {
                const newContent = [...settings.pageTexts.official.aboutContent];
                newContent[1] = e.target.value;
                updatePageTexts('official', 'aboutContent', newContent);
              }}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 h-24 resize-none focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">عنوان التواصل</label>
            <input
              type="text"
              value={settings.pageTexts.official.contactTitle}
              onChange={(e) => updatePageTexts('official', 'contactTitle', e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Product Pages Texts */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          نصوص صفحات المنتجات
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PUBG Hacks */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-400">هكر ببجي موبايل</h4>
            <div>
              <label className="block text-gray-400 text-sm mb-2">عنوان الصفحة</label>
              <input
                type="text"
                value={settings.pageTexts.pubgHacks.pageTitle}
                onChange={(e) => updatePageTexts('pubgHacks', 'pageTitle', e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">وصف الصفحة</label>
              <textarea
                value={settings.pageTexts.pubgHacks.pageSubtitle}
                onChange={(e) => updatePageTexts('pubgHacks', 'pageSubtitle', e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 h-20 resize-none focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Web Development */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-400">برمجة مواقع</h4>
            <div>
              <label className="block text-gray-400 text-sm mb-2">عنوان الصفحة</label>
              <input
                type="text"
                value={settings.pageTexts.webDevelopment.pageTitle}
                onChange={(e) => updatePageTexts('webDevelopment', 'pageTitle', e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">وصف الصفحة</label>
              <textarea
                value={settings.pageTexts.webDevelopment.pageSubtitle}
                onChange={(e) => updatePageTexts('webDevelopment', 'pageSubtitle', e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 h-20 resize-none focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Discord Bots */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-purple-400">برمجة بوتات ديسكورد</h4>
            <div>
              <label className="block text-gray-400 text-sm mb-2">عنوان الصفحة</label>
              <input
                type="text"
                value={settings.pageTexts.discordBots.pageTitle}
                onChange={(e) => updatePageTexts('discordBots', 'pageTitle', e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">وصف الصفحة</label>
              <textarea
                value={settings.pageTexts.discordBots.pageSubtitle}
                onChange={(e) => updatePageTexts('discordBots', 'pageSubtitle', e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 h-20 resize-none focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Cart Texts */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">نصوص السلة</h4>
            <div>
              <label className="block text-gray-400 text-sm mb-2">عنوان السلة</label>
              <input
                type="text"
                value={settings.pageTexts.cart.cartTitle}
                onChange={(e) => updatePageTexts('cart', 'cartTitle', e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">رسالة السلة الفارغة</label>
              <input
                type="text"
                value={settings.pageTexts.cart.emptyCartMessage}
                onChange={(e) => updatePageTexts('cart', 'emptyCartMessage', e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">زر الشراء</label>
              <input
                type="text"
                value={settings.pageTexts.cart.purchaseButton}
                onChange={(e) => updatePageTexts('cart', 'purchaseButton', e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">زر إضافة للسلة</label>
              <input
                type="text"
                value={settings.pageTexts.cart.addToCartButton}
                onChange={(e) => updatePageTexts('cart', 'addToCartButton', e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          className="glow-button flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          حفظ النصوص
        </button>
      </div>
    </div>
  );
};

export default TextsTab;
