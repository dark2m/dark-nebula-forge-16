
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Code, Bot, ArrowLeft } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';

const Home = () => {
  const services = [
    {
      title: 'هكر ببجي موبايل',
      description: 'أحدث الهاكات والأدوات لببجي موبايل',
      icon: Shield,
      path: '/pubg-hacks',
      gradient: 'from-red-500 to-pink-600'
    },
    {
      title: 'برمجة مواقع',
      description: 'تطوير مواقع احترافية ومتقدمة',
      icon: Code,
      path: '/web-development',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'برمجة بوتات ديسكورد',
      description: 'بوتات ديسكورد مخصصة ومتطورة',
      icon: Bot,
      path: '/discord-bots',
      gradient: 'from-purple-500 to-indigo-600'
    }
  ];

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
            مرحباً بك في DARK
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            نوفر لك أفضل الخدمات في مجال التقنية والبرمجة مع جودة عالية وأسعار منافسة
          </p>
          
          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Link
                  key={index}
                  to={service.path}
                  className="product-card rounded-xl p-8 text-center group"
                >
                  <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${service.gradient} mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 mb-6">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-center text-blue-400 group-hover:text-white transition-colors">
                    <span className="mr-2">استكشف الآن</span>
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-20 bg-black/30">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-12">
            لماذا تختار DARK؟
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="text-blue-400 text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-4">سرعة التسليم</h3>
              <p className="text-gray-300">نلتزم بتسليم جميع الطلبات في الوقت المحدد</p>
            </div>
            <div className="p-6">
              <div className="text-blue-400 text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-white mb-4">الأمان والحماية</h3>
              <p className="text-gray-300">جميع منتجاتنا آمنة ومحمية ضد الاكتشاف</p>
            </div>
            <div className="p-6">
              <div className="text-blue-400 text-4xl mb-4">💎</div>
              <h3 className="text-xl font-bold text-white mb-4">جودة عالية</h3>
              <p className="text-gray-300">نقدم أفضل جودة في السوق بأسعار منافسة</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
