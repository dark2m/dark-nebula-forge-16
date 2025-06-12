
import React from 'react';

interface TextsTabSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const TextsTabSearch: React.FC<TextsTabSearchProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="admin-card rounded-xl p-4">
      <input
        type="text"
        placeholder="البحث في الأقسام..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full bg-gray-800 text-white border border-white/20 rounded px-4 py-2 focus:outline-none focus:border-blue-400"
      />
    </div>
  );
};

export default TextsTabSearch;
