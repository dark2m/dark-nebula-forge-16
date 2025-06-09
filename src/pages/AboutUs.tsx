
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Target, Award, Heart } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';

const AboutUs = () => {
  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      {/* Header */}
      <div className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 rtl:space-x-reverse text-blue-400 hover:text-blue-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </Link>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
              من نحن
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              نحن فريق DARK المتخصص في تقديم أفضل الحلول التقنية والبرمجية مع الالتزام بأعلى معايير الجودة والأمان
            </p>
          </div>

          {/* About Content */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="admin-card rounded-xl p-8">
              <div className="flex items-center mb-6">
                <Users className="w-8 h-8 text-blue-400 ml-3" />
                <h2 className="text-2xl font-bold text-white">فريقنا</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                يتكون فريق DARK من مجموعة من المطورين والمبرمجين المتخصصين في مختلف المجالات التقنية. 
                نحن نعمل بشغف لتقديم أفضل الخدمات لعملائنا مع الحفاظ على أعلى مستويات الأمان والحماية.
              </p>
            </div>

            <div className="admin-card rounded-xl p-8">
              <div className="flex items-center mb-6">
                <Target className="w-8 h-8 text-green-400 ml-3" />
                <h2 className="text-2xl font-bold text-white">رؤيتنا</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                نسعى لأن نكون الخيار الأول في مجال الحلول التقنية المتقدمة، ونهدف إلى توفير خدمات 
                مبتكرة تلبي احتياجات عملائنا وتتجاوز توقعاتهم في جميع أنحاء العالم العربي.
              </p>
            </div>
          </div>

          {/* Services */}
          <div className="admin-card rounded-xl p-8 mb-16">
            <div className="flex items-center mb-8">
              <Award className="w-8 h-8 text-yellow-400 ml-3" />
              <h2 className="text-3xl font-bold text-white">خدماتنا</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎮</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">هكر الألعاب</h3>
                <p className="text-gray-300">
                  نقدم أحدث أدوات التعديل والهاكات للألعاب المختلفة مع ضمان الأمان والحماية من الحظر
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💻</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">تطوير المواقع</h3>
                <p className="text-gray-300">
                  نصمم ونطور مواقع الويب الاحترافية باستخدام أحدث التقنيات والأدوات المتطورة
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">بوتات ديسكورد</h3>
                <p className="text-gray-300">
                  نطور بوتات ديسكورد مخصصة بميزات متقدمة لتحسين تجربة المستخدمين في الخوادم
                </p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="admin-card rounded-xl p-8">
            <div className="flex items-center mb-8">
              <Heart className="w-8 h-8 text-pink-400 ml-3" />
              <h2 className="text-3xl font-bold text-white">قيمنا</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-3">الجودة والإتقان</h3>
                <p className="text-gray-300">
                  نحرص على تقديم منتجات وخدمات عالية الجودة تلبي أعلى المعايير المهنية
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-green-400 mb-3">الأمان والحماية</h3>
                <p className="text-gray-300">
                  نضع أمان عملائنا وحماية بياناتهم في المقدمة، ونستخدم أحدث تقنيات الحماية
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-purple-400 mb-3">دعم العملاء</h3>
                <p className="text-gray-300">
                  نوفر دعماً تقنياً متميزاً على مدار الساعة لضمان رضا عملائنا الكامل
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">الابتكار والتطوير</h3>
                <p className="text-gray-300">
                  نسعى دائماً للابتكار ومواكبة أحدث التطورات التقنية في مجال عملنا
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
