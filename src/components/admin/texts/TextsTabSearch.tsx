
import React from 'react';
import { Search } from 'lucide-react';

interface TextsTabSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const TextsTabSearch: React.FC<TextsTabSearchProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="البحث في الأقسام..."
          className="w-full bg-black/20 text-white border border-white/20 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
        />
      </div>
    </div>
  );
};

export default TextsTabSearch;
