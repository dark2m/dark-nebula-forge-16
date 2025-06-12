
import React from 'react';
import { Save, MessageCircle, Phone, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
    const currentHours = siteSettings.pageTexts.customerSupport?.workingHours || {};
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

  const updateSupportPolicy = (index: number, value: string) => {
    const currentPolicies = siteSettings.pageTexts.customerSupport?.supportPolicies || [];
    const newPolicies = [...currentPolicies];
    newPolicies[index] = value;
    
    setSiteSettings({
      ...siteSettings,
      pageTexts: {
        ...siteSettings.pageTexts,
        customerSupport: {
          ...siteSettings.pageTexts.customerSupport,
          supportPolicies: newPolicies
        }
      }
    });
  };

  const addSupportPolicy = () => {
    const currentPolicies = siteSettings.pageTexts.customerSupport?.supportPolicies || [];
    setSiteSettings({
      ...siteSettings,
      pageTexts: {
        ...siteSettings.pageTexts,
        customerSupport: {
          ...siteSettings.pageTexts.customerSupport,
          supportPolicies: [...currentPolicies, 'سياسة دعم جديدة']
        }
      }
    });
  };

  const removeSupportPolicy = (index: number) => {
    const currentPolicies = siteSettings.pageTexts.customerSupport?.supportPolicies || [];
    const newPolicies = currentPolicies.filter((_, i) => i !== index);
    
    setSiteSettings({
      ...siteSettings,
      pageTexts: {
        ...siteSettings.pageTexts,
        customerSupport: {
          ...siteSettings.pageTexts.customerSupport,
          supportPolicies: newPolicies
        }
      }
    });
  };

  const customerSupportTexts = siteSettings.pageTexts.customerSupport || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
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
              value={customerSupportTexts.pageTitle || 'خدمة العملاء'}
              onChange={(e) => updateCustomerSupportTexts('pageTitle', e.target.value)}
              className="bg-white/10 border-white/20 text-white"
              placeholder="خدمة العملاء"
            />
          </div>
          <div>
            <Label className="text-white">الوصف</Label>
            <Textarea
              value={customerSupportTexts.pageDescription || 'نحن هنا لمساعدتك في أي وقت. تواصل معنا عبر القنوات المختلفة'}
              onChange={(e) => updateCustomerSupportTexts('pageDescription', e.target.value)}
              className="bg-white/10 border-white/20 text-white"
              placeholder="وصف الصفحة"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* نصوص طرق التواصل */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">نصوص طرق التواصل</CardTitle>
          <CardDescription className="text-gray-400">
            تحرير النصوص الخاصة بكل طريقة تواصل
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* تيليجرام */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              تيليجرام
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">العنوان</Label>
                <Input
                  value={customerSupportTexts.telegramTitle || 'تيليجرام'}
                  onChange={(e) => updateCustomerSupportTexts('telegramTitle', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white">نص الزر</Label>
                <Input
                  value={customerSupportTexts.telegramButtonText || 'تواصل عبر تيليجرام'}
                  onChange={(e) => updateCustomerSupportTexts('telegramButtonText', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
            <div>
              <Label className="text-white">الوصف</Label>
              <Textarea
                value={customerSupportTexts.telegramDescription || 'للدعم الفوري والاستفسارات العامة'}
                onChange={(e) => updateCustomerSupportTexts('telegramDescription', e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                rows={2}
              />
            </div>
          </div>

          <Separator className="bg-white/20" />

          {/* ديسكورد */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              ديسكورد
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">العنوان</Label>
                <Input
                  value={customerSupportTexts.discordTitle || 'ديسكورد'}
                  onChange={(e) => updateCustomerSupportTexts('discordTitle', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white">نص الزر</Label>
                <Input
                  value={customerSupportTexts.discordButtonText || 'انضم إلى الديسكورد'}
                  onChange={(e) => updateCustomerSupportTexts('discordButtonText', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
            <div>
              <Label className="text-white">الوصف</Label>
              <Textarea
                value={customerSupportTexts.discordDescription || 'انضم إلى مجتمعنا ودردش مع الفريق'}
                onChange={(e) => updateCustomerSupportTexts('discordDescription', e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                rows={2}
              />
            </div>
          </div>

          <Separator className="bg-white/20" />

          {/* واتساب */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Phone className="w-4 h-4" />
              واتساب
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">العنوان</Label>
                <Input
                  value={customerSupportTexts.whatsappTitle || 'واتساب'}
                  onChange={(e) => updateCustomerSupportTexts('whatsappTitle', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white">نص الزر</Label>
                <Input
                  value={customerSupportTexts.whatsappButtonText || 'راسل عبر واتساب'}
                  onChange={(e) => updateCustomerSupportTexts('whatsappButtonText', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
            <div>
              <Label className="text-white">الوصف</Label>
              <Textarea
                value={customerSupportTexts.whatsappDescription || 'للدعم الشخصي المباشر'}
                onChange={(e) => updateCustomerSupportTexts('whatsappDescription', e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                rows={2}
              />
            </div>
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
              value={customerSupportTexts.workingHoursTitle || 'ساعات العمل'}
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
              value={customerSupportTexts.supportNote || '💡 الدعم الفني متاح 24/7 عبر تيليجرام للحالات الطارئة'}
              onChange={(e) => updateCustomerSupportTexts('supportNote', e.target.value)}
              className="bg-white/10 border-white/20 text-white"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* سياسة الدعم */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            سياسة الدعم
          </CardTitle>
          <CardDescription className="text-gray-400">
            إدارة نقاط سياسة الدعم المعروضة للعملاء
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-white">عنوان القسم</Label>
            <Input
              value={customerSupportTexts.supportPolicyTitle || 'سياسة الدعم'}
              onChange={(e) => updateCustomerSupportTexts('supportPolicyTitle', e.target.value)}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-white">نقاط السياسة</Label>
              <Button
                onClick={addSupportPolicy}
                size="sm"
                className="glow-button"
              >
                إضافة نقطة
              </Button>
            </div>
            
            {(customerSupportTexts.supportPolicies || [
              'استجابة فورية للاستفسارات العامة',
              'دعم فني متخصص لجميع المنتجات',
              'ضمان الجودة وحل المشاكل',
              'متابعة مستمرة لرضا العملاء'
            ]).map((policy, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={policy}
                  onChange={(e) => updateSupportPolicy(index, e.target.value)}
                  className="bg-white/10 border-white/20 text-white flex-1"
                  placeholder="نص النقطة"
                />
                <Button
                  onClick={() => removeSupportPolicy(index)}
                  size="sm"
                  variant="destructive"
                  className="px-3"
                >
                  حذف
                </Button>
              </div>
            ))}
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
