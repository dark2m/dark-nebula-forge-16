
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Plus, Trash2, Key, Save, Shield, User, Settings, Lock } from 'lucide-react';
import UserService from '../../utils/userService';
import { useToast } from '@/hooks/use-toast';
import type { AdminUser } from '../../types/admin';

const PasswordsTab = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [editedUsers, setEditedUsers] = useState<{[key: number]: Partial<AdminUser>}>({});
  const [showPasswords, setShowPasswords] = useState<{[key: number]: boolean}>({});
  const [expandedPermissions, setExpandedPermissions] = useState<{[key: number]: boolean}>({});
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'مشرف' as 'مدير عام' | 'مبرمج' | 'مشرف',
    permissions: {
      overview: true,
      products: false,
      users: false,
      passwords: false,
      tools: true,
      customerSupport: true,
      siteControl: false,
      texts: false,
      navigation: false,
      contact: false,
      design: false,
      preview: true,
      backup: false
    }
  });
  const { toast } = useToast();

  useEffect(() => {
    setUsers(UserService.getAdminUsers());
  }, []);

  const defaultPermissions = {
    overview: true,
    products: false,
    users: false,
    passwords: false,
    tools: true,
    customerSupport: true,
    siteControl: false,
    texts: false,
    navigation: false,
    contact: false,
    design: false,
    preview: true,
    backup: false
  };

  const togglePasswordVisibility = (userId: number) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const togglePermissionsExpansion = (userId: number) => {
    setExpandedPermissions(prev => ({
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
    setNewUser({ 
      username: '', 
      password: '', 
      role: 'مشرف',
      permissions: defaultPermissions
    });
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

  const handlePermissionChange = (userId: number, permission: string, value: boolean) => {
    setEditedUsers(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        permissions: {
          ...((prev[userId]?.permissions) || getUserValue(users.find(u => u.id === userId)!, 'permissions')),
          [permission]: value
        }
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'مدير عام': return 'text-emerald-400 bg-emerald-500/10';
      case 'مبرمج': return 'text-blue-400 bg-blue-500/10';
      case 'مشرف': return 'text-purple-400 bg-purple-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const permissionLabels = {
    overview: 'نظرة عامة',
    products: 'إدارة المنتجات',
    users: 'إدارة المستخدمين',
    passwords: 'إدارة كلمات المرور',
    tools: 'الأدوات',
    customerSupport: 'خدمة العملاء',
    siteControl: 'التحكم بالموقع',
    texts: 'إدارة النصوص',
    navigation: 'إدارة التنقل',
    contact: 'معلومات التواصل',
    design: 'التصميم',
    preview: 'معاينة مباشرة',
    backup: 'النسخ الاحتياطي'
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          إدارة كلمات المرور والأذونات
        </h2>
        <p className="text-gray-400">تحكم كامل في المستخدمين وصلاحياتهم</p>
      </div>
      
      {/* Add New User */}
      <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Plus className="w-6 h-6 text-white" />
          </div>
          إضافة مستخدم جديد
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-blue-300 text-sm font-semibold">اسم المستخدم</label>
            <div className="relative">
              <User className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-12 py-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                placeholder="admin"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-blue-300 text-sm font-semibold">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-12 py-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                placeholder="password123"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-blue-300 text-sm font-semibold">الدور</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value as 'مدير عام' | 'مبرمج' | 'مشرف'})}
              className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
            >
              <option value="مشرف" className="bg-gray-800 text-white">مشرف</option>
              <option value="مبرمج" className="bg-gray-800 text-white">مبرمج</option>
              <option value="مدير عام" className="bg-gray-800 text-white">مدير عام</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={addUser}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            إضافة المستخدم
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-gradient-to-br from-gray-900/50 via-black/50 to-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
            <Key className="w-6 h-6 text-white" />
          </div>
          المستخدمون الحاليون ({users.length})
        </h3>
        
        <div className="space-y-6">
          {users.map((user) => (
            <div key={user.id} className="bg-gradient-to-r from-gray-800/30 to-gray-700/30 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">المستخدم #{user.id}</h4>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(getUserValue(user, 'role'))}`}>
                      {getUserValue(user, 'role')}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {hasChanges(user.id) && (
                    <button
                      onClick={() => saveUser(user.id)}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm font-semibold"
                    >
                      <Save className="w-4 h-4" />
                      حفظ التغييرات
                    </button>
                  )}
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white p-2 rounded-lg transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="block text-blue-300 text-sm font-semibold">اسم المستخدم</label>
                  <input
                    type="text"
                    value={getUserValue(user, 'username')}
                    onChange={(e) => handleUserChange(user.id, 'username', e.target.value)}
                    className="w-full bg-black/20 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400 transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-blue-300 text-sm font-semibold">كلمة المرور</label>
                  <div className="relative">
                    <input
                      type={showPasswords[user.id] ? "text" : "password"}
                      value={getUserValue(user, 'password')}
                      onChange={(e) => handleUserChange(user.id, 'password', e.target.value)}
                      className="w-full bg-black/20 text-white border border-white/20 rounded-lg px-4 py-2 pr-12 focus:outline-none focus:border-blue-400 transition-all"
                    />
                    <button
                      onClick={() => togglePasswordVisibility(user.id)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPasswords[user.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-blue-300 text-sm font-semibold">الدور</label>
                  <select
                    value={getUserValue(user, 'role')}
                    onChange={(e) => handleUserChange(user.id, 'role', e.target.value)}
                    className="w-full bg-black/20 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400 transition-all"
                  >
                    <option value="مشرف" className="bg-gray-800 text-white">مشرف</option>
                    <option value="مبرمج" className="bg-gray-800 text-white">مبرمج</option>
                    <option value="مدير عام" className="bg-gray-800 text-white">مدير عام</option>
                  </select>
                </div>
              </div>

              {/* Permissions Section */}
              <div className="border-t border-white/10 pt-4">
                <button
                  onClick={() => togglePermissionsExpansion(user.id)}
                  className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors mb-4"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-semibold">إدارة الأذونات</span>
                  <div className={`transform transition-transform ${expandedPermissions[user.id] ? 'rotate-180' : ''}`}>
                    ▼
                  </div>
                </button>
                
                {expandedPermissions[user.id] && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Object.entries(permissionLabels).map(([key, label]) => {
                      const currentPermissions = getUserValue(user, 'permissions') || defaultPermissions;
                      const hasPermission = currentPermissions[key as keyof typeof defaultPermissions];
                      
                      return (
                        <label key={key} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={hasPermission}
                            onChange={(e) => handlePermissionChange(user.id, key, e.target.checked)}
                            className="w-4 h-4 accent-blue-500"
                          />
                          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                            {label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 text-lg">لا يوجد مستخدمون</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordsTab;
