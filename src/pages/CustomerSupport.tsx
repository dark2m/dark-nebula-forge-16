
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
    <div className="min-h-screen relative customer-support-page">
      <StarryBackground />

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300&display=swap");
        
        .customer-support-page * {
          border: none !important;
        }
        
        .login-form {
          position: absolute;
          width: 300px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          gap: 20px;
          font-family: "Quicksand", sans-serif;
        }
        
        .login-form h2 {
          font-size: 2em;
          color: #fff;
          margin-bottom: 10px;
        }
        
        .input-container {
          position: relative;
          width: 100%;
        }
        
        .ring-input {
          position: relative;
          width: 100%;
          padding: 12px 20px;
          background: transparent;
          border-radius: 40px;
          font-size: 1.2em;
          color: #fff;
          box-shadow: none;
          outline: none;
        }
        
        .ring-input::placeholder {
          color: rgba(255, 255, 255, 0.75);
        }
        
        .ring-input:focus {
          box-shadow: 0 0 20px rgba(0, 120, 255, 0.3);
        }
        
        .ring-button {
          width: 100%;
          background: linear-gradient(45deg, #ff357a, #fff172);
          cursor: pointer;
          padding: 12px 20px;
          border-radius: 40px;
          font-size: 1.2em;
          color: #fff;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        
        .ring-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255, 53, 122, 0.4);
        }
        
        .ring-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .links {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
        }
        
        .links a {
          color: #fff;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.3s ease;
        }
        
        .links a:hover {
          color: #0078ff;
        }
        
        .ring-icon {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
        }
        
        .ring-icon-left {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
        }
      `}</style>

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
