
import React from 'react';
import { ShoppingCart, Star, Shield, Eye, Target } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';

const PubgHacks = () => {
  const products = [
    {
      id: 1,
      name: 'هكر ESP المتقدم',
      price: '25$',
      description: 'رؤية الأعداء من خلال الجدران مع معلومات مفصلة',
      features: ['ESP للاعبين', 'ESP للأسلحة', 'ESP للسيارات', 'آمن 100%'],
      rating: 5,
      icon: Eye
    },
    {
      id: 2,
      name: 'Aimbot Pro',
      price: '35$',
      description: 'تصويب تلقائي دقيق مع إعدادات متقدمة',
      features: ['تصويب تلقائي', 'تصويب ناعم', 'تخصيص المفاتيح', 'مكافحة الارتداد'],
      rating: 5,
      icon: Target
    },
    {
      id: 3,
      name: 'الحزمة الكاملة',
      price: '50$',
      description: 'جميع الهاكات في حزمة واحدة بسعر مخفض',
      features: ['ESP متقدم', 'Aimbot Pro', 'Speed Hack', 'دعم مدى الحياة'],
      rating: 5,
      icon: Shield,
      popular: true
    }
  ];

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      <div className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-center text-white mb-4">
            هكر ببجي موبايل
          </h1>
          <p className="text-xl text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            أحدث وأقوى الهاكات لببجي موبايل - آمنة وغير قابلة للاكتشاف
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => {
              const Icon = product.icon;
              return (
                <div
                  key={product.id}
                  className={`product-card rounded-xl p-6 relative ${
                    product.popular ? 'ring-2 ring-blue-400' : ''
                  }`}
                >
                  {product.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                        الأكثر مبيعاً
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <div className="inline-flex p-3 rounded-full bg-blue-500/20 mb-4">
                      <Icon className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                    <div className="flex items-center justify-center mb-2">
                      {[...Array(product.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4">{product.description}</p>
                    <div className="text-3xl font-bold text-blue-400 mb-6">{product.price}</div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full glow-button flex items-center justify-center space-x-2 rtl:space-x-reverse">
                    <ShoppingCart className="w-4 h-4" />
                    <span>اطلب الآن</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Security Notice */}
          <div className="mt-16 bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
            <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-400 mb-2">ضمان الأمان 100%</h3>
            <p className="text-gray-300">
              جميع هاكاتنا محدثة باستمرار ومحمية ضد أنظمة الكشف. نضمن لك اللعب بأمان تام.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PubgHacks;
