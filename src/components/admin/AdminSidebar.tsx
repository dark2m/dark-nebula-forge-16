
import React from 'react';
import { 
  Settings, 
  Palette, 
  Package, 
  Users, 
  BarChart3, 
  Key,
  Type,
  Navigation as NavigationIcon,
  MessageCircle,
  Shield
} from 'lucide-react';
import { AdminUser } from '../../utils/adminStorage';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: AdminUser | null;
  canAccess: (role: 'مدير عام' | 'مبرمج' | 'مشرف') => boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  canAccess 
}) => {
  const tabs = [
    { id: 'overview', name: 'نظرة عامة', icon: BarChart3, requiredRole: 'مشرف' as const },
    { id: 'products', name: 'إدارة المنتجات', icon: Package, requiredRole: 'مبرمج' as const },
    { id: 'passwords', name: 'إدارة كلمات المرور', icon: Key, requiredRole: 'مدير عام' as const },
    { id: 'design', name: 'تخصيص التصميم', icon: Palette, requiredRole: 'مدير عام' as const },
    { id: 'typography', name: 'التحكم في النصوص', icon: Type, requiredRole: 'مدير عام' as const },
    { id: 'navigation', name: 'إدارة التنقل', icon: NavigationIcon, requiredRole: 'مدير عام' as const },
    { id: 'contact', name: 'إعدادات التواصل', icon: MessageCircle, requiredRole: 'مدير عام' as const },
    { id: 'users', name: 'إدارة المستخدمين', icon: Users, requiredRole: 'مشرف' as const },
    { id: 'settings', name: 'الإعدادات', icon: Settings, requiredRole: 'مدير عام' as const },
  ];

  const visibleTabs = tabs.filter(tab => canAccess(tab.requiredRole));

  return (
    <div className="lg:col-span-1">
      <div className="admin-card rounded-xl p-6">
        <nav className="space-y-2">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Role Info */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h3 className="text-blue-400 font-semibold mb-2">دورك الحالي:</h3>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-white">{currentUser?.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
