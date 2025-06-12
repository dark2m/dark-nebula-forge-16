
import React from 'react';
import { SiteSettings } from '../../../types/admin';

interface TextsTabStatsProps {
  siteSettings: SiteSettings;
  onExport: () => void;
}

const TextsTabStats: React.FC<TextsTabStatsProps> = ({
  siteSettings,
  onExport
}) => {
  return (
    <div className="admin-card rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">أدوات إضافية</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h4 className="text-blue-400 font-semibold mb-2">📊 إحصائيات النصوص</h4>
          <p className="text-gray-300 text-sm">
            عدد النصوص: {Object.keys(siteSettings.pageTexts).length} قسم
          </p>
        </div>
        
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <h4 className="text-green-400 font-semibold mb-2">🔄 نسخ احتياطي</h4>
          <button
            onClick={onExport}
            className="text-sm text-green-400 hover:text-green-300"
          >
            إنشاء نسخة احتياطية
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextsTabStats;
