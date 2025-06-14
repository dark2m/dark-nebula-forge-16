
import React from 'react';

const FloatingOrbs: React.FC = () => {
  const orbs = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 50,
    left: Math.random() * 80 + 10,
    top: Math.random() * 80 + 10,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.3 + 0.1,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden">
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute rounded-full bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 blur-xl animate-pulse"
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            left: `${orb.left}%`,
            top: `${orb.top}%`,
            animationDuration: `${orb.duration}s`,
            animationDelay: `${orb.delay}s`,
            opacity: orb.opacity,
            animation: `float ${orb.duration}s ease-in-out infinite ${orb.delay}s, pulse 3s ease-in-out infinite`,
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-20px) translateX(10px) rotate(90deg); }
          50% { transform: translateY(0px) translateX(-10px) rotate(180deg); }
          75% { transform: translateY(20px) translateX(5px) rotate(270deg); }
        }
      `}</style>
    </div>
  );
};

export default FloatingOrbs;
