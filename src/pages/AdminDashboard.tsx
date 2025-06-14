
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Package, Users, Settings, FileText, Key, Type, Eye, LogOut, BarChart3, HardDrive } from 'lucide-react';
import OverviewTab from '../components/admin/OverviewTab';
import ProductsTab from '../components/admin/ProductsTab';
import UsersTab from '../components/admin/UsersTab';
import SettingsTab from '../components/admin/SettingsTab';
import TextsTab from '../components/admin/TextsTab';
import PasswordsTab from '../components/admin/PasswordsTab';
import TypographyTab from '../components/admin/TypographyTab';
import SiteControlTab from '../components/admin/SiteControlTab';
import BackupTab from '../components/admin/BackupTab';
import { SettingsService } from '../utils/settingsService';
import { AuthService } from '../utils/authService';
import { useSiteData } from '../hooks/useSiteData';
import { useToast } from '@/hooks/use-toast';
import type { SiteSettings } from '../types/admin';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(SettingsService.getSiteSettings());
  const { products } = useSiteData();

  // Check authentication
  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  // Load and subscribe to settings
  useEffect(() => {
    const loadedSettings = SettingsService.getSiteSettings();
    setSiteSettings(loadedSettings);

    const unsubscribe = SettingsService.subscribe((newSettings) => {
      setSiteSettings(newSettings);
    });

    return unsubscribe;
  }, []);

  const saveSiteSettings = async () => {
    try {
      await SettingsService.updateSiteSettings(siteSettings);
      toast({
        title: "تم حفظ الإعدادات",
        description: "تم حفظ إعدادات الموقع بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/admin/login');
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل الخروج بنجاح"
    });
  };

  const currentUser = AuthService.getCurrentUser();
  
  const canAccess = (requiredRole: 'مدير عام' | 'مبرمج' | 'مشرف') => {
    if (!currentUser) return false;
    const roleHierarchy = { 'مدير عام': 3, 'مبرمج': 2, 'مشرف': 1 };
    return roleHierarchy[currentUser.role] >= roleHierarchy[requiredRole];
  };

  const tabs = [
    { id: 'overview', name: 'نظرة عامة', icon: BarChart3, role: 'مشرف' as const },
    { id: 'products', name: 'المنتجات', icon: Package, role: 'مبرمج' as const },
    { id: 'users', name: 'المستخدمين', icon: Users, role: 'مدير عام' as const },
    { id: 'settings', name: 'الإعدادات', icon: Settings, role: 'مبرمج' as const },
    { id: 'texts', name: 'النصوص', icon: FileText, role: 'مبرمج' as const },
    { id: 'passwords', name: 'كلمات المرور', icon: Key, role: 'مدير عام' as const },
    { id: 'typography', name: 'التحكم في النصوص', icon: Type, role: 'مبرمج' as const },
    { id: 'sitecontrol', name: 'تحكم شامل', icon: Eye, role: 'مدير عام' as const },
    { id: 'backup', name: 'النسخ الاحتياطية', icon: HardDrive, role: 'مدير عام' as const }
  ];

  const visibleTabs = tabs.filter(tab => canAccess(tab.role));

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab products={products} />;
      case 'products':
        return <ProductsTab canAccess={canAccess} />;
      case 'users':
        return <UsersTab />;
      case 'settings':
        return <SettingsTab />;
      case 'texts':
        return (
          <TextsTab
            siteSettings={siteSettings}
            setSiteSettings={setSiteSettings}
            saveSiteSettings={saveSiteSettings}
          />
        );
      case 'passwords':
        return <PasswordsTab />;
      case 'typography':
        return <TypographyTab />;
      case 'sitecontrol':
        return (
          <SiteControlTab
            siteSettings={siteSettings}
            setSiteSettings={setSiteSettings}
            saveSiteSettings={saveSiteSettings}
          />
        );
      case 'backup':
        return <BackupTab />;
      default:
        return <OverviewTab products={products} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-black/50 backdrop-blur-sm min-h-screen border-r border-white/10">
          <div className="p-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-8">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold">لوحة التحكم</h1>
                <p className="text-gray-400 text-sm">{currentUser?.role}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {visibleTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 pt-8 border-t border-white/10">
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>العودة للموقع</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
