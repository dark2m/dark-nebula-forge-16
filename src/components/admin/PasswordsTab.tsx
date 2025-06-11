
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Plus, Trash2, Key, Save } from 'lucide-react';
import UserService from '../../utils/userService';
import { useToast } from '@/hooks/use-toast';
import type { AdminUser } from '../../types/admin';

const PasswordsTab = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [editedUsers, setEditedUsers] = useState<{[key: number]: Partial<AdminUser>}>({});
  const [showPasswords, setShowPasswords] = useState<{[key: number]: boolean}>({});
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'مشرف' as 'مدير عام' | 'مبرمج' | 'مشرف'
  });
  const { toast } = useToast();

  useEffect(() => {
    setUsers(UserService.getAdminUsers());
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

    UserService.addAdminUser(newUser);
    setUsers(UserService.getAdminUsers());
    setNewUser({ username: '', password: '', role: 'مشرف' });
    toast({
      title: "تم إضافة المستخدم",
      description: "تم إضافة المستخدم الجديد بنجاح"
    });
  };

  const handleUserChange = (userId: number, field: string, value: any) => {
    setEditedUsers(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value
      }
    }));
  };

  const saveUser = (userId: number) => {
    const changes = editedUsers[userId];
    if (changes) {
      UserService.updateAdminUser(userId, changes);
      setUsers(UserService.getAdminUsers());
      setEditedUsers(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
      toast({
        title: "تم تحديث المستخدم",
        description: "تم حفظ التغييرات بنجاح"
      });
    }
  };

  const deleteUser = (id: number) => {
    UserService.deleteAdminUser(id);
    setUsers(UserService.getAdminUsers());
    toast({
      title: "تم حذف المستخدم",
      description: "تم حذف المستخدم بنجاح"
    });
  };

  const getUserValue = (user: AdminUser, field: string) => {
    return editedUsers[user.id]?.[field] !== undefined 
      ? editedUsers[user.id][field] 
      : user[field as keyof AdminUser];
  };

  const hasChanges = (userId: number) => {
    return editedUsers[userId] && Object.keys(editedUsers[userId]).length > 0;
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
              className="w-full bg-gray-800 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            >
              <option value="مشرف" className="bg-gray-800 text-white">مشرف</option>
              <option value="مبرمج" className="bg-gray-800 text-white">مبرمج</option>
              <option value="مدير عام" className="bg-gray-800 text-white">مدير عام</option>
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
              <div className="flex justify-between items-center mb-4">
                <span className="text-white font-medium">المستخدم #{user.id}</span>
                {hasChanges(user.id) && (
                  <button
                    onClick={() => saveUser(user.id)}
                    className="glow-button flex items-center gap-2 text-sm"
                  >
                    <Save className="w-4 h-4" />
                    حفظ التغييرات
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">اسم المستخدم</label>
                  <input
                    type="text"
                    value={getUserValue(user, 'username')}
                    onChange={(e) => handleUserChange(user.id, 'username', e.target.value)}
                    className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">كلمة المرور</label>
                  <div className="relative">
                    <input
                      type={showPasswords[user.id] ? "text" : "password"}
                      value={getUserValue(user, 'password')}
                      onChange={(e) => handleUserChange(user.id, 'password', e.target.value)}
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
                    value={getUserValue(user, 'role')}
                    onChange={(e) => handleUserChange(user.id, 'role', e.target.value)}
                    className="w-full bg-gray-800 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  >
                    <option value="مشرف" className="bg-gray-800 text-white">مشرف</option>
                    <option value="مبرمج" className="bg-gray-800 text-white">مبرمج</option>
                    <option value="مدير عام" className="bg-gray-800 text-white">مدير عام</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">معرف المستخدم</label>
                  <div className="text-gray-400 py-2">#{user.id}</div>
                </div>
                <div className="flex gap-2 justify-end">
                  {hasChanges(user.id) && (
                    <button
                      onClick={() => saveUser(user.id)}
                      className="glow-button flex items-center gap-1 text-sm px-3 py-1"
                    >
                      <Save className="w-3 h-3" />
                      حفظ
                    </button>
                  )}
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
