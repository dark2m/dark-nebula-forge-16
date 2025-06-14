
import React from 'react';
import { FileText, Globe, MessageSquare, ShoppingCart, Navigation } from 'lucide-react';

interface Section {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
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
    { 
      id: 'home', 
      name: 'الصفحة الرئيسية', 
      icon: Globe,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'official', 
      name: 'الصفحة الرسمية', 
      icon: FileText,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: 'pubgHacks', 
      name: 'هكر ببجي موبايل', 
      icon: MessageSquare,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'webDevelopment', 
      name: 'برمجة مواقع', 
      icon: MessageSquare,
      color: 'from-orange-500 to-red-500'
    },
    { 
      id: 'discordBots', 
      name: 'برمجة بوتات ديسكورد', 
      icon: MessageSquare,
      color: 'from-indigo-500 to-blue-500'
    },
    { 
      id: 'cart', 
      name: 'السلة', 
      icon: ShoppingCart,
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      id: 'navigation', 
      name: 'التنقل', 
      icon: Navigation,
      color: 'from-teal-500 to-green-500'
    }
  ];

  const filteredSections = sections.filter(section =>
    section.name.includes(searchTerm)
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      {filteredSections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;
        
        return (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
              isActive
                ? `bg-gradient-to-r ${section.color} ring-2 ring-white/20`
                : 'bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className={`p-3 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-white/20' 
                  : 'bg-white/10 group-hover:bg-white/20'
              }`}>
                <Icon className={`w-6 h-6 ${
                  isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                }`} />
              </div>
              <span className={`text-sm font-medium text-center ${
                isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
              }`}>
                {section.name}
              </span>
            </div>
            
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl"></div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TextsTabSections;
