import React, { useEffect, useState } from 'react';
import { Phone, Clock, Shield, User, Lock, Eye, EyeOff, Mail } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import SettingsService from '../utils/settingsService';
import CustomerAuthService from '../utils/customerAuthService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { SiteSettings } from '../types/admin';

const CustomerSupport = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<any>(null);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: ''
  });
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');

  useEffect(() => {
    setSettings(SettingsService.getSiteSettings());
    
    // التحقق من حالة تسجيل الدخول
    const authenticated = CustomerAuthService.isCustomerAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      setCurrentCustomer(CustomerAuthService.getCurrentCustomer());
    }
  }, []);

  if (!settings) return null;

  // إنشاء كائن النصوص مع القيم الافتراضية
  const customerSupportTexts = {
    pageTitle: settings.pageTexts?.customerSupport?.pageTitle || 'خدمة العملاء',
    pageDescription: settings.pageTexts?.customerSupport?.pageDescription || 'سجل دخولك للوصول إلى خدمة العملاء المتخصصة',
    whatsappTitle: settings.pageTexts?.customerSupport?.whatsappTitle || 'واتساب',
    whatsappDescription: settings.pageTexts?.customerSupport?.whatsappDescription || 'للدعم الشخصي المباشر',
    whatsappButtonText: settings.pageTexts?.customerSupport?.whatsappButtonText || 'راسل عبر واتساب',
    workingHoursTitle: settings.pageTexts?.customerSupport?.workingHoursTitle || 'ساعات العمل',
    workingHours: {
      weekdays: settings.pageTexts?.customerSupport?.workingHours?.weekdays || '9:00 ص - 11:00 م',
      friday: settings.pageTexts?.customerSupport?.workingHours?.friday || '2:00 م - 11:00 م'
    },
    supportNote: settings.pageTexts?.customerSupport?.supportNote || '💡 الدعم الفني متاح 24/7 عبر واتساب للحالات الطارئة'
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    console.log('محاولة تسجيل الدخول:', loginForm);
    
    const success = CustomerAuthService.authenticateCustomer(loginForm.email, loginForm.password);
    
    if (success) {
      setIsAuthenticated(true);
      setCurrentCustomer(CustomerAuthService.getCurrentCustomer());
      console.log('تم تسجيل الدخول بنجاح');
    } else {
      setLoginError('بيانات الدخول غير صحيحة');
      console.log('فشل في تسجيل الدخول');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    
    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError('كلمات المرور غير متطابقة');
      return;
    }
    
    console.log('محاولة إنشاء حساب:', registerForm);
    
    const success = CustomerAuthService.registerCustomer(registerForm.email, registerForm.password);
    
    if (success) {
      setIsAuthenticated(true);
      setCurrentCustomer(CustomerAuthService.getCurrentCustomer());
      console.log('تم إنشاء الحساب بنجاح');
    } else {
      setRegisterError('الإيميل مستخدم مسبقاً');
      console.log('فشل في إنشاء الحساب');
    }
  };

  const handleLogout = () => {
    CustomerAuthService.logout();
    setIsAuthenticated(false);
    setCurrentCustomer(null);
    setLoginForm({ email: '', password: '' });
    setRegisterForm({ email: '', password: '', confirmPassword: '', verificationCode: '' });
  };

  const handleVerification = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('تأكيد الرمز:', registerForm.verificationCode);
    // سيتم ربطها بـ Supabase لاحقاً
  };

  // إذا كان العميل مسجل دخول، عرض واجهة خدمة العملاء
  if (isAuthenticated && currentCustomer) {
    return (
      <div className="min-h-screen relative">
        <StarryBackground />
        
        <div className="relative z-10 pt-32 pb-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6">
                مرحباً {currentCustomer.email}
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
                نحن سعداء لخدمتك. يمكنك الآن الوصول إلى جميع خدمات الدعم المتاحة
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
                {/* واتساب فقط */}
                <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl font-bold text-white flex items-center justify-center gap-2">
                      <Phone className="w-6 h-6 text-green-400" />
                      {customerSupportTexts.whatsappTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-300 mb-4">
                      {customerSupportTexts.whatsappDescription}
                    </p>
                    <Button 
                      className="w-full glow-button"
                      onClick={() => window.open(`https://wa.me/${settings.contactInfo.whatsapp.replace(/\D/g, '')}`, '_blank')}
                    >
                      {customerSupportTexts.whatsappButtonText}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* ساعات العمل */}
              <Card className="bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {customerSupportTexts.workingHoursTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                    <div>
                      <p><strong>الأحد - الخميس:</strong> {customerSupportTexts.workingHours.weekdays}</p>
                      <p><strong>الجمعة:</strong> {customerSupportTexts.workingHours.friday}</p>
                    </div>
                    <div>
                      <p className="text-green-400">
                        {customerSupportTexts.supportNote}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* زر تسجيل الخروج */}
              <div className="text-center">
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  تسجيل الخروج
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // واجهة تسجيل الدخول/التسجيل
  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      <div className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6">
              {customerSupportTexts.pageTitle}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              {customerSupportTexts.pageDescription}
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                  <Shield className="w-6 h-6 text-blue-400" />
                  دخول العملاء
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {isVerificationStep ? 'أدخل رمز التأكيد المرسل إلى بريدك الإلكتروني' : 'سجل دخولك أو أنشئ حساب جديد للوصول إلى الدعم'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isVerificationStep ? (
                  <form onSubmit={handleVerification} className="space-y-4">
                    <div>
                      <Label htmlFor="verificationCode" className="text-white">رمز التأكيد</Label>
                      <Input
                        id="verificationCode"
                        type="text"
                        placeholder="أدخل رمز التأكيد (6 أرقام)"
                        value={registerForm.verificationCode}
                        onChange={(e) => setRegisterForm({...registerForm, verificationCode: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        maxLength={6}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full glow-button">
                      تأكيد الحساب
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="w-full text-blue-400 hover:text-blue-300"
                      onClick={() => setIsVerificationStep(false)}
                    >
                      العودة للتسجيل
                    </Button>
                  </form>
                ) : (
                  <Tabs defaultValue="login" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2 bg-white/10">
                      <TabsTrigger value="login" className="text-white data-[state=active]:bg-blue-500/20">
                        تسجيل الدخول
                      </TabsTrigger>
                      <TabsTrigger value="register" className="text-white data-[state=active]:bg-blue-500/20">
                        إنشاء حساب
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="space-y-4">
                      <form onSubmit={handleLogin} className="space-y-4">
                        {loginError && (
                          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
                            {loginError}
                          </div>
                        )}
                        <div>
                          <Label htmlFor="loginEmail" className="text-white">البريد الإلكتروني</Label>
                          <div className="relative">
                            <Input
                              id="loginEmail"
                              type="email"
                              placeholder="أدخل بريدك الإلكتروني"
                              value={loginForm.email}
                              onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10"
                              required
                            />
                            <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="loginPassword" className="text-white">كلمة المرور</Label>
                          <div className="relative">
                            <Input
                              id="loginPassword"
                              type={showPassword ? "text" : "password"}
                              placeholder="أدخل كلمة المرور"
                              value={loginForm.password}
                              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10 pr-10"
                              required
                            />
                            <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-white"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <Button type="submit" className="w-full glow-button">
                          تسجيل الدخول
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="register" className="space-y-4">
                      <form onSubmit={handleRegister} className="space-y-4">
                        {registerError && (
                          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
                            {registerError}
                          </div>
                        )}
                        <div>
                          <Label htmlFor="registerEmail" className="text-white">البريد الإلكتروني</Label>
                          <div className="relative">
                            <Input
                              id="registerEmail"
                              type="email"
                              placeholder="أدخل بريدك الإلكتروني"
                              value={registerForm.email}
                              onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10"
                              required
                            />
                            <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="registerPassword" className="text-white">كلمة المرور</Label>
                          <div className="relative">
                            <Input
                              id="registerPassword"
                              type={showPassword ? "text" : "password"}
                              placeholder="أدخل كلمة مرور قوية"
                              value={registerForm.password}
                              onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10 pr-10"
                              required
                              minLength={8}
                            />
                            <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-white"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword" className="text-white">تأكيد كلمة المرور</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="أعد إدخال كلمة المرور"
                              value={registerForm.confirmPassword}
                              onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10 pr-10"
                              required
                            />
                            <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-white"
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <Button type="submit" className="w-full glow-button">
                          إنشاء حساب جديد
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>

            {/* معلومات إضافية */}
            <div className="mt-8 text-center">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5" />
                  لماذا التسجيل مطلوب؟
                </h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <p>حماية بياناتك الشخصية وضمان الخصوصية</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <p>تتبع طلباتك ومحادثاتك مع فريق الدعم</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <p>الحصول على دعم فني متخصص وشخصي</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                    <p>إشعارات فورية لردود فريق الدعم</p>
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

export default CustomerSupport;
