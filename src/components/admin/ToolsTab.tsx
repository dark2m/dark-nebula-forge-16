
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, Wrench, Code, Star, Zap, Shield, Globe, Package } from 'lucide-react';
import { passwordGeneratorToolCode } from '../../utils/passwordGeneratorTool';
import { useSupabaseTools } from '../../hooks/useSupabaseTools';
import type { Tool } from '../../types/admin';

const ToolsTab = () => {
  const { tools, isLoading, isSaving, addTool, updateTool, deleteTool } = useSupabaseTools();

  const categories = [
    { value: 'general', label: 'عام', color: 'bg-gradient-to-r from-blue-500 to-blue-600', icon: '🔧' },
    { value: 'security', label: 'أمان', color: 'bg-gradient-to-r from-green-500 to-green-600', icon: '🔐' },
    { value: 'development', label: 'تطوير', color: 'bg-gradient-to-r from-purple-500 to-purple-600', icon: '💻' },
    { value: 'design', label: 'تصميم', color: 'bg-gradient-to-r from-orange-500 to-orange-600', icon: '🎨' }
  ];

  const addToolByCategory = async (category: string) => {
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

    const newToolData = {
      name: `${categoryLabels[category]}-${Date.now()}`,
      title: `${categoryLabels[category]} جديدة`,
      description: 'وصف الأداة',
      buttonText: 'استخدام الأداة',
      url: '',
      icon: categoryIcons[category],
      visible: true,
      isActive: true,
      category: category,
      customHtml: ''
    };

    try {
      await addTool(newToolData);
    } catch (error) {
      console.error('Error adding tool:', error);
    }
  };

  const addPasswordGeneratorTool = async () => {
    const passwordToolData = {
      name: 'password-generator',
      title: 'مولد كلمات المرور',
      description: 'أداة لتوليد كلمات مرور قوية وآمنة مع خيارات متقدمة',
      buttonText: 'استخدام المولد',
      url: '',
      icon: '🔐',
      visible: true,
      isActive: true,
      category: 'security',
      customHtml: passwordGeneratorToolCode
    };

    try {
      await addTool(passwordToolData);
    } catch (error) {
      console.error('Error adding password generator tool:', error);
    }
  };

  const handleInputChange = async (toolId: number, field: string, value: any) => {
    console.log('Immediate save for tool:', toolId, field, value);
    try {
      await updateTool(toolId, { [field]: value });
    } catch (error) {
      console.error('Error updating tool:', error);
    }
  };

  const toggleToolVisibility = async (toolId: number) => {
    const tool = tools.find(t => t.id === toolId);
    if (tool) {
      try {
        await updateTool(toolId, { visible: !tool.visible });
      } catch (error) {
        console.error('Error toggling tool visibility:', error);
      }
    }
  };

  const handleDeleteTool = async (id: number) => {
    try {
      await deleteTool(id);
    } catch (error) {
      console.error('Error deleting tool:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            إدارة الأدوات
          </h2>
          <p className="text-gray-400">أضف وعدل أدوات موقعك بسهولة</p>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">جاري تحميل الأدوات...</p>
        </div>
      </div>
    );
  }

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
            disabled={isSaving}
            className={`${cat.color} p-6 rounded-2xl hover:scale-105 transition-all duration-300 group shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
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

      {/* زر إضافة مولد كلمات المرور */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">أدوات خاصة</h3>
            <p className="text-gray-400">أدوات معدة مسبقاً جاهزة للاستخدام</p>
          </div>
          <button
            onClick={addPasswordGeneratorTool}
            disabled={isSaving}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Shield className="w-5 h-5" />
            إضافة مولد كلمات المرور
          </button>
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
                        disabled={isSaving}
                        className={`p-3 rounded-xl transition-colors disabled:opacity-50 ${
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
                      onClick={() => handleDeleteTool(tool.id)}
                      disabled={isSaving}
                      className="bg-orange-500/20 hover:bg-orange-500/40 rounded-xl p-3 transition-colors disabled:opacity-50"
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
                      disabled={isSaving}
                      className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 transition-colors disabled:opacity-50"
                      placeholder="اسم الأداة..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-purple-300 text-sm font-medium mb-3">الفئة</label>
                    <select
                      value={tool.category}
                      onChange={(e) => handleInputChange(tool.id, 'category', e.target.value)}
                      disabled={isSaving}
                      className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-400 transition-colors disabled:opacity-50"
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
                      disabled={isSaving}
                      className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 transition-colors disabled:opacity-50"
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
                    disabled={isSaving}
                    className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-4 py-4 focus:outline-none focus:border-cyan-400 transition-colors h-24 resize-none disabled:opacity-50"
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
                      disabled={isSaving}
                      className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 transition-colors disabled:opacity-50"
                      placeholder="نص الزر..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-pink-300 text-sm font-medium mb-3">رابط الأداة</label>
                    <input
                      type="text"
                      value={tool.url}
                      onChange={(e) => handleInputChange(tool.id, 'url', e.target.value)}
                      disabled={isSaving}
                      className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-400 transition-colors disabled:opacity-50"
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
                    disabled={isSaving}
                    className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-4 py-4 focus:outline-none focus:border-blue-400 transition-colors h-32 resize-none font-mono text-sm disabled:opacity-50"
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
                  disabled={isSaving}
                  className={`${cat.color} px-6 py-3 rounded-xl text-white font-medium hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
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
