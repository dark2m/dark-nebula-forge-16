
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

  useEffect(() => {
    // تأكد من وجود المستخدم قبل إضافته
    if (user && user.email) {
      console.log('Adding Supabase customer:', user);
      const customer = CustomerAuthService.addSupabaseCustomer(user);
      setCustomerData(customer);
    } else {
      console.log('User or user email is missing:', user);
    }
  }, [user]);

  if (!customerData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">مرحباً {user.email}</h2>
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
