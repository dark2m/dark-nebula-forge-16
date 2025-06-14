
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InteractiveCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  title,
  description,
  icon: Icon,
  gradient,
  children,
  onClick
}) => {
  return (
    <div 
      className="group relative cursor-pointer transform transition-all duration-500 hover:scale-105"
      onClick={onClick}
    >
      {/* Hover glow effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`}></div>
      
      {/* Card background */}
      <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center group-hover:border-white/20 transition-all duration-300">
        
        {/* Icon with animated background */}
        <div className="relative inline-flex mb-6">
          <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-full blur-lg opacity-60 animate-pulse`}></div>
          <div className={`relative p-4 bg-gradient-to-r ${gradient}/20 rounded-full border border-white/20`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
        
        {/* Content */}
        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-300 mb-6">
          {description}
        </p>
        
        {children}
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-2xl">
          <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCard;
