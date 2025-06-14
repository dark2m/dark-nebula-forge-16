
import React, { useState, useEffect } from 'react';
import { Mail, Eye, EyeOff, User, CheckCircle, LogIn } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import CustomerAuthService from '../utils/customerAuthService';
import CustomerChat from '../components/CustomerChat';
import EmailService from '../utils/emailService';
import { useToast } from '@/hooks/use-toast';

const CustomerSupport = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
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

  const handleLogin = () => {
    if (!email || !password) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive"
      });
      return;
    }

    const loginSuccess = CustomerAuthService.authenticateCustomer(email, password);
    
    if (loginSuccess) {
      const currentCustomer = CustomerAuthService.getCurrentCustomer();
      setIsRegistered(true);
      setShowChat(true);
      setShowLoginForm(false);
      setUsername(currentCustomer?.username || '');
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في خدمة العملاء",
      });
    } else {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        variant: "destructive"
      });
    }
  };

  const handleSendVerification = async () => {
    if (!email || !username || !password) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive"
      });
      return;
    }

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

    // توليد كود التحقق
    const code = EmailService.generateVerificationCode();
    setVerificationCode(code);

    // محاولة إرسال البريد الإلكتروني
    const emailSent = await EmailService.sendVerificationCode(email, code);
    
    if (emailSent) {
      setIsVerificationSent(true);
      toast({
        title: "تم إرسال كود التحقق",
        description: `تم إرسال كود التحقق إلى ${email}. يرجى التحقق من بريدك الإلكتروني وإدخال الكود أدناه.`,
      });
    } else {
      // إذا فشل إرسال البريد، نقوم بالتسجيل المباشر
      const registrationSuccess = CustomerAuthService.registerCustomer(email, password, username);
      
      if (registrationSuccess) {
        setIsRegistered(true);
        setShowChat(true);
        setShowRegisterForm(false);
        toast({
          title: "تم التسجيل بنجاح",
          description: "تم إنشاء حسابك بنجاح. يمكنك الآن الدردشة مع فريق الدعم (لم يتم إرسال رسالة التحقق بسبب خطأ تقني)",
        });
      } else {
        toast({
          title: "خطأ في التسجيل",
          description: "حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى",
          variant: "destructive"
        });
      }
    }
    
    setIsLoading(false);
  };

  const handleVerifyCode = () => {
    if (enteredCode === verificationCode) {
      setIsVerified(true);
      
      // تسجيل العميل بعد التحقق
      const registrationSuccess = CustomerAuthService.registerCustomer(email, password, username);
      
      if (registrationSuccess) {
        setIsRegistered(true);
        setShowChat(true);
        setShowRegisterForm(false);
        toast({
          title: "تم التحقق والتسجيل بنجاح",
          description: "تم تأكيد بريدك الإلكتروني وإنشاء حسابك بنجاح. يمكنك الآن الدردشة مع فريق الدعم",
        });
      } else {
        toast({
          title: "خطأ في التسجيل",
          description: "تم التحقق من البريد ولكن حدث خطأ أثناء إنشاء الحساب",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "كود خاطئ",
        description: "كود التحقق المدخل غير صحيح. يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    const code = EmailService.generateVerificationCode();
    setVerificationCode(code);
    
    const emailSent = await EmailService.sendVerificationCode(email, code);
    
    if (emailSent) {
      toast({
        title: "تم إعادة الإرسال",
        description: "تم إرسال كود تحقق جديد إلى بريدك الإلكتروني",
      });
    } else {
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إعادة إرسال الكود",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    CustomerAuthService.logout();
    setIsRegistered(false);
    setShowChat(false);
    setShowLoginForm(false);
    setShowRegisterForm(false);
    setEmail('');
    setUsername('');
    setPassword('');
    setEnteredCode('');
    setIsVerificationSent(false);
    setIsVerified(false);
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
              سجل بياناتك للحصول على دعم فني متخصص
            </p>
          </div>

          {!isRegistered && !showChat ? (
            <div className="max-w-md mx-auto bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-8">
              {!showLoginForm && !showRegisterForm ? (
                // اختيار تسجيل دخول أو إنشاء حساب جديد
                <>
                  <h2 className="text-2xl font-bold text-white text-center mb-6">
                    خدمة العملاء
                  </h2>
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowLoginForm(true)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 space-x-reverse"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>تسجيل الدخول</span>
                    </button>
                    <button
                      onClick={() => setShowRegisterForm(true)}
                      className="glow-button w-full py-3"
                    >
                      إنشاء حساب جديد
                    </button>
                  </div>
                </>
              ) : showLoginForm ? (
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
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="أدخل بريدك الإلكتروني أو اسم المستخدم"
                          className="w-full pl-4 pr-12 py-3 bg-transparent text-white placeholder-gray-300 border border-white/30 rounded-lg outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
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
                          placeholder="أدخل كلمة المرور"
                          className="w-full pl-12 pr-4 py-3 bg-transparent text-white placeholder-gray-300 border border-white/30 rounded-lg outline-none focus:border-blue-500 transition-colors"
                        />
                        <button
                          type="button"
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <button
                        onClick={handleLogin}
                        className="glow-button w-full py-3"
                      >
                        تسجيل الدخول
                      </button>
                      <button
                        onClick={() => {
                          setShowLoginForm(false);
                          setEmail('');
                          setPassword('');
                        }}
                        className="w-full py-2 text-gray-400 hover:text-white text-sm"
                      >
                        العودة
                      </button>
                    </div>
                  </div>
                </>
              ) : showRegisterForm && !isVerificationSent ? (
                // نموذج التسجيل
                <>
                  <h2 className="text-2xl font-bold text-white text-center mb-6">
                    التسجيل في خدمة العملاء
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        اسم المستخدم
                      </label>
                      <div className="relative">
                        <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="أدخل اسم المستخدم"
                          className="w-full pl-4 pr-12 py-3 bg-transparent text-white placeholder-gray-300 border border-white/30 rounded-lg outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        البريد الإلكتروني
                      </label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="أدخل بريدك الإلكتروني"
                          className="w-full pl-4 pr-12 py-3 bg-transparent text-white placeholder-gray-300 border border-white/30 rounded-lg outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
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
                          placeholder="أدخل كلمة المرور"
                          className="w-full pl-12 pr-4 py-3 bg-transparent text-white placeholder-gray-300 border border-white/30 rounded-lg outline-none focus:border-blue-500 transition-colors"
                        />
                        <button
                          type="button"
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <button
                        onClick={handleSendVerification}
                        disabled={isLoading}
                        className="glow-button w-full py-3"
                      >
                        {isLoading ? "جاري الإرسال..." : "إرسال كود التحقق"}
                      </button>
                      <button
                        onClick={() => {
                          setShowRegisterForm(false);
                          setEmail('');
                          setUsername('');
                          setPassword('');
                        }}
                        className="w-full py-2 text-gray-400 hover:text-white text-sm"
                      >
                        العودة
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // نموذج إدخال كود التحقق
                <>
                  <h2 className="text-2xl font-bold text-white text-center mb-6">
                    تأكيد البريد الإلكتروني
                  </h2>
                  <div className="text-center mb-6">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-2">
                      تم إرسال كود التحقق إلى:
                    </p>
                    <p className="text-blue-400 font-medium">{email}</p>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        كود التحقق
                      </label>
                      <input
                        type="text"
                        value={enteredCode}
                        onChange={(e) => setEnteredCode(e.target.value)}
                        placeholder="أدخل كود التحقق"
                        maxLength={4}
                        className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-300 border border-white/30 rounded-lg outline-none focus:border-blue-500 transition-colors text-center text-2xl tracking-widest"
                      />
                    </div>
                    <div>
                      <button
                        onClick={handleVerifyCode}
                        disabled={!enteredCode || enteredCode.length !== 4}
                        className="glow-button w-full py-3 mb-3"
                      >
                        تأكيد الكود
                      </button>
                      <button
                        onClick={handleResendCode}
                        disabled={isLoading}
                        className="w-full py-2 text-blue-400 hover:text-blue-300 text-sm"
                      >
                        إعادة إرسال الكود
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-300 text-sm text-center">
                  ℹ️ ستحصل على رسالة تأكيد في بريدك الإلكتروني قبل الوصول لفريق الدعم
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
    </div>
  );
};

export default CustomerSupport;
