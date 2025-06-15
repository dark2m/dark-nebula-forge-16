
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { User, LogIn, Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import UserDataPersistence from '@/utils/userDataPersistence';

const UserSessionManager = () => {
  const { user, signIn, signOut } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [savedSession, setSavedSession] = useState(null);

  useEffect(() => {
    // البحث عن جلسة محفوظة عند تحميل المكون
    const session = UserDataPersistence.getUserSession();
    if (session) {
      setSavedSession(session);
      setEmail(session.email);
      setRememberMe(session.rememberMe);
    }

    // تنظيف البيانات القديمة
    UserDataPersistence.cleanOldData();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني وكلمة المرور",
        variant: "destructive"
      });
      return;
    }

    const { error } = await signIn(email, password);
    
    if (!error) {
      // حفظ معلومات الجلسة عند نجاح تسجيل الدخول
      UserDataPersistence.saveUserSession(email, rememberMe);
      
      toast({
        title: "تم تسجيل الدخول",
        description: rememberMe ? "تم حفظ معلومات تسجيل الدخول" : "تم تسجيل الدخول بنجاح"
      });
    }
  };

  const handleQuickLogin = async () => {
    if (savedSession && password) {
      await handleLogin();
    }
  };

  const handleLogout = async () => {
    await signOut();
    if (!rememberMe) {
      UserDataPersistence.clearUserSession();
      setSavedSession(null);
      setEmail('');
    }
  };

  const restoreBackup = () => {
    const backup = UserDataPersistence.restoreUserBackup();
    if (backup) {
      toast({
        title: "تم استعادة النسخة الاحتياطية",
        description: "تم استعادة بياناتك السابقة"
      });
    } else {
      toast({
        title: "لا توجد نسخة احتياطية",
        description: "لم يتم العثور على نسخة احتياطية",
        variant: "destructive"
      });
    }
  };

  const handleRememberMeChange = (checked: boolean | "indeterminate") => {
    // Handle the CheckedState type properly
    setRememberMe(checked === true);
  };

  if (user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <User className="w-5 h-5" />
            مرحباً {user.email}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-gray-400 mb-4">أنت مسجل الدخول حالياً</p>
            <Button onClick={handleLogout} variant="outline" className="w-full">
              تسجيل الخروج
            </Button>
          </div>
          
          <div className="border-t pt-4">
            <Button 
              onClick={restoreBackup} 
              variant="outline" 
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              استعادة النسخة الاحتياطية
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <LogIn className="w-5 h-5" />
          تسجيل الدخول
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {savedSession && (
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-400 text-sm">
              جلسة محفوظة: {savedSession.email}
            </p>
            <p className="text-gray-400 text-xs">
              آخر دخول: {new Date(savedSession.lastLoginTime).toLocaleDateString('ar-SA')}
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            البريد الإلكتروني
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="أدخل بريدك الإلكتروني"
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            كلمة المرور
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="أدخل كلمة المرور"
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={handleRememberMeChange}
          />
          <label htmlFor="remember" className="text-sm text-gray-300">
            تذكر معلومات تسجيل الدخول
          </label>
        </div>

        <div className="space-y-2">
          <Button onClick={handleLogin} className="w-full">
            <LogIn className="w-4 h-4 mr-2" />
            تسجيل الدخول
          </Button>

          {savedSession && (
            <Button 
              onClick={handleQuickLogin} 
              variant="outline" 
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              دخول سريع
            </Button>
          )}
        </div>

        <div className="border-t pt-4">
          <Button 
            onClick={restoreBackup} 
            variant="outline" 
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            استعادة النسخة الاحتياطية
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSessionManager;
