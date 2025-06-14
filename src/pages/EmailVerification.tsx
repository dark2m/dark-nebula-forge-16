
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import { useToast } from '@/hooks/use-toast';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      setVerificationStatus('error');
      setMessage('رابط التحقق غير صحيح أو منتهي الصلاحية');
      return;
    }

    // التحقق من البيانات المؤقتة
    const pendingVerification = localStorage.getItem('pendingVerification');
    
    if (!pendingVerification) {
      setVerificationStatus('error');
      setMessage('لم يتم العثور على بيانات التحقق');
      return;
    }

    try {
      const verificationData = JSON.parse(pendingVerification);
      
      // التحقق من صحة الرمز والإيميل
      if (verificationData.token !== token || verificationData.email !== email) {
        setVerificationStatus('error');
        setMessage('رابط التحقق غير صحيح');
        return;
      }

      // التحقق من انتهاء الصلاحية (30 دقيقة)
      const thirtyMinutes = 30 * 60 * 1000;
      if (Date.now() - verificationData.timestamp > thirtyMinutes) {
        setVerificationStatus('error');
        setMessage('انتهت صلاحية رابط التحقق. يرجى طلب رابط جديد');
        return;
      }

      // تم التحقق بنجاح - سيتم التعامل مع التسجيل عبر Supabase Auth
      localStorage.removeItem('pendingVerification');
      
      setVerificationStatus('success');
      setMessage('تم تأكيد بريدك الإلكتروني بنجاح! سيتم توجيهك إلى خدمة العملاء...');
      
      toast({
        title: "تم التحقق بنجاح",
        description: "تم تأكيد بريدك الإلكتروني بنجاح",
      });

      // التوجه إلى صفحة دعم العملاء بعد 3 ثوان
      setTimeout(() => {
        navigate('/sport');
      }, 3000);
    } catch (error) {
      console.error('Error parsing verification data:', error);
      setVerificationStatus('error');
      setMessage('حدث خطأ أثناء معالجة البيانات');
    }
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 w-full max-w-md text-center">
          {verificationStatus === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold text-white mb-4">جاري التحقق...</h1>
              <p className="text-gray-300">يرجى الانتظار أثناء تأكيد بريدك الإلكتروني</p>
            </>
          )}

          {verificationStatus === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-4">تم التحقق بنجاح!</h1>
              <p className="text-gray-300 mb-6">{message}</p>
              <div className="animate-pulse text-blue-400">
                سيتم توجيهك خلال ثوان...
              </div>
            </>
          )}

          {verificationStatus === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-4">فشل التحقق</h1>
              <p className="text-gray-300 mb-6">{message}</p>
              <button
                onClick={() => navigate('/sport')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                العودة إلى دعم العملاء
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
