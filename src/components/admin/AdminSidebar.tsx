
import React from 'react';
import { User, Users, Settings, Palette, Eye, Save, Package, MessageSquare, Lock, Shield, Wrench, Download, FileDown } from 'lucide-react';

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
    { id: 'products', label: 'المنتجات', icon: Package, roles: ['مدير عام', 'مبرمج'] },
    { id: 'downloads', label: 'التنزيلات', icon: Download, roles: ['مدير عام', 'مبرمج'] },
    { id: 'downloads-management', label: 'إدارة التنزيلات', icon: FileDown, roles: ['مدير عام', 'مبرمج'] },
    { id: 'users', label: 'المستخدمين', icon: Users, roles: ['مدير عام'] },
    { id: 'passwords', label: 'كلمات المرور', icon: Lock, roles: ['مدير عام'] },
    { id: 'tools', label: 'الأدوات', icon: Wrench, roles: ['مدير عام', 'مبرمج', 'مشرف'] },
    { id: 'customer-support', label: 'خدمة العملاء', icon: MessageSquare, roles: ['مدير عام', 'مبرمج', 'مشرف'] },
    { id: 'site-control', label: 'التحكم بالموقع', icon: Settings, roles: ['مدير عام', 'مبرمج'] },
    { id: 'texts', label: 'النصوص', icon: Settings, roles: ['مدير عام', 'مبرمج'] },
    { id: 'navigation', label: 'التنقل', icon: Settings, roles: ['مدير عام', 'مبرمج'] },
    { id: 'contact', label: 'التواصل', icon: Settings, roles: ['مدير عام', 'مبرمج'] },
    { id: 'design', label: 'التصميم', icon: Palette, roles: ['مدير عام', 'مبرمج'] },
    { id: 'preview', label: 'المعاينة', icon: Eye, roles: ['مدير عام', 'مبرمج', 'مشرف'] },
    { id: 'backup', label: 'النسخ الاحتياطي', icon: Save, roles: ['مدير عام'] }
  ];

  return (
    <div className="space-y-3">
      {/* User Info */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">{currentUser?.email}</h3>
            <p className="text-gray-400 text-xs flex items-center">
              <Shield className="w-3 h-3 ml-1" />
              {currentUser?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-1 px-2">
        {menuItems.map((item) => {
          const canAccessItem = item.roles.some(role => canAccess(role as any));
          if (!canAccessItem) return null;

          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                isActive
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isActive ? 'text-blue-400' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSidebar;
