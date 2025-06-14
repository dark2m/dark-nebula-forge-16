
import React from 'react';
import { useSiteData } from '../hooks/useSiteData';

const Dashboard = () => {
  const siteData = useSiteData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">لوحة التحكم</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-2">المنتجات</h2>
            <p className="text-3xl font-bold text-blue-400">{siteData.products.length}</p>
            <p className="text-gray-400">إجمالي المنتجات</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-2">الأدوات</h2>
            <p className="text-3xl font-bold text-green-400">{siteData.tools.length}</p>
            <p className="text-gray-400">إجمالي الأدوات</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-2">الإعدادات</h2>
            <p className="text-3xl font-bold text-purple-400">✓</p>
            <p className="text-gray-400">محفوظة محلياً</p>
          </div>
        </div>
        
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4">إعدادات الموقع</h2>
          <div className="space-y-2">
            <p className="text-gray-300">العنوان: {siteData.siteSettings.title}</p>
            <p className="text-gray-300">الوصف: {siteData.siteSettings.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
