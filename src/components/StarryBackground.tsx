
import React, { useEffect, useState } from 'react';

const StarryBackground = () => {
  const [stars, setStars] = useState<Array<{ id: number; left: number; top: number; size: number }>>([]);

  useEffect(() => {
    const generateStars = () => {
      const starArray = [];
      for (let i = 0; i < 150; i++) {
        starArray.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: Math.random() * 3 + 1
        });
      }
      setStars(starArray);
    };

    generateStars();
  }, []);

  return (
    <div className="starry-background">
      <div className="stars">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
          />
        ))}
      </div>
      
      {/* 30 colorful long meteors */}
      {Array.from({ length: 30 }, (_, i) => (
        <div 
          key={`meteor-${i}`} 
          className="meteor-long" 
          style={{
            animationDelay: `${Math.random() * 20}s`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

export default StarryBackground;
