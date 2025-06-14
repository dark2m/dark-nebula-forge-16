
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, username?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  resendConfirmation: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Show confirmation message when email is confirmed
        if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
          toast({
            title: "تم التحقق من البريد الإلكتروني",
            description: "تم تفعيل حسابك بنجاح، مرحباً بك!"
          });

          // حفظ نسخة احتياطية من بيانات المستخدم المهمة
          try {
            const { UserDataPersistence } = await import('@/utils/userDataPersistence');
            UserDataPersistence.createUserBackup({
              userId: session.user.id,
              email: session.user.email,
              lastLogin: new Date().toISOString()
            });
          } catch (error) {
            console.error('Error creating backup:', error);
          }
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const signUp = async (email: string, password: string, username?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          username: username || email.split('@')[0]
        }
      }
    });

    if (error) {
      let errorMessage = error.message;
      
      // Translate common error messages to Arabic
      if (error.message.includes('already registered')) {
        errorMessage = 'هذا البريد الإلكتروني مسجل مسبقاً';
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'عنوان البريد الإلكتروني غير صحيح';
      } else if (error.message.includes('Password should be')) {
        errorMessage = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
      }

      toast({
        title: "خطأ في التسجيل",
        description: errorMessage,
        variant: "destructive"
      });
    } else {
      toast({
        title: "تم إنشاء الحساب",
        description: "تم إرسال رسالة تحقق إلى بريدك الإلكتروني. يرجى فتح الرسالة والنقر على رابط التحقق لتفعيل حسابك.",
        duration: 10000 // Show for 10 seconds
      });
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      let errorMessage = error.message;
      
      // Translate common error messages to Arabic
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'بيانات تسجيل الدخول غير صحيحة';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول';
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'عنوان البريد الإلكتروني غير صحيح';
      }

      toast({
        title: "خطأ في تسجيل الدخول",
        description: errorMessage,
        variant: "destructive"
      });
    } else {
      toast({
        title: "مرحباً بك",
        description: "تم تسجيل الدخول بنجاح"
      });
    }

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل الخروج",
        variant: "destructive"
      });
    } else {
      toast({
        title: "تم تسجيل الخروج",
        description: "نراك قريباً"
      });
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "تم الإرسال",
        description: "تحقق من بريدك الإلكتروني لإعادة تعيين كلمة المرور"
      });
    }

    return { error };
  };

  const resendConfirmation = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "تم إعادة الإرسال",
        description: "تم إرسال رسالة التحقق مرة أخرى إلى بريدك الإلكتروني"
      });
    }

    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    resendConfirmation
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
