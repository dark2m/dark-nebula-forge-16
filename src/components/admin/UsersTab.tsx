
import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Shield, UserCheck } from 'lucide-react';
import AdminStorage, { AdminUser } from '../../utils/adminStorage';
import { useToast } from '@/hooks/use-toast';

const UsersTab = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'مشرف' as 'مدير عام' | 'مبرمج' | 'مشرف'
  });
  const { toast } = useToast();

  useEffect(() => {
    setUsers(AdminStorage.getAdminUsers());
  }, []);

  const addUser = () => {
    if (!newUser.username || !newUser.password) {
      toast({
        title: "خطأ",
        description: "يجب ملء جميع الحقول",
        variant: "destructive"
      });
      return;
    }

    const existingUser = users.find(u => u.username === newUser.username);
    if (existingUser) {
      toast({
        title: "خطأ",
        description: "اسم المستخدم موجود بالفعل",
        variant: "destructive"
      });
      return;
    }

    AdminStorage.addAdminUser(newUser);
    setUsers(AdminStorage.getAdminUsers());
    setNewUser({ username: '', password: '', role: 'مشرف' });
    toast({
      title: "تم إضافة المستخدم",
      description: "تم إضافة المستخدم الجديد بنجاح"
    });
  };

  const updateUser = (id: number, updates: Partial<AdminUser>) => {
    AdminStorage.updateAdminUser(id, updates);
    setUsers(AdminStorage.getAdminUsers());
    toast({
      title: "تم تحديث المستخدم",
      description: "تم حفظ التغييرات بنجاح"
    });
  };

  const deleteUser = (id: number) => {
    AdminStorage.deleteAdminUser(id);
    setUsers(AdminStorage.getAdminUsers());
    toast({
      title: "تم حذف المستخدم",
      description: "تم حذف المستخدم بنجاح"
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'مدير عام': return 'text-red-400';
      case 'مبرمج': return 'text-blue-400';
      case 'مشرف': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">إدارة المستخدمين</h2>
      
      {/* Add New User */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          إضافة مستخدم جديد
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">اسم المستخدم</label>
            <input
              type="text"
              value={newUser.username}
              onChange={(e) => setNewUser({...newUser, username: e.target.value})}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">كلمة المرور</label>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              placeholder="password"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">الدور</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value as 'مدير عام' | 'مبرمج' | 'مشرف'})}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            >
              <option value="مشرف">مشرف</option>
              <option value="مبرمج">مبرمج</option>
              <option value="مدير عام">مدير عام</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={addUser}
              className="w-full glow-button flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              إضافة
            </button>
          </div>
        </div>
      </div>

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
                  <UserCheck className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">{user.username}</h4>
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
                >
                  <option value="مشرف">مشرف</option>
                  <option value="مبرمج">مبرمج</option>
                  <option value="مدير عام">مدير عام</option>
                </select>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="text-red-400 hover:text-red-300 transition-colors p-2"
                  disabled={users.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
