
import React from 'react';
import { Users, Shield, UserCheck, Lock } from 'lucide-react';
import { useSupabaseAdminUsers } from '../../hooks/useSupabaseAdminUsers';

const UsersTab = () => {
  const { users, isLoading, updateUser } = useSupabaseAdminUsers();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'مدير عام': return 'text-red-400';
      case 'مبرمج': return 'text-blue-400';
      case 'مشرف': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const isOwner = (username: string) => username === 'dark';

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">إدارة المستخدمين</h2>
        <div className="admin-card rounded-xl p-6">
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">جاري تحميل المستخدمين...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">إدارة المستخدمين</h2>
      
      {/* Users List */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          المستخدمون الحاليون ({users.length})
        </h3>
        <div className="grid gap-4">
          {users.map((user) => (
            <div key={user.id} className="border border-white/10 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-full">
                  {isOwner(user.username) ? (
                    <Lock className="w-5 h-5 text-red-400" />
                  ) : (
                    <UserCheck className="w-5 h-5 text-blue-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-semibold">{user.username}</h4>
                    {isOwner(user.username) && (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">مالك الخادم</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className={`text-sm ${getRoleColor(user.role)}`}>{user.role}</span>
                    <span className="text-gray-500 text-xs">#{user.id}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <select
                  value={user.role}
                  onChange={(e) => updateUser(user.id, { role: e.target.value as 'مدير عام' | 'مبرمج' | 'مشرف' })}
                  className="bg-white/10 text-white border border-white/20 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400"
                  disabled={isOwner(user.username)}
                >
                  <option value="مشرف">مشرف</option>
                  <option value="مبرمج">مبرمج</option>
                  <option value="مدير عام">مدير عام</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">لا يوجد مستخدمون</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersTab;
