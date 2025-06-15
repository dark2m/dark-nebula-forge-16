
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Check, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import DownloadCategoriesService from '../../utils/downloadCategoriesService';

interface DownloadCategoriesManagerProps {
  categories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

const DownloadCategoriesManager: React.FC<DownloadCategoriesManagerProps> = ({
  categories,
  onCategoriesChange
}) => {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  // Load categories on component mount and sync with the limited set
  useEffect(() => {
    // Set the current limited categories
    const limitedCategories = ['أدوات', 'بيباس'];
    DownloadCategoriesService.saveCategories(limitedCategories);
    onCategoriesChange(limitedCategories);
  }, [onCategoriesChange]);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()];
      DownloadCategoriesService.saveCategories(updatedCategories);
      onCategoriesChange(updatedCategories);
      setNewCategory('');
      setIsAdding(false);
      
      toast({
        title: "تم إضافة الفئة",
        description: `تم إضافة فئة "${newCategory}" بنجاح`
      });
    } else if (categories.includes(newCategory.trim())) {
      toast({
        title: "خطأ",
        description: "هذه الفئة موجودة بالفعل",
        variant: "destructive"
      });
    }
  };

  const handleEditCategory = (index: number) => {
    setEditingIndex(index);
    setEditValue(categories[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editValue.trim() && !categories.includes(editValue.trim())) {
      const oldCategory = categories[editingIndex];
      const updatedCategories = [...categories];
      updatedCategories[editingIndex] = editValue.trim();
      
      DownloadCategoriesService.saveCategories(updatedCategories);
      onCategoriesChange(updatedCategories);
      setEditingIndex(null);
      setEditValue('');
      
      toast({
        title: "تم تحديث الفئة",
        description: `تم تحديث الفئة من "${oldCategory}" إلى "${editValue}"`
      });
    } else if (categories.includes(editValue.trim())) {
      toast({
        title: "خطأ",
        description: "هذه الفئة موجودة بالفعل",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = (category: string) => {
    if (categories.length <= 1) {
      toast({
        title: "تحذير",
        description: "لا يمكن حذف آخر فئة متبقية",
        variant: "destructive"
      });
      return;
    }

    const updatedCategories = categories.filter(c => c !== category);
    DownloadCategoriesService.saveCategories(updatedCategories);
    onCategoriesChange(updatedCategories);
    
    toast({
      title: "تم حذف الفئة",
      description: `تم حذف فئة "${category}" بنجاح`
    });
  };

  const resetToDefault = () => {
    const defaultCategories = ['أدوات', 'بيباس'];
    DownloadCategoriesService.saveCategories(defaultCategories);
    onCategoriesChange(defaultCategories);
    
    toast({
      title: "تم إعادة التعيين",
      description: "تم إعادة تعيين الفئات للإعدادات الافتراضية"
    });
  };

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
              إعادة تعيين
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
          {categories.map((category, index) => (
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
            <span className="font-medium">الفئات الحالية النشطة</span>
          </div>
          <p className="text-gray-300 text-sm">
            الفئات المعروضة حالياً: <strong>أدوات</strong> و <strong>بيباس</strong> فقط
          </p>
          <p className="text-gray-400 text-xs mt-1">
            💡 يمكنك إضافة أو تعديل الفئات وستظهر في صفحة التنزيلات مباشرة
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadCategoriesManager;
