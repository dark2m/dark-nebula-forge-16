
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import StarryBackground from '../components/StarryBackground';
import CustomerChatInterface from '../components/customer/CustomerChatInterface';
import CustomerAuthForm from '../components/customer/CustomerAuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle } from 'lucide-react';

const CustomerSupport = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  useEffect(() => {
    // التحقق من وجود معاملات التحقق في الرابط
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    const email = searchParams.get('email');
    
    // إذا كان المستخدم قد تم التحقق من بريده الإلكتروني
    if (token && type === 'signup' && email) {
      setShowVerificationMessage(true);
      
      // إخفاء الرسالة بعد 10 ثوان
      const timer = setTimeout(() => {
        setShowVerificationMessage(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleAuthSuccess = () => {
    setShowVerificationMessage(false);
  };

  const handleLogout = () => {
    // سيتم التعامل مع تسجيل الخروج في AuthContext
  };

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-4xl">
          {/* رسالة التحقق */}
          {showVerificationMessage && (
            <div className="mb-6 bg-green-500/20 border border-green-500/50 rounded-xl p-6 text-center backdrop-blur-sm">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">تم التحقق بنجاح!</h2>
              <p className="text-green-300 text-lg">
                تم تأكيد بريدك الإلكتروني بنجاح. يرجى تسجيل الدخول للمتابعة.
              </p>
            </div>
          )}

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                خدمة العملاء
              </h1>
              <p className="text-xl text-gray-300">
                نحن هنا لمساعدتك في أي وقت
              </p>
            </div>

            {user ? (
              <CustomerChatInterface user={user} onLogout={handleLogout} />
            ) : (
              <CustomerAuthForm onAuthSuccess={handleAuthSuccess} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
