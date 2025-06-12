
import React from 'react';
import { Save, Download, Upload } from 'lucide-react';

interface TextsTabHeaderProps {
  onSave: () => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextsTabHeader: React.FC<TextsTabHeaderProps> = ({
  onSave,
  onExport,
  onImport
}) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold text-white">إدارة النصوص</h2>
      <div className="flex gap-3">
        {/* أدوات الاستيراد والتصدير */}
        <input
          type="file"
          accept=".json"
          onChange={onImport}
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
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          تصدير
        </button>
        
        <button
          onClick={onSave}
          className="glow-button flex items-center space-x-2 rtl:space-x-reverse"
        >
          <Save className="w-4 h-4" />
          <span>حفظ التغييرات</span>
        </button>
      </div>
    </div>
  );
};

export default TextsTabHeader;
