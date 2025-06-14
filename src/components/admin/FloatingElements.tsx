
import React from 'react';
import { Crown, Shield, Star, Zap, Sparkles, Gem } from 'lucide-react';

const FloatingElements: React.FC = () => {
  const elements = [
    { Icon: Crown, delay: '0s', position: 'top-20 left-20' },
    { Icon: Shield, delay: '2s', position: 'top-40 right-32' },
    { Icon: Star, delay: '4s', position: 'bottom-40 left-40' },
    { Icon: Zap, delay: '1s', position: 'top-60 right-20' },
    { Icon: Sparkles, delay: '3s', position: 'bottom-20 right-40' },
    { Icon: Gem, delay: '5s', position: 'top-32 left-60' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-[1]">
      {elements.map(({ Icon, delay, position }, index) => (
        <div
          key={index}
          className={`absolute ${position} animate-pulse opacity-20`}
          style={{
            animationDelay: delay,
            animationDuration: '4s',
          }}
        >
          <div className="relative">
            <Icon className="w-8 h-8 text-blue-400 animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute inset-0 w-8 h-8 bg-blue-400/30 rounded-full blur-xl animate-ping"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloatingElements;
