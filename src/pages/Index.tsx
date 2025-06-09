
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to the home page instead of official page
  return <Navigate to="/" replace />;
};

export default Index;
