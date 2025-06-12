
import React from 'react';
import { Wrench, Download, Settings, Code, Shield, Zap } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Tools = () => {
  const tools = [
    {
      id: 1,
      name: "أداة التحقق من الأمان",
      description: "فحص شامل لأمان النظام والتأكد من عدم وجود تهديدات",
      icon: Shield,
      category: "أمان",
      color: "bg-green-500/20 border-green-500/30"
    },
    {
      id: 2,
      name: "مولد كلمات المرور",
      description: "إنشاء كلمات مرور قوية وآمنة",
      icon: Zap,
      category: "أمان",
      color: "bg-yellow-500/20 border-yellow-500/30"
    },
    {
      id: 3,
      name: "أدوات التطوير",
      description: "مجموعة من الأدوات المفيدة للمطورين",
      icon: Code,
      category: "برمجة",
      color: "bg-blue-500/20 border-blue-500/30"
    },
    {
      id: 4,
      name: "إعدادات النظام",
      description: "تخصيص وإعداد النظام حسب احتياجاتك",
      icon: Settings,
      category: "نظام",
      color: "bg-purple-500/20 border-purple-500/30"
    },
    {
      id: 5,
      name: "أداة التحميل",
      description: "تحميل الملفات والأدوات بسرعة وأمان",
      icon: Download,
      category: "تحميل",
      color: "bg-cyan-500/20 border-cyan-500/30"
    },
    {
      id: 6,
      name: "أدوات الصيانة",
      description: "صيانة وتنظيف النظام لأداء أفضل",
      icon: Wrench,
      category: "صيانة",
      color: "bg-orange-500/20 border-orange-500/30"
    }
  ];

  const categories = [...new Set(tools.map(tool => tool.category))];

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      <div className="relative z-10">
        {/* Header Section */}
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Wrench className="w-16 h-16 text-blue-400 mr-4" />
              <h1 className="text-5xl font-bold text-white">
                صندوق الأدوات
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              مجموعة شاملة من الأدوات المتقدمة والمفيدة لتلبية جميع احتياجاتك التقنية
            </p>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              جميع الأدوات
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card
                  key={tool.id}
                  className={`${tool.color} backdrop-blur-sm border transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="p-3 bg-white/10 rounded-lg">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">
                          {tool.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
                          <span className="text-xs px-2 py-1 bg-white/20 rounded-full text-white">
                            {tool.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-200 mb-4">
                      {tool.description}
                    </CardDescription>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        استخدام الأداة
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        تفاصيل
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Card className="bg-white/10 backdrop-blur-sm border-white/30">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  هل تحتاج أداة مخصصة؟
                </h3>
                <p className="text-gray-300 mb-6">
                  نحن نقوم بتطوير أدوات مخصصة حسب احتياجاتك الخاصة
                </p>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3">
                  تواصل معنا لطلب أداة مخصصة
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
