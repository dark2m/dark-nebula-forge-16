
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
  User,
  Key,
  Wrench,
  HeadphonesIcon,
  Users,
  Crown
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
      requiredRole: 'مشرف' as const
    },
    {
      id: 'tools',
      name: 'إدارة الأدوات',
      icon: Wrench,
      requiredRole: 'مشرف' as const
    },
    {
      id: 'customer-support',
      name: 'إدارة خدمة العملاء',
      icon: HeadphonesIcon,
      requiredRole: 'مشرف' as const
    },
    {
      id: 'customer-log',
      name: 'سجل العملاء',
      icon: Users,
      requiredRole: 'مشرف' as const
    },
    {
      id: 'users',
      name: 'إدارة المستخدمين',
      icon: User,
      requiredRole: 'مدير عام' as const
    },
    {
      id: 'passwords',
      name: 'إدارة كلمات المرور',
      icon: Key,
      requiredRole: 'مدير عام' as const
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
      requiredRole: 'مشرف' as const
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'مدير عام': return 'text-yellow-400';
      case 'مبرمج': return 'text-blue-400';
      case 'مشرف': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'مدير عام': return Crown;
      case 'مبرمج': return Shield;
      case 'مشرف': return User;
      default: return User;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced User Info */}
      <div className="relative group">
        {/* User Card Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 rounded-xl blur-sm opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
        
        {/* User Card */}
        <div className="relative bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-5 shadow-xl">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Avatar with Role Icon */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              {/* Role Badge */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black/80 rounded-full flex items-center justify-center border border-white/20">
                {React.createElement(getRoleIcon(currentUser?.role || ''), { 
                  className: `w-3 h-3 ${getRoleColor(currentUser?.role || '')}` 
                })}
              </div>
            </div>
            
            {/* User Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-lg truncate">{currentUser?.username}</h3>
              <p className={`text-sm font-medium ${getRoleColor(currentUser?.role || '')}`}>
                {currentUser?.role}
              </p>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-xs font-medium">متصل</span>
            </div>
            <span className="text-gray-400 text-xs">
              {new Date().toLocaleDateString('ar-SA')}
            </span>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-sm"></div>
        </div>
      </div>

      {/* Enhanced Navigation Menu */}
      <div className="space-y-2">
        <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-3 mb-4 flex items-center">
          <div className="w-6 h-px bg-gradient-to-r from-blue-500 to-purple-500 mr-2"></div>
          قائمة التنقل
        </div>
        
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const hasAccess = !item.requiredRole || canAccess(item.requiredRole);
          const isActive = activeTab === item.id;
          
          if (!hasAccess) return null;

          return (
            <div key={item.id} className="relative group">
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"></div>
              )}
              
              {/* Button Glow Effect */}
              {isActive && (
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-lg blur-sm"></div>
              )}
              
              <button
                onClick={() => setActiveTab(item.id)}
                className={`relative w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-white/20 shadow-lg'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/10 border border-transparent'
                }`}
              >
                {/* Icon with Glow */}
                <div className={`relative ${isActive ? 'text-blue-300' : ''}`}>
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <div className="absolute inset-0 w-5 h-5 bg-blue-400/30 rounded blur-sm"></div>
                  )}
                </div>
                
                {/* Text */}
                <span className="text-sm font-medium flex-1 text-right">{item.name}</span>
                
                {/* Active Indicator Dot */}
                {isActive && (
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                )}
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-lg"></div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Enhanced Permissions Indicator */}
      <div className="relative group">
        {/* Permissions Card Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-xl blur-sm opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
        
        {/* Permissions Card */}
        <div className="relative bg-black/30 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 shadow-lg">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-green-400 text-sm font-bold">صلاحيات النظام</div>
              <div className={`text-xs font-medium ${getRoleColor(currentUser?.role || '')}`}>
                {currentUser?.role}
              </div>
            </div>
          </div>
          
          {/* Permission Level Bar */}
          <div className="mt-3 bg-black/40 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
              style={{ 
                width: currentUser?.role === 'مدير عام' ? '100%' : 
                       currentUser?.role === 'مبرمج' ? '75%' : '50%' 
              }}
            ></div>
          </div>
          
          {/* Decorative Element */}
          <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
