
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, Wrench, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">إدارة الأدوات</h2>
          <p className="text-gray-400">تحكم في أدوات الموقع ونصوص صفحة الأدوات</p>
        </div>
        <Button onClick={saveSiteSettings} className="glow-button">
          <Save className="w-4 h-4 mr-2" />
          حفظ التغييرات
        </Button>
      </div>

      {/* إعدادات صفحة الأدوات */}
      <Card className="bg-white/20 backdrop-blur-sm border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Wrench className="w-5 h-5" />
            إعدادات صفحة الأدوات
          </CardTitle>
          <CardDescription className="text-gray-200">
            تخصيص النصوص الرئيسية لصفحة الأدوات
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="page-title" className="text-white">عنوان الصفحة</Label>
            <Input
              id="page-title"
              value={toolsPageSettings.pageTitle}
              onChange={(e) => updatePageTexts('pageTitle', e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
            />
          </div>
          <div>
            <Label htmlFor="page-subtitle" className="text-white">وصف الصفحة</Label>
            <Textarea
              id="page-subtitle"
              value={toolsPageSettings.pageSubtitle}
              onChange={(e) => updatePageTexts('pageSubtitle', e.target.value)}
              rows={2}
              className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
            />
          </div>
        </CardContent>
      </Card>

      {/* إدارة الأدوات */}
      <Card className="bg-white/20 backdrop-blur-sm border-white/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">الأدوات المنشورة</CardTitle>
              <CardDescription className="text-gray-200">
                إدارة وتعديل أدوات الموقع
              </CardDescription>
            </div>
            <Button onClick={addTool} className="glow-button">
              <Plus className="w-4 h-4 mr-2" />
              إضافة أداة جديدة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {tools.length === 0 ? (
            <div className="text-center py-8">
              <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">لا توجد أدوات منشورة حالياً</p>
              <Button onClick={addTool} className="mt-4 glow-button">
                إضافة أول أداة
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {tools.map((tool) => (
                <div key={tool.id} className="bg-white/10 p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex items-center gap-4">
                      <span className="text-3xl">{tool.icon}</span>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg">{tool.title}</h3>
                        <p className="text-gray-300">{tool.description}</p>
                        {tool.customHtml && (
                          <div className="flex items-center gap-2 mt-1">
                            <Code className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-400 text-sm">يحتوي على كود مخصص</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* أيقونة العين المحسنة */}
                      <div className="relative">
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
                      </div>

                      {/* زر التعديل المحسن */}
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
                                      <SelectItem value="general" className="text-white hover:bg-white/20">عام</SelectItem>
                                      <SelectItem value="development" className="text-white hover:bg-white/20">تطوير</SelectItem>
                                      <SelectItem value="design" className="text-white hover:bg-white/20">تصميم</SelectItem>
                                      <SelectItem value="security" className="text-white hover:bg-white/20">أمان</SelectItem>
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

                      {/* زر الحذف المحسن */}
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ToolsTab;
