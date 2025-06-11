import React, { useState, useEffect } from 'react';
import { Save, FileText, Globe, MessageSquare, Download, Upload, Copy } from 'lucide-react';
import AdminStorage, { SiteSettings } from '../../utils/adminStorage';
import { useToast } from '@/hooks/use-toast';
import TextEditor from './TextEditor';

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

  // Helper function to safely get page section data
  const getPageSection = (sectionId: string) => {
    return settings.pageTexts[sectionId as keyof typeof settings.pageTexts];
  };

  // Helper function to check if a section has specific properties
  const hasProperty = (sectionId: string, property: string) => {
    const section = getPageSection(sectionId);
    return section && property in section;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">إدارة النصوص</h2>
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

          {/* أقسام الخدمات - pubgHacks, webDevelopment, discordBots */}
          {(activeSection === 'pubgHacks' || activeSection === 'webDevelopment' || activeSection === 'discordBots') && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">
                نصوص {sections.find(s => s.id === activeSection)?.name}
              </h3>
              
              {hasProperty(activeSection, 'pageTitle') && (
                <TextEditor
                  label="عنوان الصفحة"
                  value={(getPageSection(activeSection) as any).pageTitle}
                  onChange={(value) => updatePageTexts(activeSection, 'pageTitle', value)}
                />
              )}
              
              {hasProperty(activeSection, 'pageSubtitle') && (
                <TextEditor
                  label="وصف الصفحة"
                  value={(getPageSection(activeSection) as any).pageSubtitle}
                  onChange={(value) => updatePageTexts(activeSection, 'pageSubtitle', value)}
                />
              )}

              {/* إضافة المزيد من الحقول المخصصة لكل قسم */}
              {activeSection === 'pubgHacks' && (
                <>
                  {hasProperty(activeSection, 'safetyTitle') && (
                    <TextEditor
                      label="عنوان الأمان"
                      value={settings.pageTexts.pubgHacks.safetyTitle}
                      onChange={(value) => updatePageTexts('pubgHacks', 'safetyTitle', value)}
                    />
                  )}
                  {hasProperty(activeSection, 'safetyDescription') && (
                    <TextEditor
                      label="وصف الأمان"
                      value={settings.pageTexts.pubgHacks.safetyDescription}
                      onChange={(value) => updatePageTexts('pubgHacks', 'safetyDescription', value)}
                    />
                  )}
                </>
              )}

              {activeSection === 'webDevelopment' && hasProperty(activeSection, 'servicesTitle') && (
                <TextEditor
                  label="عنوان الخدمات"
                  value={settings.pageTexts.webDevelopment.servicesTitle}
                  onChange={(value) => updatePageTexts('webDevelopment', 'servicesTitle', value)}
                />
              )}

              {activeSection === 'discordBots' && hasProperty(activeSection, 'featuresTitle') && (
                <TextEditor
                  label="عنوان المميزات"
                  value={settings.pageTexts.discordBots.featuresTitle}
                  onChange={(value) => updatePageTexts('discordBots', 'featuresTitle', value)}
                />
              )}
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

          {/* قسم التنقل */}
          {activeSection === 'navigation' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">نصوص التنقل</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextEditor
                  label="عنوان الرئيسية"
                  value={settings.pageTexts.navigation.homeTitle}
                  onChange={(value) => updatePageTexts('navigation', 'homeTitle', value)}
                />
                
                <TextEditor
                  label="عنوان ببجي"
                  value={settings.pageTexts.navigation.pubgTitle}
                  onChange={(value) => updatePageTexts('navigation', 'pubgTitle', value)}
                />
                
                <TextEditor
                  label="عنوان البرمجة"
                  value={settings.pageTexts.navigation.webTitle}
                  onChange={(value) => updatePageTexts('navigation', 'webTitle', value)}
                />
                
                <TextEditor
                  label="عنوان الديسكورد"
                  value={settings.pageTexts.navigation.discordTitle}
                  onChange={(value) => updatePageTexts('navigation', 'discordTitle', value)}
                />
                
                <TextEditor
                  label="عنوان الصفحة الرسمية"
                  value={settings.pageTexts.navigation.officialTitle}
                  onChange={(value) => updatePageTexts('navigation', 'officialTitle', value)}
                />
                
                <TextEditor
                  label="عنوان الإدارة"
                  value={settings.pageTexts.navigation.adminTitle}
                  onChange={(value) => updatePageTexts('navigation', 'adminTitle', value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* أدوات إضافية */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">أدوات إضافية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </div>
    </div>
  );
};

export default TextsTab;
