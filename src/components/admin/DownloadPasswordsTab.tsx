import React, { useState } from 'react';
import { Key, Plus, Edit, Trash2, Eye, EyeOff, Shield, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import DownloadPasswordService from '../../utils/downloadPasswordService';
import DownloadCategoriesService from '../../utils/downloadCategoriesService';
import type { DownloadPassword } from '../../types/downloads';

interface DownloadPasswordsTabProps {
  canAccess: (role: 'مدير عام' | 'مبرمج' | 'مشرف') => boolean;
}

const DownloadPasswordsTab: React.FC<DownloadPasswordsTabProps> = ({ canAccess }) => {
  const { toast } = useToast();
  const [passwords, setPasswords] = useState<DownloadPassword[]>(DownloadPasswordService.getDownloadPasswords());
  const [categories] = useState<string[]>(DownloadCategoriesService.getCategories());
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<DownloadPassword>>({});
  const [showPassword, setShowPassword] = useState<number | null>(null);

  const handleAdd = () => {
    if (!canAccess('مبرمج')) {
      toast({
        title: "خطأ في الصلاحية",
        description: "ليس لديك صلاحية لإضافة كلمات مرور",
        variant: "destructive"
      });
      return;
    }

    const newPassword = DownloadPasswordService.addPassword({
      name: "كلمة مرور جديدة",
      password: `pass_${Date.now()}`,
      allowedCategories: [categories[0] || "ألعاب"],
      isActive: true,
      description: "وصف كلمة المرور"
    });

    setPasswords(DownloadPasswordService.getDownloadPasswords());
    
    toast({
      title: "تم إضافة كلمة المرور",
      description: "تم إضافة كلمة مرور جديدة بنجاح"
    });
  };

  const handleEdit = (password: DownloadPassword) => {
    setIsEditing(password.id);
    setEditForm(password);
  };

  const handleSave = () => {
    if (!editForm || isEditing === null) return;

    DownloadPasswordService.updatePassword(isEditing, editForm);
    setPasswords(DownloadPasswordService.getDownloadPasswords());
    setIsEditing(null);
    setEditForm({});

    toast({
      title: "تم حفظ التغييرات",
      description: "تم تحديث كلمة المرور بنجاح"
    });
  };

  const handleDelete = (id: number) => {
    if (!canAccess('مدير عام')) {
      toast({
        title: "خطأ في الصلاحية",
        description: "ليس لديك صلاحية لحذف كلمات المرور",
        variant: "destructive"
      });
      return;
    }

    DownloadPasswordService.deletePassword(id);
    setPasswords(DownloadPasswordService.getDownloadPasswords());

    toast({
      title: "تم حذف كلمة المرور",
      description: "تم حذف كلمة المرور بنجاح"
    });
  };

  const togglePasswordVisibility = (id: number) => {
    setShowPassword(showPassword === id ? null : id);
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const handleCategoryToggle = (category: string, isChecked: boolean) => {
    const current = editForm.allowedCategories || [];
    if (isChecked) {
      setEditForm({...editForm, allowedCategories: [...current, category]});
    } else {
      setEditForm({...editForm, allowedCategories: current.filter(c => c !== category)});
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">إدارة كلمات مرور التنزيلات</h2>
          <p className="text-gray-400">إنشاء وإدارة كلمات مرور متخصصة للفئات المختلفة</p>
          <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-300 text-sm">
              💡 يمكنك تخصيص كل كلمة مرور لفتح فئة أو عدة فئات محددة فقط
            </p>
          </div>
        </div>
        {canAccess('مبرمج') && (
          <Button onClick={handleAdd} className="bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            إضافة كلمة مرور
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {passwords.map((password) => {
          const isCurrentlyEditing = isEditing === password.id;
          const isPasswordVisible = showPassword === password.id;

          return (
            <Card key={password.id} className="bg-white/5 border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Key className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{password.name}</CardTitle>
                      <p className="text-gray-400 text-sm">
                        الفئات المسموحة: {password.allowedCategories.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(password.isActive)} border`}>
                      {password.isActive ? 'نشط' : 'معطل'}
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => togglePasswordVisibility(password.id)}
                        className="text-white hover:bg-white/10"
                      >
                        {isPasswordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(password)}
                        className="text-white hover:bg-white/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {canAccess('مدير عام') && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(password.id)}
                          className="text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {isCurrentlyEditing ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">الاسم</label>
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                          placeholder="مثال: كلمة مرور الألعاب"
                        />
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">كلمة المرور</label>
                        <input
                          type="text"
                          value={editForm.password || ''}
                          onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                          className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                          placeholder="مثال: games123"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">الوصف</label>
                      <textarea
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        className="w-full p-2 bg-white/10 border border-white/20 rounded text-white h-20 resize-none"
                        placeholder="وصف استخدام كلمة المرور"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-3">
                        الفئات المسموحة (يمكن اختيار أكثر من فئة)
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {categories.map(category => (
                          <div key={category} className="flex items-center space-x-2 bg-white/5 p-2 rounded border border-white/10">
                            <input
                              type="checkbox"
                              id={`cat-${category}`}
                              checked={editForm.allowedCategories?.includes(category) || false}
                              onChange={(e) => handleCategoryToggle(category, e.target.checked)}
                              className="rounded border-white/20"
                            />
                            <label htmlFor={`cat-${category}`} className="text-white text-sm cursor-pointer">
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                      <p className="text-gray-400 text-xs mt-2">
                        💡 اختر الفئات التي يمكن لحاملي هذه كلمة المرور الوصول إليها
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 bg-white/5 p-3 rounded border border-white/10">
                      <input
                        type="checkbox"
                        id="active-status"
                        checked={editForm.isActive || false}
                        onChange={(e) => setEditForm({...editForm, isActive: e.target.checked})}
                        className="rounded border-white/20"
                      />
                      <label htmlFor="active-status" className="text-white cursor-pointer">
                        كلمة مرور نشطة
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
                        حفظ
                      </Button>
                      <Button 
                        onClick={() => {setIsEditing(null); setEditForm({});}} 
                        variant="outline" 
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        إلغاء
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        <span>كلمة المرور: </span>
                        <code className="bg-gray-800 px-2 py-1 rounded">
                          {isPasswordVisible ? password.password : '••••••••'}
                        </code>
                      </div>
                    </div>
                    
                    {password.description && (
                      <p className="text-gray-300 text-sm">{password.description}</p>
                    )}

                    <div className="flex gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>الاستخدامات: {password.usageCount}</span>
                      </div>
                      {password.lastUsed && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>آخر استخدام: {new Date(password.lastUsed).toLocaleDateString('ar')}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-2">الفئات المسموحة:</p>
                      <div className="flex flex-wrap gap-1">
                        {password.allowedCategories.map((category, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-blue-500/30 text-blue-300 bg-blue-500/10">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DownloadPasswordsTab;
