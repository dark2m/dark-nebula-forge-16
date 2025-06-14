
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, Wrench, Code, Star, Zap, Shield, Globe, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { passwordGeneratorToolCode } from '../../utils/passwordGeneratorTool';
import type { SiteSettings, Tool } from '../../types/admin';

interface ToolsTabProps {
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  saveSiteSettings: () => void;
}

const ToolsTab: React.FC<ToolsTabProps> = ({
  siteSettings,
  setSiteSettings,
  saveSiteSettings
}) => {
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // التأكد من وجود tools في الإعدادات
  const tools = siteSettings.tools || [];
  const toolsPageSettings = siteSettings.pageTexts?.tools || {
    pageTitle: 'أدوات الموقع',
    pageSubtitle: 'مجموعة من الأدوات المفيدة للموقع'
  };

  const categories = [
    { value: 'general', label: 'عام', color: 'bg-gradient-to-r from-blue-500 to-blue-600', icon: '🔧' },
    { value: 'security', label: 'أمان', color: 'bg-gradient-to-r from-green-500 to-green-600', icon: '🔐' },
    { value: 'development', label: 'تطوير', color: 'bg-gradient-to-r from-purple-500 to-purple-600', icon: '💻' },
    { value: 'design', label: 'تصميم', color: 'bg-gradient-to-r from-orange-500 to-orange-600', icon: '🎨' }
  ];

  const addTool = () => {
    const newTool: Tool = {
      id: Date.now(),
      title: 'أداة جديدة',
      description: 'وصف الأداة',
      buttonText: 'استخدام الأداة',
      url: '',
      icon: '🔧',
      visible: true,
      category: 'general',
      customHtml: ''
    };

    const updatedSettings = {
      ...siteSettings,
      tools: [...tools, newTool]
    };
    setSiteSettings(updatedSettings);
    setEditingTool(newTool);
    setIsAddDialogOpen(true);
  };

  const addToolByCategory = (category: string) => {
    const categoryLabels: { [key: string]: string } = {
      general: 'أداة عامة',
      security: 'أداة أمان',
      development: 'أداة تطوير',
      design: 'أداة تصميم'
    };

    const categoryIcons: { [key: string]: string } = {
      general: '🔧',
      security: '🔐',
      development: '💻',
      design: '🎨'
    };

    const newTool: Tool = {
      id: Date.now(),
      title: `${categoryLabels[category]} جديدة`,
      description: 'وصف الأداة',
      buttonText: 'استخدام الأداة',
      url: '',
      icon: categoryIcons[category],
      visible: true,
      category: category,
      customHtml: ''
    };

    const updatedSettings = {
      ...siteSettings,
      tools: [...tools, newTool]
    };
    setSiteSettings(updatedSettings);
  };

  const addPasswordGeneratorTool = () => {
    const passwordTool: Tool = {
      id: Date.now(),
      title: 'مولد كلمات المرور',
      description: 'أداة لتوليد كلمات مرور قوية وآمنة مع خيارات متقدمة',
      buttonText: 'استخدام المولد',
      url: '',
      icon: '🔐',
      visible: true,
      category: 'security',
      customHtml: passwordGeneratorToolCode
    };

    const updatedSettings = {
      ...siteSettings,
      tools: [...tools, passwordTool]
    };
    setSiteSettings(updatedSettings);
  };

  const updateTool = (toolId: number, updates: Partial<Tool>) => {
    const updatedTools = tools.map(tool =>
      tool.id === toolId ? { ...tool, ...updates } : tool
    );
    
    setSiteSettings({
      ...siteSettings,
      tools: updatedTools
    });
  };

  const deleteTool = (toolId: number) => {
    const updatedTools = tools.filter(tool => tool.id !== toolId);
    setSiteSettings({
      ...siteSettings,
      tools: updatedTools
    });
  };

  const toggleToolVisibility = (toolId: number) => {
    const tool = tools.find(t => t.id === toolId);
    if (tool) {
      updateTool(toolId, { visible: !tool.visible });
    }
  };

  const updatePageTexts = (field: string, value: string) => {
    setSiteSettings({
      ...siteSettings,
      pageTexts: {
        ...siteSettings.pageTexts,
        tools: {
          ...toolsPageSettings,
          [field]: value
        }
      }
    });
  };

  const handleInputChange = (toolId: number, field: string, value: any) => {
    console.log('Immediate save for tool:', toolId, field, value);
    updateTool(toolId, { [field]: value });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header محسن مثل المنتجات */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-2xl flex items-center justify-center">
              <Wrench className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">إدارة الأدوات</h2>
              <p className="text-gray-400">أضف وعدل أدوات موقعك بسهولة</p>
            </div>
          </div>
          <div className="text-center bg-white/5 rounded-xl p-4">
            <div className="text-3xl font-bold text-purple-400">{tools.length}</div>
            <div className="text-gray-400 text-sm">أداة</div>
          </div>
        </div>
      </div>

      {/* أزرار إضافة الأدوات - تصميم محسن مثل المنتجات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => addToolByCategory(cat.value)}
            className={`${cat.color} p-6 rounded-2xl hover:scale-105 transition-all duration-300 group shadow-lg hover:shadow-xl`}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Plus className="w-5 h-5 text-white" />
                <span className="font-medium text-white">{cat.label}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* إعدادات صفحة الأدوات */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="text-3xl bg-white/20 rounded-xl p-3">⚙️</div>
            <div>
              <h3 className="text-xl font-bold text-white">إعدادات صفحة الأدوات</h3>
              <p className="text-white/80">تخصيص النصوص الرئيسية لصفحة الأدوات</p>
            </div>
          </div>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-orange-300 text-sm font-medium mb-3">
                عنوان الصفحة
              </label>
              <input
                type="text"
                value={toolsPageSettings.pageTitle}
                onChange={(e) => updatePageTexts('pageTitle', e.target.value)}
                className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors"
                placeholder="عنوان الصفحة..."
              />
            </div>
            
            <div>
              <label className="block text-yellow-300 text-sm font-medium mb-3">وصف الصفحة</label>
              <textarea
                value={toolsPageSettings.pageSubtitle}
                onChange={(e) => updatePageTexts('pageSubtitle', e.target.value)}
                rows={3}
                className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                placeholder="وصف الصفحة..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* قائمة الأدوات - تصميم محسن مثل المنتجات */}
      <div className="space-y-6">
        {tools.map((tool) => {
          const categoryInfo = categories.find(c => c.value === tool.category);
          
          return (
            <div key={tool.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-purple-400/30 transition-all duration-300 shadow-lg">
              {/* Header الأداة محسن */}
              <div className={`${categoryInfo?.color || 'bg-gradient-to-r from-gray-600 to-gray-700'} p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="text-3xl bg-white/20 rounded-xl p-3">
                      {tool.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {tool.title} #{tool.id}
                      </h3>
                      <span className="text-white/80">{categoryInfo?.label}</span>
                      {tool.customHtml && (
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-400 text-xs">
                            <Code className="w-3 h-3" />
                            كود مخصص
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => toggleToolVisibility(tool.id)}
                        className={`p-3 rounded-xl transition-colors ${
                          tool.visible 
                            ? 'bg-green-500/20 hover:bg-green-500/40' 
                            : 'bg-red-500/20 hover:bg-red-500/40'
                        }`}
                      >
                        {tool.visible ? (
                          <Eye className="w-5 h-5 text-green-300" />
                        ) : (
                          <EyeOff className="w-5 h-5 text-red-300" />
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => deleteTool(tool.id)}
                      className="bg-orange-500/20 hover:bg-orange-500/40 rounded-xl p-3 transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-orange-300" />
                    </button>
                  </div>
                </div>
              </div>

              {/* محتوى الأداة */}
              <div className="p-8 space-y-8">
                {/* المعلومات الأساسية */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-blue-300 text-sm font-medium mb-3">اسم الأداة</label>
                    <input
                      type="text"
                      value={tool.title}
                      onChange={(e) => handleInputChange(tool.id, 'title', e.target.value)}
                      className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="اسم الأداة..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-purple-300 text-sm font-medium mb-3">الفئة</label>
                    <select
                      value={tool.category}
                      onChange={(e) => handleInputChange(tool.id, 'category', e.target.value)}
                      className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-400 transition-colors"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value} className="bg-gray-800">
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-green-300 text-sm font-medium mb-3">أيقونة الأداة</label>
                    <input
                      type="text"
                      value={tool.icon}
                      onChange={(e) => handleInputChange(tool.id, 'icon', e.target.value)}
                      className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 transition-colors"
                      placeholder="🔧"
                    />
                  </div>
                </div>

                {/* الوصف */}
                <div>
                  <label className="block text-cyan-300 text-sm font-medium mb-3">الوصف</label>
                  <textarea
                    value={tool.description}
                    onChange={(e) => handleInputChange(tool.id, 'description', e.target.value)}
                    className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-4 py-4 focus:outline-none focus:border-cyan-400 transition-colors h-24 resize-none"
                    placeholder="وصف الأداة..."
                  />
                </div>

                {/* نص الزر والرابط */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-yellow-300 text-sm font-medium mb-3">نص الزر</label>
                    <input
                      type="text"
                      value={tool.buttonText}
                      onChange={(e) => handleInputChange(tool.id, 'buttonText', e.target.value)}
                      className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 transition-colors"
                      placeholder="نص الزر..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-pink-300 text-sm font-medium mb-3">رابط الأداة</label>
                    <input
                      type="text"
                      value={tool.url}
                      onChange={(e) => handleInputChange(tool.id, 'url', e.target.value)}
                      className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-400 transition-colors"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* الكود المخصص */}
                <div className="bg-black/10 rounded-xl p-6">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
                    <Code className="w-6 h-6 text-blue-400" />
                    <h4 className="text-white font-medium text-lg">كود HTML مخصص</h4>
                  </div>
                  
                  <textarea
                    value={tool.customHtml || ''}
                    onChange={(e) => handleInputChange(tool.id, 'customHtml', e.target.value)}
                    className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-4 py-4 focus:outline-none focus:border-blue-400 transition-colors h-32 resize-none font-mono text-sm"
                    placeholder="<!DOCTYPE html>&#10;<html>&#10;<head>&#10;    <title>أداتي المخصصة</title>&#10;</head>&#10;<body>&#10;    <!-- أضف كودك هنا -->&#10;</body>&#10;</html>"
                  />
                  
                  <p className="text-gray-400 text-sm mt-3">
                    💡 إذا تم إدخال كود HTML، سيتم عرضه بدلاً من توجيه المستخدم لرابط خارجي
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State محسن */}
      {tools.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10">
            <div className="text-6xl mb-6">🛠️</div>
            <h3 className="text-2xl font-bold text-white mb-3">لا توجد أدوات</h3>
            <p className="text-gray-400 mb-8 text-lg">ابدأ بإضافة أداتك الأولى</p>
            <div className="flex justify-center space-x-4 rtl:space-x-reverse">
              {categories.slice(0, 2).map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => addToolByCategory(cat.value)}
                  className={`${cat.color} px-6 py-3 rounded-xl text-white font-medium hover:scale-105 transition-transform shadow-lg`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolsTab;
