
import React, { useState } from 'react';
import { Eye, EyeOff, Plus, Trash2, Key, Save, Shield, User, Settings, Lock } from 'lucide-react';
import { useSupabaseAdminUsers } from '../../hooks/useSupabaseAdminUsers';
import { useToast } from '@/hooks/use-toast';
import AuthService from '../../utils/auth';
import type { AdminUser } from '../../types/admin';

const PasswordsTab = () => {
  const { users, isLoading, isSaving, addUser, updateUser, deleteUser } = useSupabaseAdminUsers();
  const [editedUsers, setEditedUsers] = useState<{[key: number]: Partial<AdminUser>}>({});
  const [showPasswords, setShowPasswords] = useState<{[key: number]: boolean}>({});
  const [expandedPermissions, setExpandedPermissions] = useState<{[key: number]: boolean}>({});
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    email: '',
    role: 'مشرف' as 'مدير عام' | 'مبرمج' | 'مشرف',
  });
  const { toast } = useToast();

  const currentUser = AuthService.getCurrentUser();

  const defaultPermissions = [
    'overview', 'tools', 'customerSupport', 'preview'
  ];

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

  const handleAddUser = async () => {
    if (!AuthService.hasPermission('مبرمج')) {
      toast({
        title: "خطأ في الصلاحية",
        description: "ليس لديك صلاحية لإضافة مستخدمين جدد",
        variant: "destructive"
      });
      return;
    }

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

    try {
      const newUserData = {
        username: newUser.username,
        password: newUser.password,
        role: newUser.role,
        name: newUser.username,
        email: newUser.email || `${newUser.username}@example.com`,
        isActive: true,
        permissions: defaultPermissions
      };

      await addUser(newUserData);
      
      setNewUser({ 
        username: '', 
        password: '', 
        email: '',
        role: 'مشرف'
      });

      toast({
        title: "تم إضافة المستخدم",
        description: "تم إضافة المستخدم الجديد بنجاح",
        variant: "default"
      });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleUserChange = (userId: number, field: string, value: any) => {
    if (!AuthService.hasPermission('مبرمج')) {
      toast({
        title: "خطأ في الصلاحية",
        description: "ليس لديك صلاحية لتعديل المستخدمين",
        variant: "destructive"
      });
      return;
    }

    setEditedUsers(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value
      }
    }));
  };

  const saveUser = async (userId: number) => {
    if (!AuthService.hasPermission('مبرمج')) {
      toast({
        title: "خطأ في الصلاحية",
        description: "ليس لديك صلاحية لحفظ التعديلات",
        variant: "destructive"
      });
      return;
    }

    const changes = editedUsers[userId];
    if (changes) {
      try {
        await updateUser(userId, changes);
        setEditedUsers(prev => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });

        toast({
          title: "تم حفظ التعديلات",
          description: "تم حفظ تعديلات المستخدم بنجاح",
          variant: "default"
        });
      } catch (error) {
        console.error('Error saving user:', error);
      }
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!AuthService.hasPermission('مدير عام')) {
      toast({
        title: "خطأ في الصلاحية",
        description: "ليس لديك صلاحية لحذف المستخدمين",
        variant: "destructive"
      });
      return;
    }

    const userToDelete = users.find(u => u.id === id);
    if (userToDelete?.username === 'dark') {
      toast({
        title: "لا يمكن الحذف",
        description: "لا يمكن حذف مالك الخادم",
        variant: "destructive"
      });
      return;
    }

    try {
      await deleteUser(id);
      toast({
        title: "تم حذف المستخدم",
        description: "تم حذف المستخدم بنجاح",
        variant: "default"
      });
    } catch (error) {
      console.error('Error deleting user:', error);
    }
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

  const isOwner = (username: string) => username === 'dark';

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            إدارة كلمات المرور والأذونات
          </h2>
          <p className="text-gray-400">تحكم كامل في المستخدمين وصلاحياتهم</p>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">جاري تحميل المستخدمين...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          إدارة كلمات المرور والأذونات
        </h2>
        <p className="text-gray-400">تحكم كامل في المستخدمين وصلاحياتهم</p>
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg max-w-2xl mx-auto">
          <p className="text-blue-300 text-sm">
            📊 جميع التعديلات محفوظة في قاعدة البيانات ومشتركة بين جميع المستخدمين
          </p>
        </div>
      </div>
      
      {/* Add New User */}
      {AuthService.hasPermission('مبرمج') && (
        <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
            إضافة مستخدم جديد
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  disabled={isSaving}
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
                  disabled={isSaving}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-blue-300 text-sm font-semibold">البريد الإلكتروني</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                placeholder="admin@example.com"
                disabled={isSaving}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-blue-300 text-sm font-semibold">الدور</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value as 'مدير عام' | 'مبرمج' | 'مشرف'})}
                className="w-full bg-black/20 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                disabled={isSaving}
              >
                <option value="مشرف" className="bg-gray-800 text-white">مشرف</option>
                <option value="مبرمج" className="bg-gray-800 text-white">مبرمج</option>
                <option value="مدير عام" className="bg-gray-800 text-white">مدير عام</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleAddUser}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  إضافة المستخدم
                </>
              )}
            </button>
          </div>
        </div>
      )}

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
                    {isOwner(user.username) ? (
                      <Lock className="w-6 h-6 text-white" />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-bold text-lg">{user.username}</h4>
                      {isOwner(user.username) && (
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">مالك الخادم</span>
                      )}
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(getUserValue(user, 'role'))}`}>
                      {getUserValue(user, 'role')}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {hasChanges(user.id) && AuthService.hasPermission('مبرمج') && (
                    <button
                      onClick={() => saveUser(user.id)}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm font-semibold disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      حفظ التغييرات
                    </button>
                  )}
                  {AuthService.hasPermission('مدير عام') && !isOwner(user.username) && (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white p-2 rounded-lg transition-all duration-300 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
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
                    disabled={isSaving || !AuthService.hasPermission('مبرمج') || isOwner(user.username)}
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
                      disabled={isSaving || !AuthService.hasPermission('مبرمج')}
                    />
                    <button
                      type="button"
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
                    disabled={isSaving || !AuthService.hasPermission('مدير عام') || isOwner(user.username)}
                  >
                    <option value="مشرف" className="bg-gray-800 text-white">مشرف</option>
                    <option value="مبرمج" className="bg-gray-800 text-white">مبرمج</option>
                    <option value="مدير عام" className="bg-gray-800 text-white">مدير عام</option>
                  </select>
                </div>
              </div>

              {/* User Info */}
              <div className="border-t border-white/10 pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                  <div>
                    <span className="text-blue-300">معرف المستخدم:</span>
                    <p className="text-white">#{user.id}</p>
                  </div>
                  <div>
                    <span className="text-blue-300">تاريخ الإنشاء:</span>
                    <p className="text-white">{new Date(user.createdAt).toLocaleDateString('ar')}</p>
                  </div>
                  <div>
                    <span className="text-blue-300">آخر تسجيل دخول:</span>
                    <p className="text-white">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('ar') : 'لم يسجل دخول'}
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-300">الحالة:</span>
                    <p className={`${user.isActive ? 'text-green-400' : 'text-red-400'}`}>
                      {user.isActive ? 'نشط' : 'معطل'}
                    </p>
                  </div>
                </div>
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
