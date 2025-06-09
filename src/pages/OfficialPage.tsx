
import React, { useState, useEffect } from 'react';
import { MessageCircle, Mail, Phone, MapPin, Users, Star, Shield } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import AdminStorage from '../utils/adminStorage';

const OfficialPage = () => {
  const [siteSettings, setSiteSettings] = useState(AdminStorage.getSiteSettings());

  useEffect(() => {
    const loadedSettings = AdminStorage.getSiteSettings();
    setSiteSettings(loadedSettings);
  }, []);

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      <div className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
              الصفحة الرسمية
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              تعرف على فريق DARK واحصل على جميع طرق التواصل معنا
            </p>
          </div>

          {/* About Us Section */}
          <div className="admin-card rounded-xl p-8 mb-12">
            <div className="flex items-center justify-center mb-6">
              <Users className="w-12 h-12 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-white text-center mb-6">من نحن</h2>
            <div className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
              <p className="mb-6">
                فريق DARK هو مجموعة من المطورين والمبرمجين المتخصصين في مجال التقنية والألعاب. 
                نحن نسعى لتقديم أفضل الخدمات والمنتجات التقنية مع ضمان الجودة والأمان.
              </p>
              <p className="mb-6">
                تأسس فريقنا على أسس قوية من الخبرة والمعرفة العميقة في مجال البرمجة وتطوير الحلول التقنية. 
                نحن نفخر بتقديم خدمات متميزة تلبي احتياجات عملائنا وتفوق توقعاتهم.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-4">
                  <Shield className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">الأمان</h3>
                  <p className="text-gray-400">منتجات آمنة ومحمية بأحدث التقنيات</p>
                </div>
                <div className="text-center p-4">
                  <Star className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">الجودة</h3>
                  <p className="text-gray-400">أعلى معايير الجودة في جميع منتجاتنا</p>
                </div>
                <div className="text-center p-4">
                  <MessageCircle className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">الدعم</h3>
                  <p className="text-gray-400">دعم فني متاح 24/7 لجميع عملائنا</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="admin-card rounded-xl p-8">
            <div className="flex items-center justify-center mb-6">
              <MessageCircle className="w-12 h-12 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-white text-center mb-8">تواصل معنا</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 text-center">
                <MessageCircle className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">تليجرام</h3>
                <p className="text-blue-400">{siteSettings.contactInfo.telegram}</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 text-center">
                <MessageCircle className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">ديسكورد</h3>
                <p className="text-purple-400">{siteSettings.contactInfo.discord}</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
                <Phone className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">واتساب</h3>
                <p className="text-green-400">{siteSettings.contactInfo.whatsapp}</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
                <Mail className="w-8 h-8 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">البريد الإلكتروني</h3>
                <p className="text-red-400">{siteSettings.contactInfo.email}</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 text-center">
                <Phone className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">الهاتف</h3>
                <p className="text-blue-400">{siteSettings.contactInfo.phone}</p>
              </div>
              <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-6 text-center">
                <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">العنوان</h3>
                <p className="text-gray-400">{siteSettings.contactInfo.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialPage;
