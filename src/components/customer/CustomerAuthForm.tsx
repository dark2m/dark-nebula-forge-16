
import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CustomerAuthFormProps {
  onAuthSuccess: () => void;
}

const CustomerAuthForm: React.FC<CustomerAuthFormProps> = ({ onAuthSuccess }) => {
  const { signIn, signUp, resendConfirmation } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowResendConfirmation(false);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (!error) {
          onAuthSuccess();
        } else if (error.message.includes('Email not confirmed')) {
          setShowResendConfirmation(true);
        }
      } else {
        const { error } = await signUp(email, password, username);
        if (!error) {
          toast({
            title: "تم إنشاء الحساب",
            description: "تم إرسال رسالة تحقق إلى بريدك الإلكتروني. يرجى تأكيد حسابك لبدء الدردشة.",
            duration: 8000,
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (email) {
      await resendConfirmation(email);
    }
  };

  return (
    <div className="ring">
      <i style={{ '--clr': '#00ff0a' } as React.CSSProperties}></i>
      <i style={{ '--clr': '#ff0057' } as React.CSSProperties}></i>
      <i style={{ '--clr': '#fffd44' } as React.CSSProperties}></i>
      <div className="login-form">
        <h2>{isLogin ? 'تسجيل الدخول' : 'تسجيل جديد'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          {!isLogin && (
            <div className="input-container">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="اسم المستخدم"
                className="ring-input"
                style={{paddingRight: '45px'}}
                required
              />
              <User className="ring-icon" size={20} />
            </div>
          )}
          
          <div className="input-container">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              className="ring-input"
              style={{paddingRight: '45px'}}
              required
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
              required
              minLength={6}
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
              type="submit"
              disabled={isSubmitting}
              className="ring-button"
            >
              {isSubmitting ? "جاري المعالجة..." : (isLogin ? "دخول" : "إنشاء حساب")}
            </button>
          </div>
        </form>

        {showResendConfirmation && (
          <div className="text-center mt-4">
            <p className="text-red-400 text-sm mb-3">
              يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول
            </p>
            <button
              type="button"
              onClick={handleResendConfirmation}
              className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4 ml-2" />
              إعادة إرسال رسالة التحقق
            </button>
          </div>
        )}
        
        <div className="links">
          <a onClick={() => {
            setIsLogin(!isLogin);
            setShowResendConfirmation(false);
            setEmail('');
            setPassword('');
            setUsername('');
          }}>
            {isLogin ? 'إنشاء حساب' : 'لديك حساب؟'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default CustomerAuthForm;
