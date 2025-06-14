
import React from 'react';
import { User, Users, Settings, Palette, Eye, Save, Package, MessageSquare, Lock, Shield, Wrench } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: any;
  canAccess: (role: 'مدير عام' | 'مبرمج' | 'مشرف') => boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  currentUser,
  canAccess 
}) => {
  const menuItems = [
    { id: 'overview', label: 'نظرة عامة', icon: Eye, roles: ['مدير عام', 'مبرمج', 'مشرف'] },
    { id: 'products', label: 'إدارة المنتجات', icon: Package, roles: ['مدير عام', 'مبرمج'] },
    { id: 'users', label: 'إدارة المستخدمين', icon: Users, roles: ['مدير عام'] },
    { id: 'passwords', label: 'إدارة كلمات المرور', icon: Lock, roles: ['مدير عام'] },
    { id: 'tools', label: 'الأدوات', icon: Wrench, roles: ['مدير عام', 'مبرمج', 'مشرف'] },
    { id: 'customer-support', label: 'خدمة العملاء', icon: MessageSquare, roles: ['مدير عام', 'مبرمج', 'مشرف'] },
    { id: 'site-control', label: 'التحكم بالموقع', icon: Settings, roles: ['مدير عام', 'مبرمج'] },
    { id: 'texts', label: 'إدارة النصوص', icon: Settings, roles: ['مدير عام', 'مبرمج'] },
    { id: 'navigation', label: 'إدارة التنقل', icon: Settings, roles: ['مدير عام', 'مبرمج'] },
    { id: 'contact', label: 'معلومات التواصل', icon: Settings, roles: ['مدير عام', 'مبرمج'] },
    { id: 'design', label: 'التصميم', icon: Palette, roles: ['مدير عام', 'مبرمج'] },
    { id: 'preview', label: 'معاينة مباشرة', icon: Eye, roles: ['مدير عام', 'مبرمج', 'مشرف'] },
    { id: 'backup', label: 'النسخ الاحتياطي', icon: Save, roles: ['مدير عام'] }
  ];

  return (
    <div className="space-y-3">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">{currentUser?.email}</h3>
            <p className="text-gray-400 text-sm flex items-center">
              <Shield className="w-3 h-3 ml-1" />
              {currentUser?.role}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2 px-3">
        {menuItems.map((item) => {
          const canAccessItem = item.roles.some(role => canAccess(role as any));
          if (!canAccessItem) return null;

          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-400/30 shadow-lg'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <IconComponent className={`w-5 h-5 ${isActive ? 'text-blue-400' : ''}`} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSidebar;
