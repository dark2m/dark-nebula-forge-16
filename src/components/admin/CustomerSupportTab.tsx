
import React from 'react';
import { SiteSettings } from '../../types/admin';

interface CustomerSupportTabProps {
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  saveSiteSettings: () => void;
}

const CustomerSupportTab: React.FC<CustomerSupportTabProps> = ({ 
  siteSettings, 
  setSiteSettings, 
  saveSiteSettings 
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">خدمة العملاء</h2>
      
      <div className="admin-card rounded-xl p-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-4">إدارة خدمة العملاء</h3>
          <p className="text-gray-400 mb-6">
            يمكنك الوصول إلى جميع رسائل العملاء وإدارة المحادثات من خلال قسم "سجل العملاء"
          </p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-400">
              📋 انتقل إلى قسم "سجل العملاء" للوصول إلى:
            </p>
            <ul className="text-gray-300 mt-2 space-y-1 text-sm">
              <li>• عرض جميع رسائل العملاء</li>
              <li>• إرسال الردود والرسائل الجديدة</li>
              <li>• إرسال الصور والفيديوهات</li>
              <li>• إدارة حالة المحادثات</li>
              <li>• مراقبة الرسائل غير المقروءة</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupportTab;
