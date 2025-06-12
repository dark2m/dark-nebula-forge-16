
import React from 'react';
import { Save, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { SiteSettings } from '../../types/admin';

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
  
  const updateCustomerSupportTexts = (field: string, value: string) => {
    setSiteSettings({
      ...siteSettings,
      pageTexts: {
        ...siteSettings.pageTexts,
        customerSupport: {
          ...siteSettings.pageTexts.customerSupport,
          [field]: value
        }
      }
    });
  };

  const updateWorkingHours = (day: string, hours: string) => {
    const currentHours = siteSettings.pageTexts.customerSupport?.workingHours || {
      weekdays: '9:00 ص - 11:00 م',
      friday: '2:00 م - 11:00 م'
    };
    setSiteSettings({
      ...siteSettings,
      pageTexts: {
        ...siteSettings.pageTexts,
        customerSupport: {
          ...siteSettings.pageTexts.customerSupport,
          workingHours: {
            ...currentHours,
            [day]: hours
          }
        }
      }
    });
  };

  const customerSupportTexts = siteSettings.pageTexts.customerSupport || {
    pageTitle: 'خدمة العملاء',
    pageDescription: 'نحن هنا لمساعدتك في أي وقت. تواصل معنا عبر القنوات المختلفة',
    workingHoursTitle: 'ساعات العمل',
    workingHours: {
      weekdays: '9:00 ص - 11:00 م',
      friday: '2:00 م - 11:00 م'
    },
    supportNote: '💡 الدعم الفني متاح 24/7 للحالات الطارئة'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6" />
            إدارة صفحة خدمة العملاء
          </h2>
          <p className="text-gray-400 mt-1">تحكم في جميع النصوص والمحتوى الخاص بصفحة خدمة العملاء</p>
        </div>
        <Button onClick={saveSiteSettings} className="glow-button">
          <Save className="w-4 h-4 mr-2" />
          حفظ التغييرات
        </Button>
      </div>

      {/* العنوان الرئيسي والوصف */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">العنوان الرئيسي والوصف</CardTitle>
          <CardDescription className="text-gray-400">
            تحرير العنوان والوصف الظاهر في أعلى الصفحة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-white">العنوان الرئيسي</Label>
            <Input
              value={customerSupportTexts.pageTitle}
              onChange={(e) => updateCustomerSupportTexts('pageTitle', e.target.value)}
              className="bg-white/10 border-white/20 text-white"
              placeholder="خدمة العملاء"
            />
          </div>
          <div>
            <Label className="text-white">الوصف</Label>
            <Textarea
              value={customerSupportTexts.pageDescription}
              onChange={(e) => updateCustomerSupportTexts('pageDescription', e.target.value)}
              className="bg-white/10 border-white/20 text-white"
              placeholder="وصف الصفحة"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* ساعات العمل */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            ساعات العمل
          </CardTitle>
          <CardDescription className="text-gray-400">
            تحديد ساعات العمل لكل يوم
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-white">عنوان القسم</Label>
            <Input
              value={customerSupportTexts.workingHoursTitle}
              onChange={(e) => updateCustomerSupportTexts('workingHoursTitle', e.target.value)}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white">السبت - الخميس</Label>
              <Input
                value={customerSupportTexts.workingHours?.weekdays || '9:00 ص - 11:00 م'}
                onChange={(e) => updateWorkingHours('weekdays', e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label className="text-white">الجمعة</Label>
              <Input
                value={customerSupportTexts.workingHours?.friday || '2:00 م - 11:00 م'}
                onChange={(e) => updateWorkingHours('friday', e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>

          <div>
            <Label className="text-white">ملاحظة إضافية</Label>
            <Textarea
              value={customerSupportTexts.supportNote}
              onChange={(e) => updateCustomerSupportTexts('supportNote', e.target.value)}
              className="bg-white/10 border-white/20 text-white"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* زر الحفظ السفلي */}
      <div className="flex justify-end pt-4 border-t border-white/20">
        <Button onClick={saveSiteSettings} className="glow-button">
          <Save className="w-4 h-4 mr-2" />
          حفظ جميع التغييرات
        </Button>
      </div>
    </div>
  );
};

export default CustomerSupportTab;
