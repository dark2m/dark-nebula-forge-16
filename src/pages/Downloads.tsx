
import React, { useState, useEffect } from 'react';
import { Search, Download, Star, Filter, Package, TrendingUp, Award, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StarryBackground from '../components/StarryBackground';
import DownloadService from '../utils/downloadService';
import AdminStorage from '../utils/adminStorage';
import type { DownloadItem } from '../types/downloads';

const Downloads = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [filteredDownloads, setFilteredDownloads] = useState<DownloadItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  
  const siteSettings = AdminStorage.getSiteSettings();
  
  // كلمة المرور الافتراضية إذا لم تكن محددة في الإعدادات
  const downloadsPassword = siteSettings?.downloadsPassword || 'dark123';

  // النصوص الافتراضية
  const defaultTexts = {
    title: 'مركز التنزيلات',
    subtitle: 'احصل على أفضل الأدوات والبرامج المتخصصة مجاناً',
    categories: {
      all: 'الكل',
      games: 'ألعاب',
      tools: 'أدوات',
      design: 'تصميم',
      programming: 'برمجة',
      music: 'موسيقى',
      video: 'فيديو',
      books: 'كتب',
      security: 'أمان'
    },
    buttons: {
      download: 'تنزيل',
      filter: 'تصفية',
      login: 'دخول'
    },
    labels: {
      size: 'الحجم',
      downloads: 'التنزيلات',
      rating: 'التقييم',
      version: 'الإصدار',
      password: 'كلمة المرور'
    },
    stats: {
      totalDownloads: 'إجمالي التنزيلات',
      availableFiles: 'ملفات متاحة',
      averageRating: 'متوسط التقييم'
    },
    placeholders: {
      search: 'البحث في التنزيلات...',
      noResults: 'لا توجد نتائج',
      password: 'أدخل كلمة المرور'
    },
    messages: {
      loginRequired: 'يجب إدخال كلمة المرور للوصول للتنزيلات',
      wrongPassword: 'كلمة مرور خاطئة'
    }
  };

  const texts = siteSettings?.pageTexts?.downloads || defaultTexts;

  useEffect(() => {
    // التحقق من حالة تسجيل الدخول المحفوظة
    const savedAuth = localStorage.getItem('downloadsAuth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
    loadDownloads();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      filterDownloads();
    }
  }, [downloads, searchTerm, selectedCategory, isAuthenticated]);

  const loadDownloads = async () => {
    try {
      const data = DownloadService.getDownloads();
      setDownloads(data);
    } catch (error) {
      console.error('Error loading downloads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterDownloads = () => {
    let filtered = downloads;

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
    if (passwordInput === downloadsPassword) {
      setIsAuthenticated(true);
      setError('');
      localStorage.setItem('downloadsAuth', 'true');
    } else {
      setError(texts?.messages?.wrongPassword || 'كلمة مرور خاطئة');
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

  const totalDownloads = downloads.reduce((sum, item) => sum + item.downloads, 0);
  const averageRating = downloads.length > 0 
    ? (downloads.reduce((sum, item) => sum + item.rating, 0) / downloads.length).toFixed(1)
    : '0';

  // صفحة تسجيل الدخول
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative">
        <StarryBackground />
        
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md mx-auto bg-white/5 border-white/20">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-blue-400" />
              </div>
              <CardTitle className="text-2xl text-white">
                {texts?.title || 'مركز التنزيلات'}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {texts?.messages?.loginRequired || 'يجب إدخال كلمة المرور للوصول للتنزيلات'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {texts?.labels?.password || 'كلمة المرور'}
                </label>
                <Input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder={texts?.placeholders?.password || 'أدخل كلمة المرور'}
                  className="bg-white/5 border-white/20 text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
              
              {error && (
                <div className="text-red-400 text-sm text-center">
                  {error}
                </div>
              )}
              
              <Button
                onClick={handleLogin}
                className="w-full glow-button"
                disabled={!passwordInput}
              >
                {texts?.buttons?.login || 'دخول'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      <div className="relative z-10 pt-20 pb-12">
        <div className="container mx-auto px-6">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-4">
              {texts?.title || 'مركز التنزيلات'}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {texts?.subtitle || 'احصل على أفضل الأدوات والبرامج المتخصصة مجاناً'}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/5 border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{texts?.stats?.totalDownloads || 'إجمالي التنزيلات'}</p>
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
                    <p className="text-gray-400 text-sm">{texts?.stats?.availableFiles || 'ملفات متاحة'}</p>
                    <p className="text-2xl font-bold text-white">{downloads.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{texts?.stats?.averageRating || 'متوسط التقييم'}</p>
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
                placeholder={texts?.placeholders?.search || 'البحث في التنزيلات...'}
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
                <SelectItem value="all">{texts?.categories?.all || 'الكل'}</SelectItem>
                <SelectItem value="games">{texts?.categories?.games || 'ألعاب'}</SelectItem>
                <SelectItem value="tools">{texts?.categories?.tools || 'أدوات'}</SelectItem>
                <SelectItem value="design">{texts?.categories?.design || 'تصميم'}</SelectItem>
                <SelectItem value="programming">{texts?.categories?.programming || 'برمجة'}</SelectItem>
                <SelectItem value="music">{texts?.categories?.music || 'موسيقى'}</SelectItem>
                <SelectItem value="video">{texts?.categories?.video || 'فيديو'}</SelectItem>
                <SelectItem value="books">{texts?.categories?.books || 'كتب'}</SelectItem>
                <SelectItem value="security">{texts?.categories?.security || 'أمان'}</SelectItem>
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
                  {texts?.placeholders?.noResults || 'لا توجد نتائج'}
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
                        {texts?.categories?.[item.category as keyof typeof texts.categories] || item.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 pt-0">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">{texts?.labels?.size || 'الحجم'}:</span>
                        <span className="text-white">{item.size}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">{texts?.labels?.downloads || 'التنزيلات'}:</span>
                        <span className="text-white">{item.downloads.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">{texts?.labels?.rating || 'التقييم'}:</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white ml-1">{item.rating}/5</span>
                        </div>
                      </div>
                      
                      {item.version && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">{texts?.labels?.version || 'الإصدار'}:</span>
                          <span className="text-white">{item.version}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      onClick={() => handleDownload(item)}
                      className="w-full glow-button group-hover:scale-105 transition-transform"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {texts?.buttons?.download || 'تنزيل'}
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
