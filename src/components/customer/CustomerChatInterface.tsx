
import React, { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import CustomerChat from '../CustomerChat';
import CustomerAuthService from '../../utils/customerAuthService';

interface CustomerChatInterfaceProps {
  user: User;
  onLogout: () => void;
}

const CustomerChatInterface: React.FC<CustomerChatInterfaceProps> = ({ user, onLogout }) => {
  const [customerData, setCustomerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeCustomer = async () => {
      try {
        // تأكد من وجود المستخدم وبياناته الأساسية
        if (user?.id && user?.email) {
          console.log('Initializing customer for user:', user.id);
          
          // إنشاء أو استرجاع بيانات العميل
          const customer = CustomerAuthService.addSupabaseCustomer(user);
          setCustomerData(customer);
        } else {
          console.warn('User data incomplete:', { id: user?.id, email: user?.email });
        }
      } catch (error) {
        console.error('Error initializing customer:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeCustomer();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <div className="text-white ml-3">جاري التحميل...</div>
      </div>
    );
  }

  if (!customerData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">حدث خطأ في تحميل بيانات العميل</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          مرحباً {user.user_metadata?.username || user.email?.split('@')[0]}
        </h2>
        <button
          onClick={onLogout}
          className="bg-red-500/20 text-red-400 px-4 py-2 rounded-md hover:bg-red-500/30 transition-colors"
        >
          تسجيل الخروج
        </button>
      </div>
      
      <CustomerChat 
        customerId={customerData.id.toString()}
        customerEmail={user.email || ''}
      />
    </div>
  );
};

export default CustomerChatInterface;
