
import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  Type, 
  Navigation as NavigationIcon, 
  MessageCircle, 
  Palette,
  Eye,
  Database,
  Shield,
  User
} from 'lucide-react';
import type { AdminUser } from '../../types/admin';

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
  const sidebarItems = [
    {
      id: 'overview',
      name: 'نظرة عامة',
      icon: LayoutDashboard,
      requiredRole: null
    },
    {
      id: 'products',
      name: 'إدارة المنتجات',
      icon: Package,
      requiredRole: 'مبرمج' as const
    },
    {
      id: 'site-control',
      name: 'تحكم شامل',
      icon: Settings,
      requiredRole: 'مدير عام' as const
    },
    {
      id: 'texts',
      name: 'إدارة النصوص',
      icon: Type,
      requiredRole: 'مبرمج' as const
    },
    {
      id: 'navigation',
      name: 'شريط التنقل',
      icon: NavigationIcon,
      requiredRole: 'مبرمج' as const
    },
    {
      id: 'contact',
      name: 'معلومات التواصل',
      icon: MessageCircle,
      requiredRole: 'مبرمج' as const
    },
    {
      id: 'design',
      name: 'تخصيص التصميم',
      icon: Palette,
      requiredRole: 'مدير عام' as const
    },
    {
      id: 'preview',
      name: 'معاينة مباشرة',
      icon: Eye,
      requiredRole: null
    },
    {
      id: 'backup',
      name: 'النسخ الاحتياطي',
      icon: Database,
      requiredRole: 'مدير عام' as const
    }
  ];

  return (
    <div className="lg:col-span-1">
      <div className="admin-card rounded-xl p-6 sticky top-8">
        {/* معلومات المستخدم */}
        <div className="mb-6 p-4 bg-white/5 rounded-lg">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <User className="w-8 h-8 text-blue-400" />
            <div>
              <h3 className="text-white font-semibold">{currentUser?.username}</h3>
              <p className="text-gray-400 text-sm">{currentUser?.role}</p>
            </div>
          </div>
        </div>

        {/* قائمة التنقل */}
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const hasAccess = !item.requiredRole || canAccess(item.requiredRole);
            
            if (!hasAccess) return null;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* مؤشر الصلاحيات */}
        <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm">
              صلاحياتك: {currentUser?.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
