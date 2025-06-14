
import React, { ReactNode } from 'react';

interface EnhancedCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'orange' | 'pink';
}

const EnhancedCard: React.FC<EnhancedCardProps> = ({ 
  children, 
  className = '', 
  glowColor = 'blue' 
}) => {
  const glowColors = {
    blue: 'from-blue-500/30 via-cyan-500/20 to-blue-500/30',
    purple: 'from-purple-500/30 via-pink-500/20 to-purple-500/30',
    green: 'from-green-500/30 via-emerald-500/20 to-green-500/30',
    orange: 'from-orange-500/30 via-yellow-500/20 to-orange-500/30',
    pink: 'from-pink-500/30 via-rose-500/20 to-pink-500/30',
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Outer Glow */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${glowColors[glowColor]} rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500`}></div>
      
      {/* Main Card */}
      <div className="relative bg-black/30 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:transform group-hover:scale-[1.02] group-hover:shadow-3xl">
        {/* Top Gradient Line */}
        <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${glowColors[glowColor]}`}></div>
        
        {/* Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Corner Decorations */}
        <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-br ${glowColors[glowColor]} rounded-full blur-xl opacity-50`}></div>
        <div className={`absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br ${glowColors[glowColor]} rounded-full blur-lg opacity-30`}></div>
        
        {/* Animated Border */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-r ${glowColors[glowColor]} transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 opacity-20`}></div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCard;
