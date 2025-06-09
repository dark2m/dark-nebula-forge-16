
import React from 'react';
import { Code, Smartphone, Globe, Zap } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';

const WebDevelopment = () => {
  const services = [
    {
      id: 1,
      name: 'تطوير مواقع ووردبريس',
      price: '150$',
      description: 'مواقع ووردبريس احترافية مع تصميم مخصص',
      features: ['تصميم مخصص', 'SEO محسن', 'سرعة عالية', 'لوحة تحكم سهلة'],
      icon: Globe
    },
    {
      id: 2,
      name: 'تطبيقات الويب',
      price: '300$',
      description: 'تطبيقات ويب تفاعلية مع React و Node.js',
      features: ['React.js', 'قاعدة بيانات', 'API مخصص', 'لوحة إدارة'],
      icon: Code
    },
    {
      id: 3,
      name: 'مواقع متجاوبة',
      price: '200$',
      description: 'مواقع تعمل بشكل مثالي على جميع الأجهزة',
      features: ['تصميم متجاوب', 'تحسين الأداء', 'UX/UI متقدم', 'دعم جميع المتصفحات'],
      icon: Smartphone
    }
  ];

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      <div className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-center text-white mb-4">
            برمجة مواقع الويب
          </h1>
          <p className="text-xl text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            نطور لك مواقع احترافية عصرية بأحدث التقنيات وأفضل الممارسات
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.id} className="product-card rounded-xl p-6">
                  <div className="text-center mb-6">
                    <div className="inline-flex p-3 rounded-full bg-blue-500/20 mb-4">
                      <Icon className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{service.name}</h3>
                    <p className="text-gray-300 mb-4">{service.description}</p>
                    <div className="text-3xl font-bold text-blue-400 mb-6">{service.price}</div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full glow-button">
                    اطلب الخدمة
                  </button>
                </div>
              );
            })}
          </div>

          {/* Technologies Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-white mb-8">
              التقنيات التي نستخدمها
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['React.js', 'Node.js', 'MongoDB', 'WordPress', 'PHP', 'MySQL', 'JavaScript', 'CSS3'].map((tech) => (
                <div key={tech} className="bg-white/10 rounded-lg p-4 text-center">
                  <span className="text-white font-semibold">{tech}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Process Section */}
          <div className="mt-16 bg-blue-500/10 border border-blue-500/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-blue-400 text-center mb-8">
              عملية التطوير
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">1</div>
                <h4 className="text-white font-semibold mb-2">التخطيط</h4>
                <p className="text-gray-300 text-sm">دراسة المتطلبات والتخطيط للمشروع</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">2</div>
                <h4 className="text-white font-semibold mb-2">التصميم</h4>
                <p className="text-gray-300 text-sm">تصميم واجهات المستخدم</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">3</div>
                <h4 className="text-white font-semibold mb-2">التطوير</h4>
                <p className="text-gray-300 text-sm">برمجة الموقع وتطويره</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">4</div>
                <h4 className="text-white font-semibold mb-2">التسليم</h4>
                <p className="text-gray-300 text-sm">اختبار وتسليم المشروع</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebDevelopment;
