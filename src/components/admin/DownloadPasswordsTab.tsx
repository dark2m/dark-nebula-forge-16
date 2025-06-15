
import React, { useState } from 'react';
import { Key, Plus, Edit, Trash2, Eye, EyeOff, Shield, Clock, Users, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseDownloadPasswords } from '../../hooks/useSupabaseDownloadPasswords';
import { useSupabaseDownloadCategories } from '../../hooks/useSupabaseDownloadCategories';
import type { DownloadPassword } from '../../types/downloads';

interface DownloadPasswordsTabProps {
  canAccess: (role: 'مدير عام' | 'مبرمج' | 'مشرف') => boolean;
}

const DownloadPasswordsTab: React.FC<DownloadPasswordsTabProps> = ({ canAccess }) => {
  const { toast } = useToast();
  const { passwords, isLoading, addPassword, updatePassword, deletePassword } = useSupabaseDownloadPasswords();
  const { categories } = useSupabaseDownloadCategories();
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<DownloadPassword>>({});
  const [showPassword, setShowPassword] = useState<number | null>(null);

  const handleAdd = async () => {
    if (!canAccess('مبرمج')) {
      toast({
        title: "خطأ في الصلاحية",
        description: "ليس لديك صلاحية لإضافة كلمات مرور",
        variant: "destructive"
      });
      return;
    }

    await addPassword({
      name: "كلمة مرور جديدة",
      password: `pass_${Date.now()}`,
      allowedCategories: [categories[0] || "أدوات"],
      isActive: true,
      description: "وصف كلمة المرور"
    });
  };

  const handleEdit = (password: DownloadPassword) => {
    setIsEditing(password.id);
    setEditForm(password);
  };

  const handleSave = async () => {
    if (!editForm || isEditing === null) return;

    await updatePassword(isEditing, editForm);
    setIsEditing(null);
    setEditForm({});
  };

  const handleDelete = async (id: number) => {
    if (!canAccess('مدير عام')) {
      toast({
        title: "خطأ في الصلاحية",
        description: "ليس لديك صلاحية لحذف كلمات المرور",
        variant: "destructive"
      });
      return;
    }

    await deletePassword(id);
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
    
    // إذا كان المستخدم يختار "وصول كامل"
    if (category === "وصول كامل") {
      if (isChecked) {
        setEditForm({...editForm, allowedCategories: ["وصول كامل"]});
      } else {
        setEditForm({...editForm, allowedCategories: [categories[0] || "أدوات"]});
      }
      return;
    }
    
    // إذا كان "وصول كامل" مختار، قم بإلغاء اختياره أولاً
    if (current.includes("وصول كامل")) {
      const newCategories = isChecked ? [category] : [];
      setEditForm({...editForm, allowedCategories: newCategories});
      return;
    }
    
    // التعامل العادي مع الفئات
    if (isChecked) {
      setEditForm({...editForm, allowedCategories: [...current, category]});
    } else {
      setEditForm({...editForm, allowedCategories: current.filter(c => c !== category)});
    }
  };

  const isFullAccess = (password: DownloadPassword) => {
    return password.allowedCategories.includes("وصول كامل");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">إدارة كلمات مرور التنزيلات</h2>
          <p className="text-gray-400">إنشاء وإدارة كلمات مرور متخصصة للفئات المختلفة</p>
          <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-300 text-sm">
              💡 يمكنك تخصيص كل كلمة مرور لفتح فئة أو عدة فئات محددة، أو استخدام "وصول كامل" للوصول لجميع الفئات
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
          const hasFullAccess = isFullAccess(password);

          return (
            <Card key={password.id} className="bg-white/5 border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${hasFullAccess ? 'bg-purple-500/20' : 'bg-blue-500/20'}`}>
                      {hasFullAccess ? (
                        <Globe className="w-6 h-6 text-purple-400" />
                      ) : (
                        <Key className="w-6 h-6 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        {password.name}
                        {hasFullAccess && (
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                            وصول كامل
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-gray-400 text-sm">
                        {hasFullAccess 
                          ? "الوصول لجميع الفئات المتاحة" 
                          : `الفئات المسموحة: ${password.allowedCategories.join(', ')}`
                        }
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
                        الفئات المسموحة
                      </label>
                      
                      {/* خيار الوصول الكامل */}
                      <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="full-access"
                            checked={editForm.allowedCategories?.includes("وصول كامل") || false}
                            onChange={(e) => handleCategoryToggle("وصول كامل", e.target.checked)}
                            className="rounded border-white/20"
                          />
                          <label htmlFor="full-access" className="text-purple-300 font-medium cursor-pointer flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            وصول كامل (جميع الفئات)
                          </label>
                        </div>
                        <p className="text-purple-200 text-xs mt-2">
                          🌟 يمنح الوصول لجميع الفئات المتاحة حالياً ومستقبلاً
                        </p>
                      </div>

                      {/* الفئات العادية */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {categories.map(category => (
                          <div key={category} className="flex items-center space-x-2 bg-white/5 p-2 rounded border border-white/10">
                            <input
                              type="checkbox"
                              id={`cat-${category}`}
                              checked={editForm.allowedCategories?.includes(category) || false}
                              onChange={(e) => handleCategoryToggle(category, e.target.checked)}
                              className="rounded border-white/20"
                              disabled={editForm.allowedCategories?.includes("وصول كامل")}
                            />
                            <label htmlFor={`cat-${category}`} className={`text-sm cursor-pointer ${
                              editForm.allowedCategories?.includes("وصول كامل") 
                                ? 'text-gray-500' 
                                : 'text-white'
                            }`}>
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                      <p className="text-gray-400 text-xs mt-2">
                        💡 اختر "وصول كامل" للوصول لجميع الفئات، أو اختر فئات محددة
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
                      <p className="text-gray-400 text-sm mb-2">
                        {hasFullAccess ? "مستوى الوصول:" : "الفئات المسموحة:"}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {hasFullAccess ? (
                          <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300 bg-purple-500/10 flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            وصول كامل لجميع الفئات
                          </Badge>
                        ) : (
                          password.allowedCategories.map((category, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-blue-500/30 text-blue-300 bg-blue-500/10">
                              {category}
                            </Badge>
                          ))
                        )}
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
