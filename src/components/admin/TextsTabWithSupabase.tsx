
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseSiteSettings } from '@/hooks/useSupabaseSiteSettings';
import TextsTabHeader from './texts/TextsTabHeader';
import TextsTabSearch from './texts/TextsTabSearch';
import TextsTabSections from './texts/TextsTabSections';
import TextsTabContent from './texts/TextsTabContent';
import TextsTabStats from './texts/TextsTabStats';

const TextsTabWithSupabase: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const {
    settings: siteSettings,
    loading,
    saving,
    saveSettings,
    updatePageTexts
  } = useSupabaseSiteSettings();

  const handleSave = () => {
    console.log('TextsTab: Saving text settings:', siteSettings.pageTexts);
    saveSettings(siteSettings);
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ جميع التغييرات على النصوص"
    });
  };

  const exportTexts = () => {
    const textsData = JSON.stringify(siteSettings.pageTexts, null, 2);
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
        const updatedSettings = {
          ...siteSettings,
          pageTexts: importedTexts
        };
        saveSettings(updatedSettings);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">جاري تحميل النصوص...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <TextsTabHeader 
        onSave={handleSave}
        onExport={exportTexts}
        onImport={importTexts}
      />

      <TextsTabSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
        <TextsTabSections 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          searchTerm={searchTerm}
        />

        <TextsTabContent 
          activeSection={activeSection}
          siteSettings={siteSettings}
          updatePageTexts={updatePageTexts}
        />
      </div>

      <TextsTabStats 
        siteSettings={siteSettings}
        onExport={exportTexts}
      />

      {saving && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          جاري الحفظ...
        </div>
      )}
    </div>
  );
};

export default TextsTabWithSupabase;
