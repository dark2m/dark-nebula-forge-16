
import React, { useState, useEffect } from 'react';
import { Save, FileText, Globe, MessageSquare, Download, Upload, Copy, Languages } from 'lucide-react';
import AdminStorage, { SiteSettings } from '../../utils/adminStorage';
import { useToast } from '@/hooks/use-toast';
import TextEditor from './TextEditor';
import TranslationService from '../../utils/translationService';

const TextsTab = () => {
  const [settings, setSettings] = useState<SiteSettings>(AdminStorage.getSiteSettings());
  const [activeSection, setActiveSection] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
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

  const exportTexts = () => {
    const textsData = JSON.stringify(settings.pageTexts, null, 2);
    const blob = new Blob([textsData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site-texts.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "تم تصدير النصوص",
      description: "تم تصدير جميع النصوص إلى ملف JSON"
    });
  };

  const importTexts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTexts = JSON.parse(e.target?.result as string);
        setSettings(prev => ({
          ...prev,
          pageTexts: importedTexts
        }));
        toast({
          title: "تم استيراد النصوص",
          description: "تم استيراد النصوص بنجاح"
        });
      } catch (error) {
        toast({
          title: "خطأ في الاستيراد",
          description: "تأكد من صحة ملف JSON",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const copyTextContent = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم نسخ النص",
      description: "تم نسخ النص إلى الحافظة"
    });
  };

  const sections = [
    { id: 'home', name: 'الصفحة الرئيسية', icon: Globe },
    { id: 'official', name: 'الصفحة الرسمية', icon: FileText },
    { id: 'pubgHacks', name: 'هكر ببجي موبايل', icon: MessageSquare },
    { id: 'webDevelopment', name: 'برمجة مواقع', icon: MessageSquare },
    { id: 'discordBots', name: 'برمجة بوتات ديسكورد', icon: MessageSquare },
    { id: 'cart', name: 'السلة', icon: MessageSquare },
    { id: 'navigation', name: 'التنقل', icon: MessageSquare }
  ];

  const filteredSections = sections.filter(section =>
    section.name.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">إدارة النصوص المتقدمة</h2>
        <div className="flex gap-3">
          {/* أدوات الاستيراد والتصدير */}
          <input
            type="file"
            accept=".json"
            onChange={importTexts}
            className="hidden"
            id="import-texts"
          />
          <label
            htmlFor="import-texts"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4" />
            استيراد
          </label>
          
          <button
            onClick={exportTexts}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            تصدير
          </button>
          
          <button
            onClick={saveSettings}
            className="glow-button flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Save className="w-4 h-4" />
            <span>حفظ التغييرات</span>
          </button>
        </div>
      </div>

      {/* إعدادات الترجمة */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Languages className="w-5 h-5" />
          إعدادات الترجمة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">اللغة الحالية</label>
            <div className="flex items-center gap-3">
              <span className="text-white font-medium">
                {TranslationService.getCurrentLanguage() === 'ar' ? 'العربية' : 'English'}
              </span>
              <button
                onClick={() => TranslationService.toggleLanguage()}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                <Languages className="w-4 h-4" />
                تبديل اللغة
              </button>
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">إعدادات اللغة</label>
            <p className="text-gray-300 text-sm">
              يمكنك تبديل لغة الموقع بين العربية والإنجليزية من أي صفحة
            </p>
          </div>
        </div>
      </div>

      {/* شريط البحث */}
      <div className="admin-card rounded-xl p-4">
        <input
          type="text"
          placeholder="البحث في الأقسام..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 text-white border border-white/20 rounded px-4 py-2 focus:outline-none focus:border-blue-400"
        />
      </div>

      {/* تبويبات الأقسام */}
      <div className="admin-card rounded-xl p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {filteredSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.name}
              </button>
            );
          })}
        </div>

        {/* محتوى القسم النشط */}
        <div className="space-y-6">
          {/* الصفحة الرئيسية */}
          {activeSection === 'home' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">نصوص الصفحة الرئيسية</h3>
              
              <TextEditor
                label="عنوان البطل"
                value={settings.pageTexts.home.heroTitle}
                onChange={(value) => updatePageTexts('home', 'heroTitle', value)}
                placeholder="أدخل عنوان البطل هنا..."
              />
              
              <TextEditor
                label="نص تحت العنوان"
                value={settings.pageTexts.home.heroSubtitle}
                onChange={(value) => updatePageTexts('home', 'heroSubtitle', value)}
                placeholder="أدخل النص التوضيحي هنا..."
              />
              
              <TextEditor
                label="عنوان المميزات"
                value={settings.pageTexts.home.featuresTitle}
                onChange={(value) => updatePageTexts('home', 'featuresTitle', value)}
                placeholder="أدخل عنوان قسم المميزات..."
              />
            </div>
          )}

          {/* الصفحة الرسمية */}
          {activeSection === 'official' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">نصوص الصفحة الرسمية</h3>
              
              <TextEditor
                label="عنوان الصفحة"
                value={settings.pageTexts.official.pageTitle}
                onChange={(value) => updatePageTexts('official', 'pageTitle', value)}
              />
              
              <TextEditor
                label="وصف الصفحة"
                value={settings.pageTexts.official.pageSubtitle}
                onChange={(value) => updatePageTexts('official', 'pageSubtitle', value)}
              />
              
              <TextEditor
                label="عنوان من نحن"
                value={settings.pageTexts.official.aboutTitle}
                onChange={(value) => updatePageTexts('official', 'aboutTitle', value)}
              />
              
              {settings.pageTexts.official.aboutContent.map((content, index) => (
                <TextEditor
                  key={index}
                  label={`محتوى من نحن - الفقرة ${index + 1}`}
                  value={content}
                  onChange={(value) => {
                    const newContent = [...settings.pageTexts.official.aboutContent];
                    newContent[index] = value;
                    updatePageTexts('official', 'aboutContent', newContent);
                  }}
                />
              ))}
              
              <TextEditor
                label="عنوان التواصل"
                value={settings.pageTexts.official.contactTitle}
                onChange={(value) => updatePageTexts('official', 'contactTitle', value)}
              />
            </div>
          )}

          {/* باقي الأقسام */}
          {(activeSection === 'pubgHacks' || activeSection === 'webDevelopment' || activeSection === 'discordBots') && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">
                نصوص {sections.find(s => s.id === activeSection)?.name}
              </h3>
              
              <TextEditor
                label="عنوان الصفحة"
                value={settings.pageTexts[activeSection as keyof typeof settings.pageTexts].pageTitle}
                onChange={(value) => updatePageTexts(activeSection, 'pageTitle', value)}
              />
              
              <TextEditor
                label="وصف الصفحة"
                value={settings.pageTexts[activeSection as keyof typeof settings.pageTexts].pageSubtitle}
                onChange={(value) => updatePageTexts(activeSection, 'pageSubtitle', value)}
              />
            </div>
          )}

          {/* قسم السلة */}
          {activeSection === 'cart' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">نصوص السلة</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextEditor
                  label="عنوان السلة"
                  value={settings.pageTexts.cart.cartTitle}
                  onChange={(value) => updatePageTexts('cart', 'cartTitle', value)}
                />
                
                <TextEditor
                  label="رسالة السلة الفارغة"
                  value={settings.pageTexts.cart.emptyCartMessage}
                  onChange={(value) => updatePageTexts('cart', 'emptyCartMessage', value)}
                />
                
                <TextEditor
                  label="زر الشراء"
                  value={settings.pageTexts.cart.purchaseButton}
                  onChange={(value) => updatePageTexts('cart', 'purchaseButton', value)}
                />
                
                <TextEditor
                  label="زر إضافة للسلة"
                  value={settings.pageTexts.cart.addToCartButton}
                  onChange={(value) => updatePageTexts('cart', 'addToCartButton', value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* أدوات إضافية */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">أدوات إضافية</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h4 className="text-blue-400 font-semibold mb-2">📊 إحصائيات النصوص</h4>
            <p className="text-gray-300 text-sm">
              عدد النصوص: {Object.keys(settings.pageTexts).length} قسم
            </p>
          </div>
          
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <h4 className="text-green-400 font-semibold mb-2">🔄 نسخ احتياطي</h4>
            <button
              onClick={exportTexts}
              className="text-sm text-green-400 hover:text-green-300"
            >
              إنشاء نسخة احتياطية
            </button>
          </div>
          
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <h4 className="text-purple-400 font-semibold mb-2">🌐 الترجمة</h4>
            <p className="text-gray-300 text-sm">
              اللغة الحالية: {TranslationService.getCurrentLanguage() === 'ar' ? 'العربية' : 'English'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextsTab;
