
import React from 'react';
import { useSupabaseFeatures } from '@/hooks/useSupabaseFeatures';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, LogIn, Loader2 } from 'lucide-react';

interface ProtectedContentProps {
  children: React.ReactNode;
  pageName?: string;
  fallbackMessage?: string;
}

const ProtectedContent: React.FC<ProtectedContentProps> = ({
  children,
  pageName = 'protected',
  fallbackMessage = 'يجب تسجيل الدخول للوصول لهذا المحتوى'
}) => {
  const { user, isLoading, isAuthenticated } = useSupabaseFeatures(pageName);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-400">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardContent className="p-6 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white mb-2">محتوى محمي</h3>
          <p className="text-gray-400 mb-4">{fallbackMessage}</p>
          <Button 
            onClick={() => window.location.href = '/sport'}
            className="w-full"
          >
            <LogIn className="w-4 h-4 mr-2" />
            تسجيل الدخول
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

export default ProtectedContent;
