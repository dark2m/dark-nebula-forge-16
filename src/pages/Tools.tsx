
import React from 'react';
import StarryBackground from '../components/StarryBackground';

const Tools = () => {
  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              أدوات الموقع
            </h1>
            <p className="text-xl text-gray-300">
              مجموعة من الأدوات المفيدة للموقع
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-6 hover:bg-white/30 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-3">أداة 1</h3>
              <p className="text-gray-300 mb-4">وصف الأداة الأولى</p>
              <button className="glow-button w-full">
                استخدام الأداة
              </button>
            </div>

            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-6 hover:bg-white/30 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-3">أداة 2</h3>
              <p className="text-gray-300 mb-4">وصف الأداة الثانية</p>
              <button className="glow-button w-full">
                استخدام الأداة
              </button>
            </div>

            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-6 hover:bg-white/30 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-3">أداة 3</h3>
              <p className="text-gray-300 mb-4">وصف الأداة الثالثة</p>
              <button className="glow-button w-full">
                استخدام الأداة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
