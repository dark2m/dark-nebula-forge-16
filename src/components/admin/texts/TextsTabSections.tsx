

import React from 'react';
import { Home, Navigation, ShoppingCart, Download, MessageCircle, FileText } from 'lucide-react';

interface TextsTabSectionsProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  searchTerm: string;
}

const TextsTabSections: React.FC<TextsTabSectionsProps> = ({
  activeSection,
  onSectionChange,
  searchTerm
}) => {
  const sections = [
    { id: 'home', name: 'الصفحة الرئيسية', icon: Home },
    { id: 'navigation', name: 'التنقل', icon: Navigation },
    { id: 'cart', name: 'السلة', icon: ShoppingCart },
    { id: 'downloads', name: 'التنزيلات', icon: Download },
    { id: 'contact', name: 'التواصل', icon: MessageCircle },
    { id: 'footer', name: 'التذييل', icon: FileText }
  ];

  const filteredSections = searchTerm
    ? sections.filter(section => section.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : sections;

  return (
    <div className="flex flex-col gap-2">
      {filteredSections.map(section => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={`flex items-center gap-2 p-3 rounded-md text-gray-300 hover:bg-white/5 hover:text-white ${activeSection === section.id ? 'bg-blue-500 text-white' : ''}`}
        >
          <section.icon className="w-4 h-4" />
          {section.name}
        </button>
      ))}
    </div>
  );
};

export default TextsTabSections;

