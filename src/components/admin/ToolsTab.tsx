
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Save, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
      category: 'general'
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
                <div key={tool.id} className="bg-white/10 p-4 rounded-lg border border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{tool.icon}</span>
                        <div>
                          <h3 className="text-white font-semibold">{tool.title}</h3>
                          <p className="text-gray-300 text-sm">{tool.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                          <Switch
                            checked={tool.visible}
                            onCheckedChange={(checked) => updateTool(tool.id, { visible: checked })}
                          />
                          <span className="text-sm text-gray-300">
                            {tool.visible ? 'مرئية' : 'مخفية'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingTool(tool)}
                            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-black/90 backdrop-blur-sm border-white/30 max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-white">تعديل الأداة</DialogTitle>
                            <DialogDescription className="text-gray-300">
                              قم بتعديل معلومات الأداة وإعداداتها
                            </DialogDescription>
                          </DialogHeader>
                          {editingTool && (
                            <div className="space-y-4">
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
                                  <Label className="text-white">رابط الأداة</Label>
                                  <Input
                                    value={editingTool.url}
                                    onChange={(e) => setEditingTool({ ...editingTool, url: e.target.value })}
                                    className="bg-white/20 border-white/30 text-white"
                                    placeholder="https://..."
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
                                  <SelectContent className="bg-white/90 backdrop-blur-sm border-white/30">
                                    <SelectItem value="general">عام</SelectItem>
                                    <SelectItem value="development">تطوير</SelectItem>
                                    <SelectItem value="design">تصميم</SelectItem>
                                    <SelectItem value="security">أمان</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={editingTool.visible}
                                  onCheckedChange={(checked) => setEditingTool({ ...editingTool, visible: checked })}
                                />
                                <Label className="text-white">عرض الأداة في الموقع</Label>
                              </div>
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
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteTool(tool.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
