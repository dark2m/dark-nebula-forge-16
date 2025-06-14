
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, RefreshCw } from 'lucide-react';
import StarryBackground from '../StarryBackground';
import { useAuth } from '@/contexts/AuthContext';

const AuthPage = () => {
  const { user, loading, signIn, signUp, resendConfirmation } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowResendConfirmation(false);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error && error.message.includes('Email not confirmed')) {
          setShowResendConfirmation(true);
        }
      } else {
        await signUp(email, password, username);
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
    <div className="min-h-screen relative">
      <StarryBackground />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
            </h1>
            <p className="text-gray-400">
              {isLogin ? 'أهلاً بك مرة أخرى' : 'انضم إلينا اليوم'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  اسم المستخدم
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-4 pr-12 py-3 text-white focus:outline-none focus:border-blue-400"
                    placeholder="أدخل اسم المستخدم"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-4 pr-12 py-3 text-white focus:outline-none focus:border-blue-400"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-12 py-3 text-white focus:outline-none focus:border-blue-400"
                  placeholder="أدخل كلمة المرور"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-400 mt-1">
                  كلمة المرور يجب أن تكون 6 أحرف على الأقل
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? 'جاري المعالجة...' : (isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب')}
            </button>

            {showResendConfirmation && (
              <div className="text-center">
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
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setShowResendConfirmation(false);
                }}
                className="text-blue-400 hover:text-blue-300 ml-2 font-medium"
              >
                {isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
              </button>
            </p>
          </div>

          {!isLogin && (
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-300 text-sm text-center">
                ⚠️ بعد التسجيل، ستحتاج لتأكيد بريدك الإلكتروني قبل تسجيل الدخول
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
