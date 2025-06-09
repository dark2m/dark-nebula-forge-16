
import React, { useEffect, useState } from 'react';
import AdminStorage from '../utils/adminStorage';

const StarryBackground = () => {
  const [stars, setStars] = useState<Array<{ id: number; left: number; top: number; size: number }>>([]);
  const [backgroundSettings, setBackgroundSettings] = useState(AdminStorage.getSiteSettings().backgroundSettings);

  useEffect(() => {
    const settings = AdminStorage.getSiteSettings().backgroundSettings;
    setBackgroundSettings(settings);

    const generateStars = () => {
      const starArray = [];
      const starCount = settings.starCount || 100;
      const starSizeMultiplier = settings.starSize === 'small' ? 0.5 : settings.starSize === 'large' ? 1.5 : 1;
      
      for (let i = 0; i < starCount; i++) {
        starArray.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: (Math.random() * 2 + 0.5) * starSizeMultiplier
        });
      }
      setStars(starArray);
    };

    generateStars();
  }, []);

  const getAnimationDuration = () => {
    switch (backgroundSettings.animationSpeed) {
      case 'slow': return '5s';
      case 'fast': return '2s';
      default: return '3s';
    }
  };

  const getMeteorSize = () => {
    switch (backgroundSettings.meteorSize) {
      case 'small': return { width: '1px', height: '10px' };
      case 'large': return { width: '3px', height: '20px' };
      default: return { width: '2px', height: '15px' };
    }
  };

  const meteorCount = backgroundSettings.meteorCount || 15;
  const meteorOpacity = backgroundSettings.meteorOpacity || 0.6;
  const starOpacity = backgroundSettings.starOpacity || 0.8;
  const meteortSize = getMeteorSize();

  const backgroundStyle: React.CSSProperties = {};
  if (backgroundSettings.type === 'image' && backgroundSettings.value && backgroundSettings.value.startsWith('data:')) {
    backgroundStyle.backgroundImage = `url(${backgroundSettings.value})`;
    backgroundStyle.backgroundSize = 'cover';
    backgroundStyle.backgroundPosition = 'center';
    backgroundStyle.backgroundRepeat = 'no-repeat';
  } else {
    backgroundStyle.background = `linear-gradient(180deg, ${backgroundSettings.value || '#0a0a0a'} 0%, #1a1a2e 50%, #16213e 100%)`;
  }

  return (
    <div className="starry-background" style={backgroundStyle}>
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
              opacity: starOpacity,
            }}
          />
        ))}
      </div>
      
      {/* Random meteors */}
      {Array.from({ length: meteorCount }, (_, i) => (
        <div 
          key={`meteor-${i}`} 
          className={`meteor-small meteor-direction-${i % 4}`}
          style={{
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: getAnimationDuration(),
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: meteorOpacity,
            width: meteortSize.width,
            height: meteortSize.height,
          }}
        />
      ))}
    </div>
  );
};

export default StarryBackground;
