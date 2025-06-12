
import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, CheckCircle } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import CustomerAuthService from '../utils/customerAuthService';
import CustomerChat from '../components/CustomerChat';
import { useToast } from '@/hooks/use-toast';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EmailService from '../utils/emailService';

const CustomerSupport = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [otp, setOtp] = useState('');
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'register'
  const [loginField, setLoginField] = useState(''); // للإيميل أو اسم المستخدم
  const { toast } = useToast();

  useEffect(() => {
    CustomerAuthService.initializeDefaultCustomer();
    const currentCustomer = CustomerAuthService.getCurrentCustomer();
    if (currentCustomer) {
      setIsRegistered(true);
      setEmail(currentCustomer.email);
      setUsername(currentCustomer.username || '');
      setShowChat(true);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (!loginField || !password) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    console.log('Attempting login with:', { loginField, password });
    const isAuthenticated = CustomerAuthService.authenticateCustomer(loginField, password);
    console.log('Authentication result:', isAuthenticated);
    
    setIsLoading(false);

    if (isAuthenticated) {
      const currentCustomer = CustomerAuthService.getCurrentCustomer();
      setIsRegistered(true);
      setShowChat(true);
      setEmail(currentCustomer?.email || '');
      setUsername(currentCustomer?.username || '');
      toast({
        title: "تم تسجيل الدخول",
        description: "تم تسجيل الدخول بنجاح",
      });
    } else {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "خطأ في البريد الإلكتروني/اسم المستخدم أو كلمة المرور",
        variant: "destructive"
      });
    }
  };

  const handleRegister = async () => {
    if (!email || !username || !password) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive"
      });
      return;
    }

    // التحقق من كلمة المرور - تحتاج على الأقل 6 أحرف
    if (password.length < 6) {
      toast({
        title: "كلمة المرور قصيرة",
        description: "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل",
        variant: "destructive"
      });
      return;
    }

    // التحقق من وجود الإيميل أو اسم المستخدم مسبقاً
    const existingCustomers = CustomerAuthService.getCustomers();
    if (existingCustomers.find(c => c.email === email || c.username === username)) {
      toast({
        title: "البيانات مستخدمة مسبقاً",
        description: "الإيميل أو اسم المستخدم مستخدم مسبقاً. يرجى استخدام بيانات أخرى",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // توليد كود التحقق البسيط
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setVerificationCode(code);
    
    console.log('Generated verification code:', code);
    
    // عرض نافذة التحقق مباشرة
    setShowVerificationDialog(true);
    toast({
      title: "كود التحقق",
      description: `كود التحقق الخاص بك هو: ${code}`,
      duration: 10000
    });
    
    setIsLoading(false);
  };

  const handleVerifyCode = () => {
    console.log('Verifying code:', otp, 'Expected:', verificationCode);
    
    if (otp === verificationCode) {
      const registrationSuccess = CustomerAuthService.registerCustomer(email, password, username);
      console.log('Registration result:', registrationSuccess);
      
      if (registrationSuccess) {
        setIsRegistered(true);
        setShowChat(true);
        setShowVerificationDialog(false);
        setOtp('');
        toast({
          title: "تم التسجيل بنجاح",
          description: "تم إنشاء حسابك بنجاح. يمكنك الآن الدردشة مع فريق الدعم",
        });
      } else {
        toast({
          title: "خطأ في التسجيل",
          description: "حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "كود التحقق غير صحيح",
        description: "كود التحقق الذي أدخلته غير صحيح. يرجى التحقق والمحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  const handleForgotPassword = () => {
    toast({
      title: "إعادة تعيين كلمة المرور",
      description: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
    });
    setShowForgotPassword(false);
  };

  const handleLogout = () => {
    CustomerAuthService.logout();
    setIsRegistered(false);
    setShowChat(false);
    setEmail('');
    setUsername('');
    setPassword('');
    setLoginField('');
    setOtp('');
    setVerificationCode('');
    setCurrentView('login');
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل الخروج بنجاح",
    });
  };

  return (
    <div className="min-h-screen relative">
      <StarryBackground />

      <div className="relative z-10">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              💬 دعم العملاء
            </h1>
            <p className="text-xl text-gray-300">
              تواصل مع فريق الدعم الفني لحل مشاكلك
            </p>
          </div>

          {!isRegistered && !showChat ? (
            <div className="max-w-md mx-auto bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-8">
              
              {/* أزرار التبديل بين تسجيل الدخول وإنشاء حساب */}
              <div className="flex mb-6 bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('login')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    currentView === 'login' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  تسجيل الدخول
                </button>
                <button
                  onClick={() => setCurrentView('register')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    currentView === 'register' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  إنشاء حساب
                </button>
              </div>

              {currentView === 'login' ? (
                // نموذج تسجيل الدخول
                <>
                  <h2 className="text-2xl font-bold text-white text-center mb-6">
                    تسجيل الدخول
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        البريد الإلكتروني أو اسم المستخدم
                      </label>
                      <input
                        type="text"
                        value={loginField}
                        onChange={(e) => setLoginField(e.target.value)}
                        placeholder="dark@gmail.com أو dark"
                        className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-300 border border-white/30 rounded-lg outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        كلمة المرور
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="********"
                          className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-300 border border-white/30 rounded-lg outline-none focus:border-blue-500 transition-colors"
                        />
                        <button
                          type="button"
                          className="absolute top-0 left-0 h-full px-4 text-gray-400 hover:text-white transition-colors"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="glow-button w-full py-3"
                      >
                        {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                      </button>
                    </div>
                    <div className="text-center">
                      <button 
                        onClick={() => setShowForgotPassword(true)}
                        className="text-blue-400 hover:underline text-sm"
                      >
                        نسيت كلمة المرور؟
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // نموذج إنشاء حساب جديد
                <>
                  <h2 className="text-2xl font-bold text-white text-center mb-6">
                    إنشاء حساب جديد
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        اسم المستخدم
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="dark"
                        className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-300 border border-white/30 rounded-lg outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="dark@gmail.com"
                        className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-300 border border-white/30 rounded-lg outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        كلمة المرور (6 أحرف على الأقل)
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="********"
                          className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-300 border border-white/30 rounded-lg outline-none focus:border-blue-500 transition-colors"
                        />
                        <button
                          type="button"
                          className="absolute top-0 left-0 h-full px-4 text-gray-400 hover:text-white transition-colors"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={handleRegister}
                        disabled={isLoading}
                        className="glow-button w-full py-3"
                      >
                        {isLoading ? "جاري التسجيل..." : "إنشاء حساب"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : showChat ? (
            <div className="max-w-4xl mx-auto">
              <CustomerChat customerId={CustomerAuthService.getCurrentCustomer()?.id || 0} customerEmail={email} />
              <div className="mt-4 text-center">
                <button onClick={handleLogout} className="text-red-400 hover:underline">
                  تسجيل الخروج
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* نافذة التحقق من الكود */}
      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white/10 backdrop-blur-sm border border-white/30">
          <DialogHeader>
            <DialogTitle className="text-white">التحقق من البريد الإلكتروني</DialogTitle>
            <DialogDescription className="text-gray-300">
              أدخل رمز التحقق المكون من 4 أرقام.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="text-center">
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mb-4">
                <p className="text-blue-200 text-sm mb-2">كود التحقق الخاص بك:</p>
                <p className="text-2xl font-bold text-blue-300">{verificationCode}</p>
              </div>
              
              <div className="font-semibold">
                <InputOTP
                  maxLength={4}
                  value={otp}
                  onChange={setOtp}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
          </div>
          <button onClick={handleVerifyCode} className="glow-button w-full py-3">
            تحقق
          </button>
        </DialogContent>
      </Dialog>

      {/* نافذة نسيان كلمة المرور */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-[425px] bg-white/10 backdrop-blur-sm border border-white/30">
          <DialogHeader>
            <DialogTitle className="text-white">إعادة تعيين كلمة المرور</DialogTitle>
            <DialogDescription className="text-gray-300">
              أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <input
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-300 border border-white/30 rounded-lg outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <button onClick={handleForgotPassword} className="glow-button w-full py-3">
            إرسال رابط إعادة التعيين
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerSupport;
