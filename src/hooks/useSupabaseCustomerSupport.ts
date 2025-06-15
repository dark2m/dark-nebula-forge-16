
import { useState, useEffect } from 'react';
import SupabaseCustomerSupportService, {
  type CustomerSupportUser,
  type CustomerSupportMessage,
  type CustomerSupportSession,
  type CustomerLoginAttempt,
} from '@/utils/supabaseCustomerSupportService';

export const useSupabaseCustomerSupport = () => {
  const [customers, setCustomers] = useState<CustomerSupportUser[]>([]);
  const [sessions, setSessions] = useState<CustomerSupportSession[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<CustomerLoginAttempt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [customersData, sessionsData, attemptsData] = await Promise.all([
        SupabaseCustomerSupportService.getCustomers(),
        SupabaseCustomerSupportService.getSessions(),
        SupabaseCustomerSupportService.getLoginAttempts(),
      ]);

      setCustomers(customersData);
      setSessions(sessionsData);
      setLoginAttempts(attemptsData);
    } catch (err) {
      setError('خطأ في تحميل البيانات');
      console.error('Error loading customer support data:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (customerData: {
    email: string;
    username?: string;
    password_hash?: string;
    is_verified?: boolean;
  }) => {
    try {
      const newCustomer = await SupabaseCustomerSupportService.createCustomer(customerData);
      if (newCustomer) {
        setCustomers(prev => [newCustomer, ...prev]);
        return newCustomer;
      }
      return null;
    } catch (err) {
      setError('خطأ في إنشاء العميل');
      console.error('Error creating customer:', err);
      return null;
    }
  };

  const updateCustomer = async (id: string, updates: Partial<CustomerSupportUser>) => {
    try {
      const success = await SupabaseCustomerSupportService.updateCustomer(id, updates);
      if (success) {
        setCustomers(prev =>
          prev.map(customer =>
            customer.id === id ? { ...customer, ...updates } : customer
          )
        );
        return true;
      }
      return false;
    } catch (err) {
      setError('خطأ في تحديث العميل');
      console.error('Error updating customer:', err);
      return false;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const success = await SupabaseCustomerSupportService.deleteCustomer(id);
      if (success) {
        setCustomers(prev => prev.filter(customer => customer.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      setError('خطأ في حذف العميل');
      console.error('Error deleting customer:', err);
      return false;
    }
  };

  const sendMessage = async (messageData: {
    customer_id: string;
    message: string;
    attachments?: any[];
    files?: any[];
    is_from_customer?: boolean;
  }) => {
    try {
      const newMessage = await SupabaseCustomerSupportService.sendMessage(messageData);
      if (newMessage) {
        // تحديث الجلسة أيضاً
        await loadData();
        return newMessage;
      }
      return null;
    } catch (err) {
      setError('خطأ في إرسال الرسالة');
      console.error('Error sending message:', err);
      return null;
    }
  };

  const getMessages = async (customerId: string): Promise<CustomerSupportMessage[]> => {
    try {
      return await SupabaseCustomerSupportService.getMessages(customerId);
    } catch (err) {
      setError('خطأ في تحميل الرسائل');
      console.error('Error loading messages:', err);
      return [];
    }
  };

  const markMessagesAsRead = async (customerId: string) => {
    try {
      const success = await SupabaseCustomerSupportService.markMessagesAsRead(customerId);
      if (success) {
        await loadData();
        return true;
      }
      return false;
    } catch (err) {
      setError('خطأ في تحديث حالة القراءة');
      console.error('Error marking messages as read:', err);
      return false;
    }
  };

  const closeSession = async (customerId: string) => {
    try {
      const success = await SupabaseCustomerSupportService.closeSession(customerId);
      if (success) {
        setSessions(prev =>
          prev.map(session =>
            session.customer_id === customerId
              ? { ...session, status: 'closed' as const }
              : session
          )
        );
        return true;
      }
      return false;
    } catch (err) {
      setError('خطأ في إغلاق الجلسة');
      console.error('Error closing session:', err);
      return false;
    }
  };

  const deleteSession = async (customerId: string) => {
    try {
      const success = await SupabaseCustomerSupportService.deleteSession(customerId);
      if (success) {
        setSessions(prev => prev.filter(session => session.customer_id !== customerId));
        return true;
      }
      return false;
    } catch (err) {
      setError('خطأ في حذف الجلسة');
      console.error('Error deleting session:', err);
      return false;
    }
  };

  const authenticateCustomer = async (email: string, password: string) => {
    try {
      return await SupabaseCustomerSupportService.authenticateCustomer(email, password);
    } catch (err) {
      setError('خطأ في المصادقة');
      console.error('Error authenticating customer:', err);
      return { success: false, error: 'خطأ في الخادم' };
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    customers,
    sessions,
    loginAttempts,
    loading,
    error,
    loadData,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    sendMessage,
    getMessages,
    markMessagesAsRead,
    closeSession,
    deleteSession,
    authenticateCustomer,
  };
};
