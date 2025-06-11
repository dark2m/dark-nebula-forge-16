
import React from 'react';
import { LogOut, User, Shield } from 'lucide-react';
import type { AdminUser } from '../../types/admin';

interface AdminHeaderProps {
  currentUser: AdminUser | null;
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ currentUser, onLogout }) => {
  return (
    <header className="bg-black/50 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <h1 className="text-2xl font-bold text-white">لوحة التحكم</h1>
            <span className="text-gray-400">|</span>
            <span className="text-blue-400 font-medium">DARK Admin</span>
          </div>
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* معلومات المستخدم */}
            {currentUser && (
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-white">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-sm">{currentUser.role}</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <User className="w-4 h-4" />
                  <span>{currentUser.username}</span>
                </div>
              </div>
            )}
            
            {/* زر تسجيل الخروج */}
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
