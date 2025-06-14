
import React from 'react';
import { Link } from 'react-router-dom';

interface GlowingButtonProps {
  to: string;
  children: React.ReactNode;
  gradient?: string;
  glowColor?: string;
}

const GlowingButton: React.FC<GlowingButtonProps> = ({ 
  to, 
  children, 
  gradient = 'from-blue-500 to-purple-600',
  glowColor = 'blue-500'
}) => {
  return (
    <Link to={to} className="relative group inline-block">
      {/* Outer glow */}
      <div className={`absolute -inset-2 bg-gradient-to-r ${gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`}></div>
      
      {/* Animated border */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 animate-pulse`}></div>
      
      {/* Button content */}
      <div className={`relative bg-gradient-to-r ${gradient} text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl transform`}>
        {children}
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
    </Link>
  );
};

export default GlowingButton;
