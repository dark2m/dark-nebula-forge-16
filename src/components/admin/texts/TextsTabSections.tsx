
import React from 'react';
import { FileText, Globe, MessageSquare } from 'lucide-react';

interface Section {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TextsTabSectionsProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  searchTerm: string;
}

const TextsTabSections: React.FC<TextsTabSectionsProps> = ({
  activeSection,
  onSectionChange,
  searchTerm
}) => {
  const sections: Section[] = [
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
    <div className="flex flex-wrap gap-2 mb-6">
      {filteredSections.map((section) => {
        const Icon = section.icon;
        return (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
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
  );
};

export default TextsTabSections;
