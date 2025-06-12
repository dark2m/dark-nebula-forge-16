
import React, { useState } from 'react';
import { SiteSettings } from '../../types/admin';
import { useToast } from '@/hooks/use-toast';
import TextsTabHeader from './texts/TextsTabHeader';
import TextsTabSearch from './texts/TextsTabSearch';
import TextsTabSections from './texts/TextsTabSections';
import TextsTabContent from './texts/TextsTabContent';
import TextsTabStats from './texts/TextsTabStats';

interface TextsTabProps {
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  saveSiteSettings: () => void;
}

const TextsTab: React.FC<TextsTabProps> = ({ 
  siteSettings, 
  setSiteSettings, 
  saveSiteSettings 
}) => {
  const [activeSection, setActiveSection] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    console.log('TextsTab: Saving text settings:', siteSettings.pageTexts);
    saveSiteSettings();
  };

  const updatePageTexts = (page: string, field: string, value: any) => {
    console.log('TextsTab: Updating page texts:', page, field, value);
    setSiteSettings({
      ...siteSettings,
      pageTexts: {
        ...siteSettings.pageTexts,
        [page]: {
          ...siteSettings.pageTexts[page as keyof typeof siteSettings.pageTexts],
          [field]: value
        }
      }
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
        setSiteSettings({
          ...siteSettings,
          pageTexts: importedTexts
        });
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

  return (
    <div className="space-y-6">
      <TextsTabHeader 
        onSave={handleSave}
        onExport={exportTexts}
        onImport={importTexts}
      />

      <TextsTabSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="admin-card rounded-xl p-6">
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
    </div>
  );
};

export default TextsTab;
