import React, { useState, useEffect } from 'react';
import { Search, Download, Star, Filter, Package, TrendingUp, Award, Lock, MessageCircle, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StarryBackground from '../components/StarryBackground';
import DownloadService from '../utils/downloadService';
import DownloadCategoriesService from '../utils/downloadCategoriesService';
import AdminStorage from '../utils/adminStorage';
import type { DownloadItem } from '../types/downloads';
import type { DownloadsPageTexts } from '../types/admin';
import DownloadPasswordService from '../utils/downloadPasswordService';

const Downloads = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [filteredDownloads, setFilteredDownloads] = useState<DownloadItem[]>([]);
  const [categories] = useState<string[]>(DownloadCategoriesService.getCategories());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [userPasswordData, setUserPasswordData] = useState<any>(null);
  
  const siteSettings = AdminStorage.getSiteSettings();
  
  // كلمة المرور الافتراضية إذا لم تكن محددة في الإعدادات
  const downloadsPassword = siteSettings?.downloadsPassword || 'dark123';

  // النصوص الافتراضية المحدثة
  const defaultTexts: DownloadsPageTexts = {
    loginPage: {
      title: 'المشتركين فقط',
      subtitle: 'تواصل مع خدمة العملاء للحصول على رمز الدخول',
      passwordLabel: 'رمز الدخول',
      passwordPlaceholder: 'أدخل رمز الدخول',
      loginButton: 'دخول',
      contactSupport: 'تواصل مع خدمة العملاء',
      errorMessage: 'رمز دخول خاطئ'
    },
    mainPage: {
      title: 'مركز التنزيلات',
      subtitle: 'احصل على أفضل الأدوات والبرامج المتخصصة',
      categories: {
        all: 'الكل'
      },
      buttons: {
        download: 'تنزيل',
        filter: 'تصفية'
      },
      labels: {
        size: 'الحجم',
        downloads: 'التنزيلات',
        rating: 'التقييم',
        version: 'الإصدار'
      },
      stats: {
        totalDownloads: 'إجمالي التنزيلات',
        availableFiles: 'ملفات متاحة',
        averageRating: 'متوسط التقييم'
      },
      placeholders: {
        search: 'البحث في التنزيلات...',
        noResults: 'لا توجد نتائج'
      }
    }
  };

  // التأكد من وجود النصوص مع fallback آمن
  const texts = siteSettings?.pageTexts?.downloads || defaultTexts;
  
  // التأكد من وجود loginPage و mainPage مع fallbacks آمنة
  const loginPageTexts = texts.loginPage || defaultTexts.loginPage;
  const mainPageTexts = texts.mainPage || defaultTexts.mainPage;
  
  // التأكد من وجود stats مع fallback آمن
  const statsTexts = mainPageTexts.stats || defaultTexts.mainPage.stats;

  useEffect(() => {
    // التحقق من حالة تسجيل الدخول المحفوظة
    const savedAuth = localStorage.getItem('downloadsAuth');
    const savedPasswordData = localStorage.getItem('downloadsPasswordData');
    
    if (savedAuth === 'true' && savedPasswordData) {
      setIsAuthenticated(true);
      setUserPasswordData(JSON.parse(savedPasswordData));
    }
    loadDownloads();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      filterDownloads();
    }
  }, [downloads, searchTerm, selectedCategory, isAuthenticated, userPasswordData]);

  const loadDownloads = async () => {
    try {
      const data = DownloadService.getDownloads();
      setDownloads(data);
    } catch (error) {
      console.error('Error loading downloads:', error);
      setDownloads([]); // تأكد من أن downloads هو مصفوفة فارغة في حالة الخطأ
    } finally {
      setIsLoading(false);
    }
  };

  const filterDownloads = () => {
    let filtered = downloads || [];

    // فلترة حسب الفئات المسموحة لكلمة المرور
    if (userPasswordData && userPasswordData.allowedCategories && userPasswordData.allowedCategories.length > 0) {
      console.log('Filtering by password categories:', userPasswordData.allowedCategories);
      filtered = filtered.filter(item => 
        userPasswordData.allowedCategories.includes(item.category)
      );
      console.log('Filtered downloads:', filtered);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDownloads(filtered);
  };

  const handleLogin = () => {
    const passwordData = DownloadPasswordService.validatePassword(passwordInput);
    
    if (passwordData) {
      console.log('Login successful with password data:', passwordData);
      setIsAuthenticated(true);
      setUserPasswordData(passwordData);
      setError('');
      localStorage.setItem('downloadsAuth', 'true');
      localStorage.setItem('downloadsPasswordData', JSON.stringify(passwordData));
    } else {
      setError(loginPageTexts.errorMessage);
    }
  };

  const handleContactSupport = () => {
    const contactInfo = siteSettings?.contactInfo;
    if (contactInfo?.discord) {
      window.open(`https://discord.com/users/${contactInfo.discord}`, '_blank');
    } else if (contactInfo?.telegram) {
      window.open(`https://t.me/${contactInfo.telegram.replace('@', '')}`, '_blank');
    }
  };

  const handleDownload = (item: DownloadItem) => {
    const updatedDownloads = downloads.map(download =>
      download.id === item.id
        ? { ...download, downloads: download.downloads + 1 }
        : download
    );
    setDownloads(updatedDownloads);
    DownloadService.saveDownloads(updatedDownloads);

    // إنشاء رابط التنزيل
    const link = document.createElement('a');
    link.href = item.downloadUrl || '#';
    link.download = item.filename || item.title;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // حسابات آمنة للإحصائيات مع التحقق من وجود البيانات
  const totalDownloads = Array.isArray(downloads) && downloads.length > 0 
    ? downloads.reduce((sum, item) => sum + (item.downloads || 0), 0) 
    : 0;
    
  const averageRating = Array.isArray(downloads) && downloads.length > 0 
    ? (downloads.reduce((sum, item) => sum + (item.rating || 0), 0) / downloads.length).toFixed(1)
    : '0';

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <StarryBackground />
        
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 z-[1]">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 z-[1]">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                transform: `scale(${0.5 + Math.random() * 0.5})`
              }}
            ></div>
          ))}
        </div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
              <CardHeader className="text-center pb-6">
                {/* Enhanced Icon Section */}
                <div className="relative mx-auto w-20 h-20 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-60 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-4 border border-white/20">
                    <Users className="w-12 h-12 text-white" />
                    <Shield className="absolute -top-1 -right-1 w-6 h-6 text-yellow-400 animate-bounce" />
                  </div>
                </div>
                
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-3">
                  {loginPageTexts.title}
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg leading-relaxed">
                  {loginPageTexts.subtitle}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Enhanced Password Input */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-300 mb-3 group-focus-within:text-blue-300 transition-colors duration-300">
                    {loginPageTexts.passwordLabel}
                  </label>
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-30 transition-opacity duration-300 blur-sm"></div>
                    <div className="relative flex items-center">
                      <Lock className="absolute right-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300" />
                      <Input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder={loginPageTexts.passwordPlaceholder}
                        className="bg-white/5 border-white/20 text-white placeholder-gray-400 pr-12 py-4 rounded-xl focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300"
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                      />
                    </div>
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <div className="text-red-400 text-sm text-center flex items-center justify-center">
                      <Shield className="w-4 h-4 mr-2" />
                      {error}
                    </div>
                  </div>
                )}
                
                {/* Enhanced Login Button */}
                <Button
                  onClick={handleLogin}
                  className="w-full relative group overflow-hidden py-4 rounded-xl"
                  disabled={!passwordInput}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white font-bold text-lg transition-all duration-300 group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-cyan-500 py-1 px-6 rounded-xl">
                    <Lock className="w-5 h-5 mr-2 inline" />
                    {loginPageTexts.loginButton}
                  </div>
                </Button>
                
                {/* Contact Support Button */}
                <Button
                  onClick={handleContactSupport}
                  variant="outline"
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 py-4 rounded-xl transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {loginPageTexts.contactSupport}
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Footer */}
            <div className="text-center mt-6">
              <div className="relative inline-block">
                <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg blur-lg animate-pulse"></div>
                <p className="relative text-gray-400/80 text-sm bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                  🔒 محتوى حصري للمشتركين فقط
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      <div className="relative z-10 pt-20 pb-12">
        <div className="container mx-auto px-6">
          
          {/* Header with password info */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-4">
              {mainPageTexts.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
              {mainPageTexts.subtitle}
            </p>
            
            {/* Display current access level */}
            {userPasswordData && (
              <div className="flex justify-center">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2 text-green-300">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">
                      وصول لـ: {userPasswordData.allowedCategories?.join(', ') || 'جميع الفئات'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/5 border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{statsTexts.totalDownloads}</p>
                    <p className="text-2xl font-bold text-white">{totalDownloads.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{statsTexts.availableFiles}</p>
                    <p className="text-2xl font-bold text-white">{downloads.length || 0}</p>
                  </div>
                  <Package className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{statsTexts.averageRating}</p>
                    <p className="text-2xl font-bold text-white">{averageRating}/5</p>
                  </div>
                  <Award className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder={mainPageTexts.placeholders?.search || 'البحث في التنزيلات...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="md:w-48 bg-white/5 border-white/20 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-white/20">
                <SelectItem value="all">{mainPageTexts.categories?.all || 'الكل'}</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Downloads Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-white/5 border-white/20 animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-white/10 rounded mb-4"></div>
                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                    <div className="h-4 bg-white/10 rounded mb-4"></div>
                    <div className="h-10 bg-white/10 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredDownloads.length === 0 ? (
            <Card className="bg-white/5 border-white/20">
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {mainPageTexts.placeholders?.noResults || 'لا توجد نتائج'}
                </h3>
                <p className="text-gray-400">جرب تغيير مصطلحات البحث أو الفئة</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDownloads.map((item) => (
                <Card key={item.id} className="bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white group-hover:text-blue-300 transition-colors">
                          {item.title}
                        </CardTitle>
                        <CardDescription className="text-gray-400 mt-2">
                          {item.description}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {item.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 pt-0">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">{mainPageTexts.labels?.size || 'الحجم'}:</span>
                        <span className="text-white">{item.size}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">{mainPageTexts.labels?.downloads || 'التنزيلات'}:</span>
                        <span className="text-white">{(item.downloads || 0).toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">{mainPageTexts.labels?.rating || 'التقييم'}:</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white ml-1">{item.rating || 0}/5</span>
                        </div>
                      </div>
                      
                      {item.version && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">{mainPageTexts.labels?.version || 'الإصدار'}:</span>
                          <span className="text-white">{item.version}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      onClick={() => handleDownload(item)}
                      className="w-full glow-button group-hover:scale-105 transition-transform"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {mainPageTexts.buttons?.download || 'تنزيل'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Downloads;
