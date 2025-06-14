
import React from 'react';
import { Save, Download, Upload, FileText } from 'lucide-react';

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
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl flex items-center justify-center">
            <FileText className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">إدارة النصوص</h2>
            <p className="text-gray-400">تحكم في جميع النصوص والمحتوى النصي للموقع</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
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
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Upload className="w-4 h-4" />
            <span className="font-medium">استيراد</span>
          </label>
          
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span className="font-medium">تصدير</span>
          </button>
          
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
          >
            <Save className="w-4 h-4" />
            <span>حفظ التغييرات</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextsTabHeader;
