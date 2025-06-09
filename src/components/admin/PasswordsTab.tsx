
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Plus, Trash2, Key } from 'lucide-react';
import AdminStorage, { AdminUser } from '../../utils/adminStorage';
import { useToast } from '@/hooks/use-toast';

const PasswordsTab = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [showPasswords, setShowPasswords] = useState<{[key: number]: boolean}>({});
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'مشرف' as 'مدير عام' | 'مبرمج' | 'مشرف'
  });
  const { toast } = useToast();

  useEffect(() => {
    setUsers(AdminStorage.getAdminUsers());
  }, []);

  const togglePasswordVisibility = (userId: number) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

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

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">إدارة كلمات المرور</h2>
      
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
              type="text"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              placeholder="password123"
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
          <Key className="w-5 h-5" />
          المستخدمون الحاليون
        </h3>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="border border-white/10 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">اسم المستخدم</label>
                  <input
                    type="text"
                    value={user.username}
                    onChange={(e) => updateUser(user.id, { username: e.target.value })}
                    className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">كلمة المرور</label>
                  <div className="relative">
                    <input
                      type={showPasswords[user.id] ? "text" : "password"}
                      value={user.password}
                      onChange={(e) => updateUser(user.id, { password: e.target.value })}
                      className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 pr-10 focus:outline-none focus:border-blue-400"
                    />
                    <button
                      onClick={() => togglePasswordVisibility(user.id)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPasswords[user.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">الدور</label>
                  <select
                    value={user.role}
                    onChange={(e) => updateUser(user.id, { role: e.target.value as 'مدير عام' | 'مبرمج' | 'مشرف' })}
                    className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  >
                    <option value="مشرف">مشرف</option>
                    <option value="مبرمج">مبرمج</option>
                    <option value="مدير عام">مدير عام</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">معرف المستخدم</label>
                  <div className="text-gray-400 py-2">#{user.id}</div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-400 hover:text-red-300 transition-colors p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PasswordsTab;
