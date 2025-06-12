
import React from 'react';
import { SiteSettings } from '../../../types/admin';
import TextEditor from '../TextEditor';

interface TextsTabContentProps {
  activeSection: string;
  siteSettings: SiteSettings;
  updatePageTexts: (page: string, field: string, value: any) => void;
}

const TextsTabContent: React.FC<TextsTabContentProps> = ({
  activeSection,
  siteSettings,
  updatePageTexts
}) => {
  // Helper function to safely get page section data
  const getPageSection = (sectionId: string) => {
    return siteSettings.pageTexts[sectionId as keyof typeof siteSettings.pageTexts];
  };

  // Helper function to check if a section has specific properties
  const hasProperty = (sectionId: string, property: string) => {
    const section = getPageSection(sectionId);
    return section && property in section;
  };

  const renderHomeSection = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">نصوص الصفحة الرئيسية</h3>
      
      <TextEditor
        label="عنوان البطل الرئيسي"
        value={siteSettings.pageTexts.home.heroTitle}
        onChange={(value) => updatePageTexts('home', 'heroTitle', value)}
        placeholder="أدخل عنوان البطل هنا..."
        allowStyleSaving={true}
        showSizeControl={true}
        showColorPicker={true}
      />
      
      <TextEditor
        label="نص تحت العنوان"
        value={siteSettings.pageTexts.home.heroSubtitle}
        onChange={(value) => updatePageTexts('home', 'heroSubtitle', value)}
        placeholder="أدخل النص التوضيحي هنا..."
        allowStyleSaving={true}
      />
      
      <TextEditor
        label="عنوان المميزات"
        value={siteSettings.pageTexts.home.featuresTitle}
        onChange={(value) => updatePageTexts('home', 'featuresTitle', value)}
        placeholder="أدخل عنوان قسم المميزات..."
        allowStyleSaving={true}
      />
    </div>
  );

  const renderOfficialSection = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">نصوص الصفحة الرسمية</h3>
      
      <TextEditor
        label="عنوان الصفحة"
        value={siteSettings.pageTexts.official.pageTitle}
        onChange={(value) => updatePageTexts('official', 'pageTitle', value)}
        allowStyleSaving={true}
      />
      
      <TextEditor
        label="وصف الصفحة"
        value={siteSettings.pageTexts.official.pageSubtitle}
        onChange={(value) => updatePageTexts('official', 'pageSubtitle', value)}
        allowStyleSaving={true}
      />
      
      <TextEditor
        label="عنوان من نحن"
        value={siteSettings.pageTexts.official.aboutTitle}
        onChange={(value) => updatePageTexts('official', 'aboutTitle', value)}
        allowStyleSaving={true}
      />
      
      {siteSettings.pageTexts.official.aboutContent.map((content, index) => (
        <TextEditor
          key={index}
          label={`محتوى من نحن - الفقرة ${index + 1}`}
          value={content}
          onChange={(value) => {
            const newContent = [...siteSettings.pageTexts.official.aboutContent];
            newContent[index] = typeof value === 'string' ? value : value.content;
            updatePageTexts('official', 'aboutContent', newContent);
          }}
          allowStyleSaving={false}
        />
      ))}
      
      <TextEditor
        label="عنوان التواصل"
        value={siteSettings.pageTexts.official.contactTitle}
        onChange={(value) => updatePageTexts('official', 'contactTitle', value)}
        allowStyleSaving={true}
      />
    </div>
  );

  const renderServiceSection = () => {
    const sections = [
      { id: 'pubgHacks', name: 'هكر ببجي موبايل' },
      { id: 'webDevelopment', name: 'برمجة مواقع' },
      { id: 'discordBots', name: 'برمجة بوتات ديسكورد' }
    ];

    const currentSection = sections.find(s => s.id === activeSection);
    if (!currentSection) return null;

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">
          نصوص {currentSection.name}
        </h3>
        
        {hasProperty(activeSection, 'pageTitle') && (
          <TextEditor
            label="عنوان الصفحة"
            value={(getPageSection(activeSection) as any).pageTitle}
            onChange={(value) => updatePageTexts(activeSection, 'pageTitle', value)}
            allowStyleSaving={true}
          />
        )}
        
        {hasProperty(activeSection, 'pageSubtitle') && (
          <TextEditor
            label="وصف الصفحة"
            value={(getPageSection(activeSection) as any).pageSubtitle}
            onChange={(value) => updatePageTexts(activeSection, 'pageSubtitle', value)}
            allowStyleSaving={true}
          />
        )}

        {/* إضافة المزيد من الحقول المخصصة لكل قسم */}
        {activeSection === 'pubgHacks' && (
          <>
            {hasProperty(activeSection, 'safetyTitle') && (
              <TextEditor
                label="عنوان الأمان"
                value={siteSettings.pageTexts.pubgHacks.safetyTitle}
                onChange={(value) => updatePageTexts('pubgHacks', 'safetyTitle', value)}
                allowStyleSaving={true}
              />
            )}
            {hasProperty(activeSection, 'safetyDescription') && (
              <TextEditor
                label="وصف الأمان"
                value={siteSettings.pageTexts.pubgHacks.safetyDescription}
                onChange={(value) => updatePageTexts('pubgHacks', 'safetyDescription', value)}
                allowStyleSaving={false}
              />
            )}
          </>
        )}

        {activeSection === 'webDevelopment' && hasProperty(activeSection, 'servicesTitle') && (
          <TextEditor
            label="عنوان الخدمات"
            value={siteSettings.pageTexts.webDevelopment.servicesTitle}
            onChange={(value) => updatePageTexts('webDevelopment', 'servicesTitle', value)}
            allowStyleSaving={true}
          />
        )}

        {activeSection === 'discordBots' && hasProperty(activeSection, 'featuresTitle') && (
          <TextEditor
            label="عنوان المميزات"
            value={siteSettings.pageTexts.discordBots.featuresTitle}
            onChange={(value) => updatePageTexts('discordBots', 'featuresTitle', value)}
            allowStyleSaving={true}
          />
        )}
      </div>
    );
  };

  const renderCartSection = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">نصوص السلة</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextEditor
          label="عنوان السلة"
          value={siteSettings.pageTexts.cart.cartTitle}
          onChange={(value) => updatePageTexts('cart', 'cartTitle', value)}
          allowStyleSaving={true}
        />
        
        <TextEditor
          label="رسالة السلة الفارغة"
          value={siteSettings.pageTexts.cart.emptyCartMessage}
          onChange={(value) => updatePageTexts('cart', 'emptyCartMessage', value)}
          allowStyleSaving={false}
        />
        
        <TextEditor
          label="زر الشراء"
          value={siteSettings.pageTexts.cart.purchaseButton}
          onChange={(value) => updatePageTexts('cart', 'purchaseButton', value)}
          allowStyleSaving={false}
        />
        
        <TextEditor
          label="زر إضافة للسلة"
          value={siteSettings.pageTexts.cart.addToCartButton}
          onChange={(value) => updatePageTexts('cart', 'addToCartButton', value)}
          allowStyleSaving={false}
        />
      </div>
    </div>
  );

  const renderNavigationSection = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">نصوص التنقل</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextEditor
          label="عنوان الرئيسية"
          value={siteSettings.pageTexts.navigation.homeTitle}
          onChange={(value) => updatePageTexts('navigation', 'homeTitle', value)}
          allowStyleSaving={false}
        />
        
        <TextEditor
          label="عنوان ببجي"
          value={siteSettings.pageTexts.navigation.pubgTitle}
          onChange={(value) => updatePageTexts('navigation', 'pubgTitle', value)}
          allowStyleSaving={false}
        />
        
        <TextEditor
          label="عنوان البرمجة"
          value={siteSettings.pageTexts.navigation.webTitle}
          onChange={(value) => updatePageTexts('navigation', 'webTitle', value)}
          allowStyleSaving={false}
        />
        
        <TextEditor
          label="عنوان الديسكورد"
          value={siteSettings.pageTexts.navigation.discordTitle}
          onChange={(value) => updatePageTexts('navigation', 'discordTitle', value)}
          allowStyleSaving={false}
        />
        
        <TextEditor
          label="عنوان الصفحة الرسمية"
          value={siteSettings.pageTexts.navigation.officialTitle}
          onChange={(value) => updatePageTexts('navigation', 'officialTitle', value)}
          allowStyleSaving={false}
        />
        
        <TextEditor
          label="عنوان الإدارة"
          value={siteSettings.pageTexts.navigation.adminTitle}
          onChange={(value) => updatePageTexts('navigation', 'adminTitle', value)}
          allowStyleSaving={false}
        />
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return renderHomeSection();
      case 'official':
        return renderOfficialSection();
      case 'pubgHacks':
      case 'webDevelopment':
      case 'discordBots':
        return renderServiceSection();
      case 'cart':
        return renderCartSection();
      case 'navigation':
        return renderNavigationSection();
      default:
        return renderHomeSection();
    }
  };

  return (
    <div className="space-y-6">
      {renderActiveSection()}
    </div>
  );
};

export default TextsTabContent;
