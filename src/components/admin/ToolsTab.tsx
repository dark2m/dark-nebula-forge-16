
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, Wrench, Code, Star, Zap, Shield, Globe } from 'lucide-react';
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
    { value: 'general', label: 'عام', color: 'from-blue-500 to-cyan-500', icon: '🔧' },
    { value: 'security', label: 'أمان', color: 'from-green-500 to-emerald-500', icon: '🔐' },
    { value: 'development', label: 'تطوير', color: 'from-purple-500 to-pink-500', icon: '💻' },
    { value: 'design', label: 'تصميم', color: 'from-orange-500 to-red-500', icon: '🎨' }
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

  return (
    <div className="space-y-8 p-6">
      {/* Enhanced Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 rounded-2xl blur-xl"></div>
        <div className="relative bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-2">
                🛠️ إدارة الأدوات المتطورة
              </h2>
              <p className="text-gray-300 text-lg">تحكم في أدوات الموقع ونصوص صفحة الأدوات</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-400">{tools.length}</div>
              <div className="text-gray-400">أداة</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={addPasswordGeneratorTool}
          className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-2xl hover:scale-105 transition-all duration-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative flex flex-col items-center space-y-3">
            <div className="text-3xl group-hover:scale-125 transition-transform duration-300">🔐</div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Shield className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500" />
              <span className="font-semibold text-white">مولد كلمات المرور</span>
            </div>
          </div>
        </button>

        <button
          onClick={addTool}
          className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-2xl hover:scale-105 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative flex flex-col items-center space-y-3">
            <div className="text-3xl group-hover:scale-125 transition-transform duration-300">🔧</div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Plus className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span className="font-semibold text-white">إضافة أداة جديدة</span>
            </div>
          </div>
        </button>

        <button
          onClick={saveSiteSettings}
          className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-2xl hover:scale-105 transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative flex flex-col items-center space-y-3">
            <div className="text-3xl group-hover:scale-125 transition-transform duration-300">💾</div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Save className="w-5 h-5 group-hover:bounce transition-transform duration-500" />
              <span className="font-semibold text-white">حفظ التغييرات</span>
            </div>
          </div>
        </button>
      </div>

      {/* Page Settings */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/20 via-yellow-600/20 to-red-600/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="text-3xl">⚙️</div>
              <div>
                <h3 className="text-xl font-bold text-white">إعدادات صفحة الأدوات</h3>
                <p className="text-white/80">تخصيص النصوص الرئيسية لصفحة الأدوات</p>
              </div>
            </div>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-orange-300 text-sm font-semibold mb-3 flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  عنوان الصفحة
                </label>
                <input
                  type="text"
                  value={toolsPageSettings.pageTitle}
                  onChange={(e) => updatePageTexts('pageTitle', e.target.value)}
                  className="w-full bg-black/30 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300"
                  placeholder="عنوان الصفحة..."
                />
              </div>
              
              <div>
                <label className="block text-yellow-300 text-sm font-semibold mb-3">وصف الصفحة</label>
                <textarea
                  value={toolsPageSettings.pageSubtitle}
                  onChange={(e) => updatePageTexts('pageSubtitle', e.target.value)}
                  rows={3}
                  className="w-full bg-black/30 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 resize-none"
                  placeholder="وصف الصفحة..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Management */}
      <div className="space-y-6">
        {tools.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-3xl"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
                <div className="text-6xl mb-6">🛠️</div>
                <h3 className="text-2xl font-bold text-white mb-4">لا توجد أدوات بعد</h3>
                <p className="text-gray-400 mb-8">ابدأ بإضافة أداتك الأولى باستخدام الأزرار أعلاه</p>
                <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                  <button
                    onClick={addPasswordGeneratorTool}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 rounded-xl text-white font-semibold hover:scale-105 transition-transform duration-300"
                  >
                    🔐 مولد كلمات المرور
                  </button>
                  <button
                    onClick={addTool}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 rounded-xl text-white font-semibold hover:scale-105 transition-transform duration-300"
                  >
                    🔧 أداة عامة
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          tools.map((tool) => {
            const categoryInfo = categories.find(c => c.value === tool.category);
            
            return (
              <div key={tool.id} className="group relative">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
                  {/* Tool Header */}
                  <div className={`bg-gradient-to-r ${categoryInfo?.color || 'from-gray-600 to-gray-700'} p-6`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className="text-3xl">{tool.icon}</div>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {tool.title} #{tool.id}
                          </h3>
                          <div className="flex items-center space-x-2 rtl:space-x-reverse text-white/80">
                            <Star className="w-4 h-4" />
                            <span>{categoryInfo?.label || 'عام'}</span>
                            {tool.customHtml && (
                              <>
                                <Code className="w-4 h-4" />
                                <span>كود مخصص</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        {/* Visibility Toggle */}
                        <button
                          onClick={() => toggleToolVisibility(tool.id)}
                          className={`
                            relative p-3 rounded-full transition-all duration-300 hover:scale-110
                            ${tool.visible 
                              ? 'bg-green-500/20 hover:bg-green-500/30 border-2 border-green-500/50' 
                              : 'bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/50'
                            }
                          `}
                          title={tool.visible ? 'إخفاء الأداة' : 'إظهار الأداة'}
                        >
                          {tool.visible ? (
                            <Eye className="w-5 h-5 text-green-400" />
                          ) : (
                            <EyeOff className="w-5 h-5 text-red-400" />
                          )}
                        </button>

                        {/* Edit Button */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <button
                              onClick={() => setEditingTool(tool)}
                              className="p-3 rounded-full bg-blue-500/20 hover:bg-blue-500/30 border-2 border-blue-500/50 transition-all duration-300 hover:scale-110"
                              title="تعديل الأداة"
                            >
                              <Edit className="w-5 h-5 text-blue-400" />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="bg-black/90 backdrop-blur-sm border-white/30 max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-white">تعديل الأداة</DialogTitle>
                              <DialogDescription className="text-gray-300">
                                قم بتعديل معلومات الأداة وإعداداتها
                              </DialogDescription>
                            </DialogHeader>
                            {editingTool && (
                              <Tabs defaultValue="basic" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                                  <TabsTrigger value="basic" className="text-white">المعلومات الأساسية</TabsTrigger>
                                  <TabsTrigger value="code" className="text-white">الكود المخصص</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="basic" className="space-y-4 mt-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-white">عنوان الأداة</Label>
                                      <Input
                                        value={editingTool.title}
                                        onChange={(e) => setEditingTool({ ...editingTool, title: e.target.value })}
                                        className="bg-white/20 border-white/30 text-white"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-white">أيقونة الأداة</Label>
                                      <Input
                                        value={editingTool.icon}
                                        onChange={(e) => setEditingTool({ ...editingTool, icon: e.target.value })}
                                        className="bg-white/20 border-white/30 text-white"
                                        placeholder="🔧"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-white">وصف الأداة</Label>
                                    <Textarea
                                      value={editingTool.description}
                                      onChange={(e) => setEditingTool({ ...editingTool, description: e.target.value })}
                                      className="bg-white/20 border-white/30 text-white"
                                      rows={3}
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-white">نص الزر</Label>
                                      <Input
                                        value={editingTool.buttonText}
                                        onChange={(e) => setEditingTool({ ...editingTool, buttonText: e.target.value })}
                                        className="bg-white/20 border-white/30 text-white"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-white">رابط الأداة (اختياري)</Label>
                                      <Input
                                        value={editingTool.url}
                                        onChange={(e) => setEditingTool({ ...editingTool, url: e.target.value })}
                                        className="bg-white/20 border-white/30 text-white"
                                        placeholder="https://... أو اتركه فارغاً للكود المخصص"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-white">فئة الأداة</Label>
                                    <Select
                                      value={editingTool.category}
                                      onValueChange={(value) => setEditingTool({ ...editingTool, category: value })}
                                    >
                                      <SelectTrigger className="bg-white/20 border-white/30 text-white">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-800 backdrop-blur-sm border-white/30">
                                        {categories.map((cat) => (
                                          <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-white/20">
                                            {cat.icon} {cat.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="code" className="space-y-4 mt-4">
                                  <div className="space-y-2">
                                    <Label className="text-white flex items-center gap-2">
                                      <Code className="w-4 h-4" />
                                      كود HTML مخصص
                                    </Label>
                                    <p className="text-gray-400 text-sm">
                                      إذا تم إدخال كود HTML، سيتم عرضه بدلاً من توجيه المستخدم لرابط خارجي
                                    </p>
                                    <Textarea
                                      value={editingTool.customHtml || ''}
                                      onChange={(e) => setEditingTool({ ...editingTool, customHtml: e.target.value })}
                                      className="bg-white/20 border-white/30 text-white font-mono"
                                      rows={15}
                                      placeholder="<!DOCTYPE html>
<html>
<head>
    <title>أداتي المخصصة</title>
</head>
<body>
    <h1>مرحباً بك في أداتي!</h1>
    <!-- أضف كودك هنا -->
</body>
</html>"
                                    />
                                  </div>
                                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                    <p className="text-yellow-400 text-sm">
                                      ⚠️ تأكد من أن الكود آمن وقابل للعمل. سيتم عرضه مباشرة في الموقع.
                                    </p>
                                  </div>
                                </TabsContent>
                                
                                <div className="flex gap-2 pt-4">
                                  <Button
                                    onClick={() => {
                                      updateTool(editingTool.id, editingTool);
                                      setEditingTool(null);
                                    }}
                                    className="glow-button"
                                  >
                                    حفظ التغييرات
                                  </Button>
                                </div>
                              </Tabs>
                            )}
                          </DialogContent>
                        </Dialog>

                        {/* Delete Button */}
                        <button
                          onClick={() => deleteTool(tool.id)}
                          className="p-3 rounded-full bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/50 transition-all duration-300 hover:scale-110"
                          title="حذف الأداة"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tool Content */}
                  <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-2">
                        <p className="text-gray-300 text-lg mb-3">{tool.description}</p>
                        <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-400">
                          <span>🎯 {tool.buttonText}</span>
                          {tool.url && (
                            <span>🔗 {tool.url.substring(0, 30)}...</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-end">
                        <div className="text-center">
                          <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${categoryInfo?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center text-2xl mb-2`}>
                            {tool.icon}
                          </div>
                          <span className="text-xs text-gray-400">{categoryInfo?.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ToolsTab;
