
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  Settings, 
  BarChart3, 
  FileText, 
  Shield, 
  Palette, 
  Type, 
  Globe,
  MessageSquare,
  Archive,
  Eye,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home
} from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTabContent from '../components/admin/AdminTabContent';
import StarryBackground from '../components/StarryBackground';
import { useAuth } from '@/contexts/AuthContext';
import { AdminUser } from '../types/admin';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType;
  roles?: string[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Navigation items configuration
  const navigationItems: NavigationItem[] = [
    { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
    { id: 'users', label: 'المستخدمين', icon: Users, roles: ['مدير عام'] },
    { id: 'products', label: 'المنتجات', icon: Shield },
    { id: 'texts', label: 'النصوص', icon: FileText },
    { id: 'navigation', label: 'التنقل', icon: Globe },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
    { id: 'design', label: 'التصميم', icon: Palette },
    { id: 'typography', label: 'الخطوط', icon: Type },
    { id: 'background', label: 'الخلفية', icon: Globe },
    { id: 'customer-support', label: 'خدمة العملاء', icon: MessageSquare },
    { id: 'tools', label: 'الأدوات', icon: Settings },
    { id: 'backup', label: 'النسخ الاحتياطي', icon: Archive },
    { id: 'live-preview', label: 'المعاينة المباشرة', icon: Eye }
  ];

  // Get current admin user info
  const getCurrentAdmin = (): AdminUser => {
    const adminData = localStorage.getItem('adminUser');
    if (adminData) {
      const admin = JSON.parse(adminData);
      return {
        id: admin.id || 1,
        username: admin.username || 'admin',
        role: admin.role || 'مشرف',
        password: '' // Don't store password in state
      };
    }
    return {
      id: 1,
      username: 'admin',
      role: 'مشرف',
      password: ''
    };
  };

  const [currentAdmin] = useState<AdminUser>(getCurrentAdmin());

  // Check access permissions
  const canAccess = (requiredRoles: string[] = []) => {
    if (requiredRoles.length === 0) return true;
    return requiredRoles.includes(currentAdmin.role);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Set active tab from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);

  // Update URL when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    navigate(`/admin/dashboard?tab=${tabId}`, { replace: true });
    setIsSidebarOpen(false);
  };

  // Filter navigation items based on permissions
  const visibleNavigationItems = navigationItems.filter(item => 
    !item.roles || canAccess(item.roles)
  );

  return (
    <div className="min-h-screen bg-gray-900 relative">
      <StarryBackground />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden text-white hover:text-blue-400 transition-colors"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Link to="/" className="text-white hover:text-blue-400 transition-colors">
              <Home className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-bold text-white">لوحة التحكم الإدارية</h1>
          </div>

          {/* Profile menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-3 rtl:space-x-reverse text-white hover:text-blue-400 transition-colors"
            >
              <div className="text-right">
                <p className="text-sm font-medium">{currentAdmin.username}</p>
                <p className="text-xs text-gray-400">{currentAdmin.role}</p>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-white/10 py-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <AdminSidebar
          navigationItems={visibleNavigationItems}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main content */}
        <main className="flex-1 lg:ml-64 p-6">
          <div className="relative z-10">
            <AdminTabContent
              activeTab={activeTab}
              canAccess={(role) => canAccess([role])}
            />
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
