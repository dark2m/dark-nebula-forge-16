
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserDashboard from '@/components/UserDashboard';
import ProtectedContent from '@/components/ProtectedContent';

const Dashboard = () => {
  return (
    <ProtectedContent pageName="dashboard" fallbackMessage="يجب تسجيل الدخول للوصول للوحة التحكم">
      <UserDashboard />
    </ProtectedContent>
  );
};

export default Dashboard;
