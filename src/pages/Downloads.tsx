import React, { useState, useEffect } from 'react';
import { Download, FileText, Package, Star, Clock, Shield, Wrench, Code, Users, Globe, Lock, Heart, Zap, Camera, Music, Video, Book, Calendar, Mail, Phone, Search, Settings, Home } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import AdminStorage from '../utils/adminStorage';
import GlobalCart from '../components/GlobalCart';
import { getTextContent } from '../utils/textUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DownloadService from '../utils/downloadService';
import type { DownloadItem } from '../types/downloads';

const Downloads = () => {
  const [siteSettings, setSiteSettings] = useState(AdminStorage.getSiteSettings());
  const [downloadItems, setDownloadItems] = useState<DownloadItem[]>([]);

  useEffect(() => {
    const loadedSettings = AdminStorage.getSiteSettings();
    setSiteSettings(loadedSettings);

    // Load downloads from service
    const downloads = DownloadService.getDownloads();
    setDownloadItems(downloads);

    const handleSettingsUpdate = (event: CustomEvent) => {
      setSiteSettings(event.detail.settings);
    };

    const handleDownloadsUpdate = (event: CustomEvent) => {
      setDownloadItems(event.detail.downloads);
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    window.addEventListener('downloadsUpdated', handleDownloadsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
      window.removeEventListener('downloadsUpdated', handleDownloadsUpdate as EventListener);
    };
  }, []);

  const categories = [
    getTextContent(siteSettings.pageTexts.downloads?.categories?.all) || "الكل",
    getTextContent(siteSettings.pageTexts.downloads?.categories?.games) || "ألعاب",
    getTextContent(siteSettings.pageTexts.downloads?.categories?.tools) || "أدوات",
    getTextContent(siteSettings.pageTexts.downloads?.categories?.design) || "تصميم",
    getTextContent(siteSettings.pageTexts.downloads?.categories?.programming) || "برمجة",
    getTextContent(siteSettings.pageTexts.downloads?.categories?.music) || "موسيقى",
    getTextContent(siteSettings.pageTexts.downloads?.categories?.video) || "فيديو",
    getTextContent(siteSettings.pageTexts.downloads?.categories?.books) || "كتب",
    getTextContent(siteSettings.pageTexts.downloads?.categories?.security) || "أمان"
  ];

  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const filteredItems = selectedCategory === categories[0]
    ? downloadItems 
    : downloadItems.filter(item => {
        const categoryMapping = {
          [categories[1]]: "ألعاب",
          [categories[2]]: "أدوات", 
          [categories[3]]: "تصميم",
          [categories[4]]: "برمجة",
          [categories[5]]: "موسيقى",
          [categories[6]]: "فيديو",
          [categories[7]]: "كتب",
          [categories[8]]: "أمان"
        };
        return item.category === categoryMapping[selectedCategory];
      });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "جديد": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "محدث": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "شائع": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, any> = {
      'Download': Download,
      'Shield': Shield,
      'Package': Package,
      'FileText': FileText,
      'Star': Star,
      'Wrench': Wrench,
      'Code': Code,
      'Users': Users,
      'Globe': Globe,
      'Lock': Lock,
      'Heart': Heart,
      'Zap': Zap,
      'Camera': Camera,
      'Music': Music,
      'Video': Video,
      'Book': Book,
      'Calendar': Calendar,
      'Mail': Mail,
      'Phone': Phone,
      'Search': Search,
      'Settings': Settings,
      'Home': Home
    };
    return iconMap[iconName] || Download;
  };

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      <GlobalCart />
      
      {/* Header */}
      <div className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
              {getTextContent(siteSettings.pageTexts.downloads?.title) || "مركز التنزيلات"}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {getTextContent(siteSettings.pageTexts.downloads?.subtitle) || "احصل على أفضل الأدوات والبرامج المتخصصة مجاناً"}
            </p>
          </div>

          {/* Categories Filter */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-2 p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  onClick={() => setSelectedCategory(category)}
                  className={`${
                    selectedCategory === category 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Downloads Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const IconComponent = getIconComponent(item.icon);
              return (
                <Card key={item.id} className="bg-white/5 backdrop-blur-sm border-white/20 hover:bg-white/10 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <IconComponent className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{item.title}</CardTitle>
                          <CardDescription className="text-gray-400">
                            {item.category} • v{item.version}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(item.status)} border`}>
                        {item.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm">{item.description}</p>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-1">
                      {item.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-white/20 text-gray-300">
                          {feature}
                        </Badge>
                      ))}
                      {item.features.length > 3 && (
                        <Badge variant="outline" className="text-xs border-white/20 text-gray-300">
                          +{item.features.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          {item.downloads.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          {item.rating}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {item.lastUpdate}
                      </div>
                    </div>

                    {/* Download Info */}
                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                      <span className="text-sm text-gray-400">
                        {getTextContent(siteSettings.pageTexts.downloads?.labels?.size) || "الحجم"}: {item.size}
                      </span>
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                        <Download className="w-4 h-4 mr-2" />
                        {getTextContent(siteSettings.pageTexts.downloads?.buttons?.download) || "تنزيل"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {downloadItems.reduce((total, item) => total + item.downloads, 0).toLocaleString()}
              </div>
              <div className="text-gray-300">
                {getTextContent(siteSettings.pageTexts.downloads?.stats?.totalDownloads) || "إجمالي التنزيلات"}
              </div>
            </div>
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-3xl font-bold text-green-400 mb-2">{downloadItems.length}</div>
              <div className="text-gray-300">
                {getTextContent(siteSettings.pageTexts.downloads?.stats?.availableFiles) || "ملفات متاحة"}
              </div>
            </div>
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {downloadItems.length > 0 ? (downloadItems.reduce((total, item) => total + item.rating, 0) / downloadItems.length).toFixed(1) : '0'}
              </div>
              <div className="text-gray-300">
                {getTextContent(siteSettings.pageTexts.downloads?.stats?.averageRating) || "متوسط التقييم"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Downloads;
