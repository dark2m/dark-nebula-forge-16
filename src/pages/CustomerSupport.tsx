
import React, { useEffect, useState } from 'react';
import { MessageCircle, Phone, Mail, Users, Clock, Shield, User, Lock, Eye, EyeOff } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import SettingsService from '../utils/settingsService';
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

  useEffect(() => {
    setSettings(SettingsService.getSiteSettings());
  }, []);

  if (!settings) return null;

  const customerSupportTexts = settings.pageTexts?.customerSupport || {
    pageTitle: 'خدمة العملاء',
    pageDescription: 'سجل دخولك للوصول إلى خدمة العملاء المتخصصة'
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('تسجيل الدخول:', loginForm);
    // سيتم ربطها بـ Supabase لاحقاً
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('كلمات المرور غير متطابقة');
      return;
    }
    console.log('إنشاء حساب:', registerForm);
    setIsVerificationStep(true);
    // سيتم ربطها بـ Supabase لاحقاً
  };

  const handleVerification = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('تأكيد الرمز:', registerForm.verificationCode);
    // سيتم ربطها بـ Supabase لاحقاً
  };

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
