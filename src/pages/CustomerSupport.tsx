import React, { useEffect, useState } from 'react';
import { Clock, Shield, User, Lock, Eye, EyeOff, Mail, ArrowLeft } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import CustomerChat from '../components/CustomerChat';
import SettingsService from '../utils/settingsService';
import CustomerAuthService from '../utils/customerAuthService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { SiteSettings } from '../types/admin';

const CustomerSupport = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<any>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationEmail, setVerificationEmail] = useState('');
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
  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: ''
  });
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [verificationError, setVerificationError] = useState('');

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
    workingHoursTitle: settings.pageTexts?.customerSupport?.workingHoursTitle || 'ساعات العمل',
    workingHours: {
      weekdays: settings.pageTexts?.customerSupport?.workingHours?.weekdays || '9:00 ص - 11:00 م',
      friday: settings.pageTexts?.customerSupport?.workingHours?.friday || '2:00 م - 11:00 م'
    },
    supportNote: settings.pageTexts?.customerSupport?.supportNote || '💡 الدعم الفني متاح 24/7 للحالات الطارئة'
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    console.log('محاولة تسجيل الدخول:', loginForm);
    
    if (!loginForm.email || !loginForm.password) {
      setLoginError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    
    const success = CustomerAuthService.authenticateCustomer(loginForm.email, loginForm.password);
    
    if (success) {
      setIsAuthenticated(true);
      setCurrentCustomer(CustomerAuthService.getCurrentCustomer());
      console.log('تم تسجيل الدخول بنجاح');
    } else {
      setLoginError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      console.log('فشل في تسجيل الدخول');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    
    if (!registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      setRegisterError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError('كلمات المرور غير متطابقة');
      return;
    }
    
    if (registerForm.password.length < 6) {
      setRegisterError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    
    // التحقق من وجود الإيميل مسبقاً
    const customers = CustomerAuthService.getCustomers();
    const existingCustomer = customers.find(c => c.email === registerForm.email);
    
    if (existingCustomer) {
      setRegisterError('الإيميل مستخدم مسبقاً. يرجى استخدام إيميل آخر أو تسجيل الدخول إذا كان لديك حساب');
      return;
    }
    
    // إظهار حوار التحقق
    setVerificationEmail(registerForm.email);
    setShowVerificationDialog(true);
    
    console.log('تم إرسال رمز التحقق إلى:', registerForm.email);
    // في التطبيق الحقيقي، ستقوم بإرسال رمز التحقق عبر البريد الإلكتروني
  };

  const handleVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError('');
    
    if (!verificationCode) {
      setVerificationError('يرجى إدخال رمز التحقق');
      return;
    }
    
    if (verificationCode.length !== 6) {
      setVerificationError('رمز التحقق يجب أن يكون 6 أرقام');
      return;
    }
    
    // في التطبيق الحقيقي، ستقوم بالتحقق من الرمز مع الخادم
    // هنا سنقبل أي رمز من 6 أرقام كمثال
    if (!/^\d{6}$/.test(verificationCode)) {
      setVerificationError('رمز التحقق يجب أن يحتوي على أرقام فقط');
      return;
    }
    
    // إنشاء الحساب بعد التحقق
    const success = CustomerAuthService.registerCustomer(registerForm.email, registerForm.password);
    
    if (success) {
      // تسجيل الدخول تلقائياً بعد إنشاء الحساب
      const loginSuccess = CustomerAuthService.authenticateCustomer(registerForm.email, registerForm.password);
      if (loginSuccess) {
        setIsAuthenticated(true);
        setCurrentCustomer(CustomerAuthService.getCurrentCustomer());
        setShowVerificationDialog(false);
        setVerificationCode('');
        setVerificationEmail('');
        console.log('تم إنشاء الحساب وتسجيل الدخول بنجاح');
      }
    } else {
      setVerificationError('حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى');
    }
  };

  const handleCloseVerificationDialog = () => {
    setShowVerificationDialog(false);
    setVerificationCode('');
    setVerificationError('');
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordForm.email) {
      setForgotPasswordMessage('يرجى إدخال البريد الإلكتروني');
      return;
    }
    
    // البحث عن المستخدم
    const customers = CustomerAuthService.getCustomers();
    const customer = customers.find(c => c.email === forgotPasswordForm.email);
    
    if (customer) {
      setForgotPasswordMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. (هذه الميزة قيد التطوير - يرجى التواصل مع الدعم الفني)');
      console.log('طلب إعادة تعيين كلمة المرور للمستخدم:', customer.email);
    } else {
      setForgotPasswordMessage('لا يوجد حساب مرتبط بهذا البريد الإلكتروني');
    }
  };

  const handleLogout = () => {
    CustomerAuthService.logout();
    setIsAuthenticated(false);
    setCurrentCustomer(null);
    setLoginForm({ email: '', password: '' });
    setRegisterForm({ email: '', password: '', confirmPassword: '', verificationCode: '' });
    setForgotPasswordForm({ email: '' });
    setShowForgotPassword(false);
  };

  // إذا كان العميل مسجل دخول، عرض واجهة خدمة العملاء مع الشات
  if (isAuthenticated && currentCustomer) {
    // استخراج اسم المستخدم من الإيميل (الجزء قبل @)
    const username = currentCustomer.email.split('@')[0];
    
    return (
      <div className="min-h-screen relative">
        <StarryBackground />
        
        <div className="relative z-10 pt-32 pb-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6">
                مرحباً {username}
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
                نحن سعداء لخدمتك. يمكنك الآن التواصل معنا مباشرة
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* الشات */}
                <div>
                  <CustomerChat 
                    customerId={currentCustomer.id} 
                    customerEmail={currentCustomer.email} 
                  />
                </div>

                {/* معلومات إضافية */}
                <div className="space-y-6">
                  {/* ساعات العمل */}
                  <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        {customerSupportTexts.workingHoursTitle}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-gray-300">
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

                  {/* نصائح للاستخدام */}
                  <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        نصائح للحصول على أفضل دعم
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-gray-300">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                          <p>وضح مشكلتك بالتفصيل</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                          <p>أرفق صور إن أمكن (سيتم إضافة هذه الميزة قريباً)</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                          <p>انتظر الرد - فريقنا يعمل على مدار الساعة</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                          <p>تحقق من الشات بانتظام للحصول على الردود</p>
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
        </div>
      </div>
    );
  }

  // واجهة نسيان كلمة المرور
  if (showForgotPassword) {
    return (
      <div className="min-h-screen relative">
        <StarryBackground />
        
        <div className="relative z-10 pt-32 pb-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6">
                استعادة كلمة المرور
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
                أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                    <Lock className="w-6 h-6 text-blue-400" />
                    نسيت كلمة المرور
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    سنرسل لك رابط إعادة تعيين كلمة المرور على بريدك الإلكتروني
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    {forgotPasswordMessage && (
                      <div className={`border rounded-lg p-3 text-sm ${
                        forgotPasswordMessage.includes('تم إرسال') 
                          ? 'bg-green-500/20 border-green-500/30 text-green-300'
                          : 'bg-red-500/20 border-red-500/30 text-red-300'
                      }`}>
                        {forgotPasswordMessage}
                      </div>
                    )}
                    <div>
                      <Label htmlFor="forgotEmail" className="text-white">البريد الإلكتروني</Label>
                      <div className="relative">
                        <Input
                          id="forgotEmail"
                          type="email"
                          placeholder="أدخل بريدك الإلكتروني"
                          value={forgotPasswordForm.email}
                          onChange={(e) => setForgotPasswordForm({...forgotPasswordForm, email: e.target.value})}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10"
                          required
                        />
                        <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full glow-button">
                      إرسال رابط الاستعادة
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="w-full text-blue-400 hover:text-blue-300 flex items-center justify-center gap-2"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotPasswordMessage('');
                        setForgotPasswordForm({ email: '' });
                      }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      العودة لتسجيل الدخول
                    </Button>
                  </form>
                </CardContent>
              </Card>
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
                  سجل دخولك أو أنشئ حساب جديد للوصول إلى الدعم
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                            onChange={(e) => {
                              setLoginForm({...loginForm, email: e.target.value});
                              if (loginError) setLoginError('');
                            }}
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
                            onChange={(e) => {
                              setLoginForm({...loginForm, password: e.target.value});
                              if (loginError) setLoginError('');
                            }}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10 pr-10"
                            required
                          />
                          <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-4 w-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full glow-button">
                        تسجيل الدخول
                      </Button>
                      <div className="text-center">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          className="text-blue-400 hover:text-blue-300 text-sm"
                          onClick={() => setShowForgotPassword(true)}
                        >
                          نسيت كلمة المرور؟
                        </Button>
                      </div>
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
                            onChange={(e) => {
                              setRegisterForm({...registerForm, email: e.target.value});
                              if (registerError) setRegisterError('');
                            }}
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
                            placeholder="أدخل كلمة مرور قوية (6 أحرف على الأقل)"
                            value={registerForm.password}
                            onChange={(e) => {
                              setRegisterForm({...registerForm, password: e.target.value});
                              if (registerError) setRegisterError('');
                            }}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10 pr-10"
                            required
                            minLength={6}
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
                            onChange={(e) => {
                              setRegisterForm({...registerForm, confirmPassword: e.target.value});
                              if (registerError) setRegisterError('');
                            }}
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
              </CardContent>
            </Card>

            {/* حوار التحقق من البريد الإلكتروني */}
            <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
              <DialogContent className="sm:max-w-[425px] bg-white/10 backdrop-blur-md border border-white/20">
                <DialogHeader>
                  <DialogTitle className="text-white text-center flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5 text-blue-400" />
                    تحقق من بريدك الإلكتروني
                  </DialogTitle>
                  <DialogDescription className="text-gray-300 text-center">
                    تم إرسال رمز التحقق إلى <strong className="text-blue-400">{verificationEmail}</strong>
                    <br />
                    يرجى إدخال الرمز المكون من 6 أرقام
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleVerification} className="space-y-4">
                  {verificationError && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
                      {verificationError}
                    </div>
                  )}
                  <div>
                    <Label htmlFor="verificationCode" className="text-white">رمز التحقق</Label>
                    <Input
                      id="verificationCode"
                      type="text"
                      placeholder="أدخل الرمز (مثال: 123456)"
                      value={verificationCode}
                      onChange={(e) => {
                        // السماح بالأرقام فقط وحد أقصى 6 أرقام
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setVerificationCode(value);
                        if (verificationError) setVerificationError('');
                      }}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-center text-lg tracking-widest"
                      maxLength={6}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1 glow-button">
                      تأكيد
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCloseVerificationDialog}
                      className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      إلغاء
                    </Button>
                  </div>
                  <div className="text-center">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="text-blue-400 hover:text-blue-300 text-sm"
                      onClick={() => {
                        console.log('إعادة إرسال رمز التحقق إلى:', verificationEmail);
                        // في التطبيق الحقيقي، ستقوم بإعادة إرسال الرمز
                      }}
                    >
                      إعادة إرسال الرمز
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

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
