
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import StarryBackground from '../components/StarryBackground';
import CustomerAuthForm from '../components/customer/CustomerAuthForm';
import CustomerChatInterface from '../components/customer/CustomerChatInterface';

const CustomerSupport = () => {
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <StarryBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <StarryBackground />

      <div className="relative z-10">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              💬 دعم العملاء
            </h1>
            <p className="text-xl text-gray-300">
              سجل دخولك للحصول على دعم فني متخصص
            </p>
          </div>

          {!user ? (
            <div className="flex justify-center items-center min-h-[600px]">
              <CustomerAuthForm onAuthSuccess={() => {}} />
            </div>
          ) : (
            <CustomerChatInterface user={user} onLogout={handleLogout} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
