
import React from 'react';
import { BarChart3, FileText, Eye, Download } from 'lucide-react';
import { SiteSettings } from '../../../types/admin';

interface TextsTabStatsProps {
  siteSettings: SiteSettings;
  onExport: () => void;
}

const TextsTabStats: React.FC<TextsTabStatsProps> = ({
  siteSettings,
  onExport
}) => {
  // حساب إحصائيات النصوص
  const getTotalTexts = () => {
    let count = 0;
    const pageTexts = siteSettings.pageTexts;
    
    Object.values(pageTexts).forEach(section => {
      if (typeof section === 'object') {
        count += Object.keys(section).length;
      }
    });
    
    return count;
  };

  const getCompletedTexts = () => {
    let completed = 0;
    const pageTexts = siteSettings.pageTexts;
    
    Object.values(pageTexts).forEach(section => {
      if (typeof section === 'object') {
        Object.values(section).forEach(text => {
          if (text && typeof text === 'string' && text.trim().length > 0) {
            completed++;
          }
        });
      }
    });
    
    return completed;
  };

  const totalTexts = getTotalTexts();
  const completedTexts = getCompletedTexts();
  const completionPercentage = totalTexts > 0 ? Math.round((completedTexts / totalTexts) * 100) : 0;

  const stats = [
    {
      title: 'إجمالي النصوص',
      value: totalTexts,
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'النصوص المكتملة',
      value: completedTexts,
      icon: Eye,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'نسبة الإكمال',
      value: `${completionPercentage}%`,
      icon: BarChart3,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="text-3xl bg-white/20 rounded-xl p-3">📊</div>
            <div>
              <h3 className="text-xl font-bold text-white">إحصائيات النصوص</h3>
              <p className="text-white/80">نظرة عامة على حالة المحتوى النصي</p>
            </div>
          </div>
          
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            تصدير سريع
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-white/10`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.title}</div>
              </div>
            );
          })}
        </div>
        
        {/* شريط التقدم */}
        <div className="mt-6 p-4 bg-black/20 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">تقدم إكمال النصوص</span>
            <span className="text-blue-400 font-bold">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextsTabStats;
