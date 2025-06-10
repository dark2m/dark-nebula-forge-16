
import React from 'react';
import { LogOut } from 'lucide-react';
import type { AdminUser } from '../../types/admin';

interface AdminHeaderProps {
  currentUser: AdminUser | null;
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ currentUser, onLogout }) => {
  return (
    <div className="bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">لوحة تحكم الإدارة</h1>
            {currentUser && (
              <p className="text-gray-400 text-sm">
                مرحباً {currentUser.username} - {currentUser.role}
                {currentUser.role === 'مدير عام' && (
                  <span className="text-green-400 mr-2">• تحكم كامل</span>
                )}
              </p>
            )}
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 rtl:space-x-reverse text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
