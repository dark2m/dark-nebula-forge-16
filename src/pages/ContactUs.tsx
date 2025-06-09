
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';

const ContactUs = () => {
  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
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
              تواصل معنا
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              نحن هنا لمساعدتك! تواصل معنا عبر أي من الطرق التالية وسنكون سعداء للرد على استفساراتك
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="admin-card rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">تيليجرام</h3>
              <p className="text-gray-300 mb-4">للتواصل السريع والدعم الفوري</p>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                @DarkTeam_Support
              </a>
            </div>

            <div className="admin-card rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">ديسكورد</h3>
              <p className="text-gray-300 mb-4">انضم لخادم المجتمع</p>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                Discord Server
              </a>
            </div>

            <div className="admin-card rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">واتساب</h3>
              <p className="text-gray-300 mb-4">للاستفسارات العاجلة</p>
              <a href="#" className="text-green-400 hover:text-green-300 transition-colors">
                +966 XX XXX XXXX
              </a>
            </div>

            <div className="admin-card rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">البريد الإلكتروني</h3>
              <p className="text-gray-300 mb-4">للاستفسارات الرسمية</p>
              <a href="mailto:support@dark.com" className="text-red-400 hover:text-red-300 transition-colors">
                support@dark.com
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="admin-card rounded-xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">أرسل لنا رسالة</h2>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  الموضوع
                </label>
                <input
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                  placeholder="موضوع الرسالة"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  الرسالة
                </label>
                <textarea
                  rows={5}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400 resize-none"
                  placeholder="اكتب رسالتك هنا..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full glow-button py-3"
              >
                إرسال الرسالة
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="admin-card rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">أوقات العمل</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex justify-between">
                  <span>السبت - الخميس:</span>
                  <span>9:00 ص - 11:00 م</span>
                </div>
                <div className="flex justify-between">
                  <span>الجمعة:</span>
                  <span>2:00 م - 11:00 م</span>
                </div>
                <div className="flex justify-between">
                  <span>الدعم الفني:</span>
                  <span>24/7</span>
                </div>
              </div>
            </div>

            <div className="admin-card rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">معلومات إضافية</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <Phone className="w-5 h-5 text-blue-400 mt-1" />
                  <div>
                    <p className="font-semibold">خط الدعم الفوري</p>
                    <p>+966 XX XXX XXXX</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <MapPin className="w-5 h-5 text-green-400 mt-1" />
                  <div>
                    <p className="font-semibold">المقر الرئيسي</p>
                    <p>المملكة العربية السعودية</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
