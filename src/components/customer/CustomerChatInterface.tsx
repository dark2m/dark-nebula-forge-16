
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CustomerChat from '../CustomerChat';
import { useToast } from '@/hooks/use-toast';

const CustomerChatInterface: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل الخروج بنجاح",
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 text-center">
        <h3 className="text-xl text-white mb-2">
          مرحباً {user.user_metadata?.username || user.email?.split('@')[0]}
        </h3>
        <p className="text-gray-400 text-sm">
          {user.email}
        </p>
      </div>
      
      <CustomerChat 
        customerId={user.id} 
        customerEmail={user.email || ''} 
      />
      
      <div className="mt-4 text-center">
        <button 
          onClick={handleLogout} 
          className="text-red-400 hover:underline"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default CustomerChatInterface;
