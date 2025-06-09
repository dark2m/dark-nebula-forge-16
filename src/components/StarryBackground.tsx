
import React, { useEffect, useState } from 'react';

const StarryBackground = () => {
  const [stars, setStars] = useState<Array<{ id: number; left: number; top: number; size: number }>>([]);

  useEffect(() => {
    const generateStars = () => {
      const starArray = [];
      for (let i = 0; i < 100; i++) {
        starArray.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: Math.random() * 2 + 0.5
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
      
      {/* Random small meteors */}
      {Array.from({ length: 15 }, (_, i) => (
        <div 
          key={`meteor-${i}`} 
          className={`meteor-small meteor-direction-${i % 4}`}
          style={{
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

export default StarryBackground;
