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
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [otp, setOtp] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    CustomerAuthService.initializeDefaultCustomer();
    const currentCustomer = CustomerAuthService.getCurrentCustomer();
    if (currentCustomer) {
      setIsRegistered(true);
      setEmail(currentCustomer.email);
      setShowChat(true);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // إضافة محاولة تسجيل دخول مع تسجيل أفضل
    console.log('Attempting login with:', { email, password });
    const isAuthenticated = CustomerAuthService.authenticateCustomer(email, password);
    console.log('Authentication result:', isAuthenticated);
    
    setIsLoading(false);

    if (isAuthenticated) {
      setIsRegistered(true);
      setShowChat(true);
      toast({
        title: "تم تسجيل الدخول",
        description: "تم تسجيل الدخول بنجاح",
      });
    } else {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "خطأ في البريد الإلكتروني أو كلمة المرور. تأكد من صحة البيانات أو قم بإنشاء حساب جديد",
        variant: "destructive"
      });
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "كلمة المرور ضعيفة",
        description: "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل",
        variant: "destructive"
      });
      return;
    }

    // التحقق من وجود الإيميل مسبقاً
    const existingCustomers = CustomerAuthService.getCustomers();
    if (existingCustomers.find(c => c.email === email)) {
      toast({
        title: "الإيميل مستخدم مسبقاً",
        description: "الإيميل مستخدم مسبقاً. يرجى استخدام إيميل آخر أو تسجيل الدخول إذا كان لديك حساب",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // توليد كود التحقق
    const code = EmailService.generateVerificationCode();
    setVerificationCode(code);
    
    console.log('Generated verification code:', code);
    
    // محاولة إرسال كود التحقق
    const emailSent = await EmailService.sendVerificationCode(email, code);
    
    if (emailSent) {
      setShowVerificationDialog(true);
      toast({
        title: "تم إرسال الكود",
        description: "تم إرسال كود التحقق إلى بريدك الإلكتروني"
      });
    } else {
      // في حالة فشل الإرسال، نسمح للمستخدم بالمتابعة مع عرض الكود
      console.log('Email failed to send, showing verification dialog anyway');
      setShowVerificationDialog(true);
      toast({
        title: "تعذر إرسال الإيميل",
        description: `كود التحقق هو: ${code}`,
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const handleVerifyCode = () => {
    if (otp === verificationCode) {
      const registrationSuccess = CustomerAuthService.registerCustomer(email, password);
      if (registrationSuccess) {
        setIsRegistered(true);
        setShowChat(true);
        setShowVerificationDialog(false);
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

  const handleLogout = () => {
    CustomerAuthService.logout();
    setIsRegistered(false);
    setShowChat(false);
    setEmail('');
    setPassword('');
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
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                إنشاء حساب جديد
              </h2>
              <div className="space-y-6">
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
                    onClick={handleRegister}
                    disabled={isLoading}
                    className="glow-button w-full py-3"
                  >
                    {isLoading ? "جاري التسجيل..." : "تسجيل"}
                  </button>
                </div>
                <p className="text-center text-gray-300">
                  لديك حساب بالفعل؟{' '}
                  <button onClick={handleLogin} className="text-blue-400 hover:underline">
                    تسجيل الدخول
                  </button>
                </p>
              </div>
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

      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white/10 backdrop-blur-sm border border-white/30">
          <DialogHeader>
            <DialogTitle>التحقق من البريد الإلكتروني</DialogTitle>
            <DialogDescription>
              أدخل رمز التحقق المرسل إلى بريدك الإلكتروني.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <div className="font-semibold">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
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
    </div>
  );
};

export default CustomerSupport;
