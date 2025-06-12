
import React, { useEffect, useState } from 'react';
import { MessageCircle, Phone, Mail, Users, Clock, Shield } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import SettingsService from '../utils/settingsService';
import type { SiteSettings } from '../types/admin';

const CustomerSupport = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    setSettings(SettingsService.getSiteSettings());
  }, []);

  if (!settings) return null;

  const customerSupportTexts = settings.pageTexts?.customerSupport || {};

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      <div className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6">
              {customerSupportTexts.pageTitle || 'خدمة العملاء'}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              {customerSupportTexts.pageDescription || 'نحن هنا لمساعدتك في أي وقت. تواصل معنا عبر القنوات المختلفة'}
            </p>
          </div>

          {/* طرق التواصل */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300">
              <MessageCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {customerSupportTexts.telegramTitle || 'تيليجرام'}
              </h3>
              <p className="text-gray-300 mb-4">
                {customerSupportTexts.telegramDescription || 'للدعم الفوري والاستفسارات العامة'}
              </p>
              <a 
                href={`https://t.me/${settings.contactInfo?.telegram?.replace('@', '') || 'DarkTeam_Support'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glow-button inline-block"
              >
                {customerSupportTexts.telegramButtonText || 'تواصل عبر تيليجرام'}
              </a>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300">
              <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {customerSupportTexts.discordTitle || 'ديسكورد'}
              </h3>
              <p className="text-gray-300 mb-4">
                {customerSupportTexts.discordDescription || 'انضم إلى مجتمعنا ودردش مع الفريق'}
              </p>
              <button className="glow-button">
                {customerSupportTexts.discordButtonText || 'انضم إلى الديسكورد'}
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300">
              <Phone className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {customerSupportTexts.whatsappTitle || 'واتساب'}
              </h3>
              <p className="text-gray-300 mb-4">
                {customerSupportTexts.whatsappDescription || 'للدعم الشخصي المباشر'}
              </p>
              <a 
                href={`https://wa.me/${settings.contactInfo?.whatsapp?.replace(/\D/g, '') || '966XXXXXXXX'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glow-button inline-block"
              >
                {customerSupportTexts.whatsappButtonText || 'راسل عبر واتساب'}
              </a>
            </div>
          </div>

          {/* معلومات إضافية */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Clock className="w-6 h-6 ml-2" />
                {customerSupportTexts.workingHoursTitle || 'ساعات العمل'}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">السبت - الخميس</span>
                  <span className="text-white font-medium">
                    {customerSupportTexts.workingHours?.weekdays || '9:00 ص - 11:00 م'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">الجمعة</span>
                  <span className="text-white font-medium">
                    {customerSupportTexts.workingHours?.friday || '2:00 م - 11:00 م'}
                  </span>
                </div>
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-200 text-sm">
                    {customerSupportTexts.supportNote || '💡 الدعم الفني متاح 24/7 عبر تيليجرام للحالات الطارئة'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Shield className="w-6 h-6 ml-2" />
                {customerSupportTexts.supportPolicyTitle || 'سياسة الدعم'}
              </h2>
              <div className="space-y-4">
                {(customerSupportTexts.supportPolicies || [
                  'استجابة فورية للاستفسارات العامة',
                  'دعم فني متخصص لجميع المنتجات',
                  'ضمان الجودة وحل المشاكل',
                  'متابعة مستمرة لرضا العملاء'
                ]).map((policy, index) => (
                  <div key={index} className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <p className="text-gray-300">{policy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
