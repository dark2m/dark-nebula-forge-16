
import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Check, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useSupabaseDownloadCategories } from '../../hooks/useSupabaseDownloadCategories';

interface DownloadCategoriesManagerProps {
  categories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

const DownloadCategoriesManager: React.FC<DownloadCategoriesManagerProps> = ({
  categories,
  onCategoriesChange
}) => {
  const { 
    categories: dbCategories, 
    isLoading, 
    addCategory, 
    updateCategory, 
    deleteCategory,
    refreshCategories
  } = useSupabaseDownloadCategories();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  // استخدام الفئات من قاعدة البيانات
  React.useEffect(() => {
    onCategoriesChange(dbCategories);
  }, [dbCategories, onCategoriesChange]);

  const handleAddCategory = async () => {
    if (newCategory.trim() && !dbCategories.includes(newCategory.trim())) {
      await addCategory(newCategory.trim());
      setNewCategory('');
      setIsAdding(false);
    }
  };

  const handleEditCategory = (index: number) => {
    setEditingIndex(index);
    setEditValue(dbCategories[index]);
  };

  const handleSaveEdit = async () => {
    if (editingIndex !== null && editValue.trim() && !dbCategories.includes(editValue.trim())) {
      const oldCategory = dbCategories[editingIndex];
      await updateCategory(oldCategory, editValue.trim());
      setEditingIndex(null);
      setEditValue('');
    }
  };

  const handleDeleteCategory = async (category: string) => {
    if (dbCategories.length <= 1) {
      return;
    }
    await deleteCategory(category);
  };

  const resetToDefault = async () => {
    // سيتم إعادة تعيين الفئات في قاعدة البيانات
    await refreshCategories();
  };

  if (isLoading) {
    return (
      <Card className="bg-white/5 border-white/20">
        <CardContent className="p-6 text-center">
          <div className="text-white">جاري التحميل...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-400" />
            <CardTitle className="text-white">إدارة فئات التنزيلات</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={resetToDefault}
              size="sm"
              variant="outline"
              className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
            >
              إعادة تحميل
            </Button>
            <Button
              onClick={() => setIsAdding(true)}
              size="sm"
              className="bg-green-500 hover:bg-green-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              إضافة فئة
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isAdding && (
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="اسم الفئة الجديدة"
              className="bg-white/10 border-white/20 text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <Button
              onClick={handleAddCategory}
              size="sm"
              className="bg-green-500 hover:bg-green-600"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => {
                setIsAdding(false);
                setNewCategory('');
              }}
              size="sm"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {dbCategories.map((category, index) => (
            <div key={index} className="flex items-center gap-1">
              {editingIndex === index ? (
                <div className="flex gap-1">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="bg-white/10 border-white/20 text-white text-sm h-8 w-32"
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                  />
                  <Button
                    onClick={handleSaveEdit}
                    size="sm"
                    className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600"
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingIndex(null);
                      setEditValue('');
                    }}
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 border-white/20 text-white hover:bg-white/10"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <Badge
                  variant="outline"
                  className="text-white border-white/20 bg-white/5 px-3 py-1 flex items-center gap-2"
                >
                  <span>{category}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditCategory(index)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </Badge>
              )}
            </div>
          ))}
        </div>
        
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-300 mb-2">
            <Tag className="w-4 h-4" />
            <span className="font-medium">الفئات النشطة من قاعدة البيانات</span>
          </div>
          <p className="text-gray-300 text-sm">
            الفئات المعروضة محفوظة في قاعدة البيانات ومتاحة للجميع
          </p>
          <p className="text-gray-400 text-xs mt-1">
            💡 يمكنك إضافة أو تعديل الفئات وستظهر في صفحة التنزيلات مباشرة للجميع
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadCategoriesManager;
