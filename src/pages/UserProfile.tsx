
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import StarryBackground from '../components/StarryBackground';
import UserDashboard from '../components/UserDashboard';

const UserProfile = () => {
  const { user, loading } = useAuth();

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

  if (!user) {
    return <Navigate to="/sport" replace />;
  }

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      <div className="relative z-10">
        <UserDashboard />
      </div>
    </div>
  );
};

export default UserProfile;
