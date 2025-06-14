import React, { useState, useEffect } from 'react';
import { Mail, Eye, EyeOff, User, CheckCircle, LogIn } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import CustomerAuthService from '../utils/customerAuthService';
import CustomerChat from '../components/CustomerChat';
import EmailService from '../utils/emailService';
import { useToast } from '@/hooks/use-toast';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const CustomerSupport = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
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

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const generateVerificationToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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

  const handleSendVerificationLink = async () => {
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

    // توليد رابط التحقق
    const verificationToken = generateVerificationToken();
    const verificationLink = `${window.location.origin}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    // حفظ بيانات التحقق مؤقتاً
    localStorage.setItem('pendingVerification', JSON.stringify({
      email,
      password,
      username,
      token: verificationToken,
      timestamp: Date.now()
    }));

    // محاولة إرسال البريد الإلكتروني
    const emailSent = await EmailService.sendVerificationLink(email, verificationLink);
    
    setIsVerificationSent(true);
    setResendTimer(60); // 60 ثانية قبل إمكانية إعادة الإرسال
    
    if (emailSent) {
      toast({
        title: "تم إرسال رابط التحقق",
        description: `تم إرسال رابط التحقق إلى ${email}. يرجى فتح بريدك الإلكتروني والنقر على الرابط لتأكيد حسابك.`,
        duration: 8000,
      });
    } else {
      toast({
        title: "مشكلة في الإرسال",
        description: "حدث خطأ أثناء إرسال البريد الإلكتروني. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
        duration: 8000,
      });
    }
    
    setIsLoading(false);
  };

  const handleResendLink = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    const verificationToken = generateVerificationToken();
    const verificationLink = `${window.location.origin}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
    
    // تحديث بيانات التحقق
    localStorage.setItem('pendingVerification', JSON.stringify({
      email,
      password,
      username,
      token: verificationToken,
      timestamp: Date.now()
    }));
    
    const emailSent = await EmailService.sendVerificationLink(email, verificationLink);
    setResendTimer(60);
    
    if (emailSent) {
      toast({
        title: "تم إعادة الإرسال",
        description: `تم إرسال رابط تحقق جديد إلى بريدك الإلكتروني.`,
        duration: 8000,
      });
    } else {
      toast({
        title: "مشكلة في الإرسال",
        description: "حدث خطأ أثناء إرسال البريد الإلكتروني. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
        duration: 8000,
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
    setIsVerificationSent(false);
    setResendTimer(0);
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل الخروج بنجاح",
    });
  };

  return (
    <div className="min-h-screen relative">
      <StarryBackground />

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300&display=swap");
        
        .ring {
          position: relative;
          width: 500px;
          height: 500px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .ring i {
          position: absolute;
          inset: 0;
          border: 2px solid #fff;
          transition: 0.5s;
        }
        
        .ring i:nth-child(1) {
          border-radius: 38% 62% 63% 37% / 41% 44% 56% 59%;
          animation: animate 6s linear infinite;
        }
        
        .ring i:nth-child(2) {
          border-radius: 41% 44% 56% 59%/38% 62% 63% 37%;
          animation: animate 4s linear infinite;
        }
        
        .ring i:nth-child(3) {
          border-radius: 41% 44% 56% 59%/38% 62% 63% 37%;
          animation: animate2 10s linear infinite;
        }
        
        .ring:hover i {
          border: 6px solid var(--clr);
          filter: drop-shadow(0 0 20px var(--clr));
        }
        
        @keyframes animate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes animate2 {
          0% {
            transform: rotate(360deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
        
        .login-form {
          position: absolute;
          width: 300px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          gap: 20px;
          font-family: "Quicksand", sans-serif;
        }
        
        .login-form h2 {
          font-size: 2em;
          color: #fff;
          margin-bottom: 10px;
        }
        
        .input-container {
          position: relative;
          width: 100%;
        }
        
        .ring-input {
          position: relative;
          width: 100%;
          padding: 12px 20px;
          background: transparent;
          border: 2px solid #fff;
          border-radius: 40px;
          font-size: 1.2em;
          color: #fff;
          box-shadow: none;
          outline: none;
        }
        
        .ring-input::placeholder {
          color: rgba(255, 255, 255, 0.75);
        }
        
        .ring-input:focus {
          border-color: #0078ff;
          box-shadow: 0 0 20px rgba(0, 120, 255, 0.3);
        }
        
        .ring-button {
          width: 100%;
          background: linear-gradient(45deg, #ff357a, #fff172);
          border: none;
          cursor: pointer;
          padding: 12px 20px;
          border-radius: 40px;
          font-size: 1.2em;
          color: #fff;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        
        .ring-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255, 53, 122, 0.4);
        }
        
        .ring-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .links {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
        }
        
        .links a {
          color: #fff;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.3s ease;
        }
        
        .links a:hover {
          color: #0078ff;
        }
        
        .links a:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .ring-icon {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
        }
        
        .ring-icon-left {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
        }
      `}</style>

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
            <div className="flex justify-center items-center min-h-[600px]">
              {!showLoginForm && !showRegisterForm ? (
                // الشاشة الرئيسية لاختيار تسجيل دخول أو إنشاء حساب
                <div className="ring">
                  <i style={{ '--clr': '#00ff0a' } as React.CSSProperties}></i>
                  <i style={{ '--clr': '#ff0057' } as React.CSSProperties}></i>
                  <i style={{ '--clr': '#fffd44' } as React.CSSProperties}></i>
                  <div className="login-form">
                    <h2>خدمة العملاء</h2>
                    <div className="input-container">
                      <button
                        onClick={() => setShowLoginForm(true)}
                        className="ring-button"
                        style={{marginBottom: '15px'}}
                      >
                        تسجيل الدخول
                      </button>
                    </div>
                    <div className="input-container">
                      <button
                        onClick={() => setShowRegisterForm(true)}
                        className="ring-button"
                      >
                        إنشاء حساب جديد
                      </button>
                    </div>
                  </div>
                </div>
              ) : showLoginForm ? (
                // نموذج تسجيل الدخول
                <div className="ring">
                  <i style={{ '--clr': '#00ff0a' } as React.CSSProperties}></i>
                  <i style={{ '--clr': '#ff0057' } as React.CSSProperties}></i>
                  <i style={{ '--clr': '#fffd44' } as React.CSSProperties}></i>
                  <div className="login-form">
                    <h2>تسجيل الدخول</h2>
                    <div className="input-container">
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="البريد الإلكتروني أو اسم المستخدم"
                        className="ring-input"
                        style={{paddingRight: '45px'}}
                      />
                      <Mail className="ring-icon" size={20} />
                    </div>
                    <div className="input-container">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="كلمة المرور"
                        className="ring-input"
                        style={{paddingLeft: '45px'}}
                      />
                      <button
                        type="button"
                        className="ring-icon-left"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <div className="input-container">
                      <button
                        onClick={handleLogin}
                        className="ring-button"
                      >
                        دخول
                      </button>
                    </div>
                    <div className="links">
                      <a onClick={() => {
                        setShowLoginForm(false);
                        setEmail('');
                        setPassword('');
                      }}>
                        العودة
                      </a>
                      <a onClick={() => {
                        setShowLoginForm(false);
                        setShowRegisterForm(true);
                      }}>
                        إنشاء حساب
                      </a>
                    </div>
                  </div>
                </div>
              ) : showRegisterForm && !isVerificationSent ? (
                // نموذج التسجيل
                <div className="ring">
                  <i style={{ '--clr': '#00ff0a' } as React.CSSProperties}></i>
                  <i style={{ '--clr': '#ff0057' } as React.CSSProperties}></i>
                  <i style={{ '--clr': '#fffd44' } as React.CSSProperties}></i>
                  <div className="login-form">
                    <h2>تسجيل جديد</h2>
                    <div className="input-container">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="اسم المستخدم"
                        className="ring-input"
                        style={{paddingRight: '45px'}}
                      />
                      <User className="ring-icon" size={20} />
                    </div>
                    <div className="input-container">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="البريد الإلكتروني"
                        className="ring-input"
                        style={{paddingRight: '45px'}}
                      />
                      <Mail className="ring-icon" size={20} />
                    </div>
                    <div className="input-container">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="كلمة المرور (6 أحرف على الأقل)"
                        className="ring-input"
                        style={{paddingLeft: '45px'}}
                      />
                      <button
                        type="button"
                        className="ring-icon-left"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <div className="input-container">
                      <button
                        onClick={handleSendVerificationLink}
                        disabled={isLoading}
                        className="ring-button"
                      >
                        {isLoading ? "جاري الإرسال..." : "إرسال رابط التحقق"}
                      </button>
                    </div>
                    <div className="links">
                      <a onClick={() => {
                        setShowRegisterForm(false);
                        setEmail('');
                        setUsername('');
                        setPassword('');
                      }}>
                        العودة
                      </a>
                      <a onClick={() => {
                        setShowRegisterForm(false);
                        setShowLoginForm(true);
                      }}>
                        لديك حساب؟
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                // شاشة انتظار التحقق من البريد
                <div className="ring">
                  <i style={{ '--clr': '#00ff0a' } as React.CSSProperties}></i>
                  <i style={{ '--clr': '#ff0057' } as React.CSSProperties}></i>
                  <i style={{ '--clr': '#fffd44' } as React.CSSProperties}></i>
                  <div className="login-form">
                    <h2>تأكيد البريد</h2>
                    <div className="text-center mb-6">
                      <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <p className="text-gray-300 mb-2">
                        تم إرسال رابط التحقق إلى:
                      </p>
                      <p className="text-blue-400 font-medium">{email}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        يرجى فتح بريدك الإلكتروني والنقر على رابط التحقق
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        تحقق من صندوق الوارد أو المجلد المهمل
                      </p>
                    </div>
                    
                    <div className="links">
                      <span 
                        onClick={resendTimer === 0 ? handleResendLink : undefined}
                        style={{
                          color: resendTimer > 0 ? 'rgba(255, 255, 255, 0.4)' : '#fff',
                          cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
                          textDecoration: 'none',
                          transition: 'color 0.3s ease'
                        }}
                      >
                        {resendTimer > 0 ? `إعادة إرسال (${resendTimer}s)` : 'إعادة إرسال'}
                      </span>
                      <a onClick={() => {
                        setIsVerificationSent(false);
                        setResendTimer(0);
                      }}>
                        تعديل البيانات
                      </a>
                    </div>
                  </div>
                </div>
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
    </div>
  );
};

export default CustomerSupport;
