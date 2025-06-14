
import React from 'react';
import { LogOut, User, Shield, Crown, Star } from 'lucide-react';
import type { AdminUser } from '../../types/admin';

interface AdminHeaderProps {
  currentUser: AdminUser | null;
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ currentUser, onLogout }) => {
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
      case 'مشرف': return Star;
      default: return User;
    }
  };

  return (
    <header className="relative">
      {/* Header Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
      
      {/* Header Content */}
      <div className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          
          {/* Brand Section */}
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            {/* Logo/Brand */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 rounded-xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
              <div className="relative bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3 shadow-xl">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  لوحة التحكم
                </h1>
              </div>
            </div>
            
            {/* Separator */}
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
            
            {/* Brand Badge */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg blur-sm opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
              <div className="relative bg-black/30 backdrop-blur-sm border border-purple-500/30 rounded-lg px-4 py-2">
                <span className="text-purple-300 font-semibold text-sm flex items-center space-x-2 rtl:space-x-reverse">
                  <Crown className="w-4 h-4" />
                  <span>DARK Admin Pro</span>
                </span>
              </div>
            </div>
          </div>
          
          {/* User Section */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            
            {/* User Info Card */}
            {currentUser && (
              <div className="relative group">
                {/* User Card Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-xl blur-sm opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                
                {/* User Card */}
                <div className="relative bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 shadow-xl">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    
                    {/* Role Badge */}
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        currentUser.role === 'مدير عام' 
                          ? 'bg-gradient-to-br from-yellow-500 to-orange-500' 
                          : currentUser.role === 'مبرمج'
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                          : 'bg-gradient-to-br from-green-500 to-emerald-500'
                      }`}>
                        {React.createElement(getRoleIcon(currentUser.role), { 
                          className: "w-4 h-4 text-white" 
                        })}
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${getRoleColor(currentUser.role)}`}>
                          {currentUser.role}
                        </div>
                        <div className="text-xs text-gray-400">صلاحيات النظام</div>
                      </div>
                    </div>
                    
                    {/* Separator */}
                    <div className="h-8 w-px bg-white/20"></div>
                    
                    {/* User Details */}
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">{currentUser.username}</div>
                        <div className="text-gray-400 text-xs">مدير النظام</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Active Status */}
                  <div className="absolute top-2 right-2 flex items-center space-x-1 rtl:space-x-reverse">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs font-medium">نشط</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Logout Button */}
            <div className="relative group">
              {/* Button Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500/30 to-pink-500/30 rounded-xl blur-sm opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
              
              {/* Button */}
              <button
                onClick={onLogout}
                className="relative flex items-center space-x-3 rtl:space-x-reverse px-5 py-3 bg-black/40 hover:bg-red-500/20 backdrop-blur-sm border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 rounded-xl transition-all duration-300 shadow-lg group"
              >
                <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-medium">تسجيل الخروج</span>
                
                {/* Button Inner Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl"></div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Status Bar */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>النظام يعمل بشكل طبيعي</span>
            </div>
            <span>•</span>
            <span>آخر تحديث: {new Date().toLocaleTimeString('ar-SA')}</span>
          </div>
          <div className="text-purple-400">
            🔐 جلسة آمنة ومشفرة
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
    </header>
  );
};

export default AdminHeader;
