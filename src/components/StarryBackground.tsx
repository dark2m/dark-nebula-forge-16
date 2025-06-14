
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
      const starCount = settings.starCount || 80;
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
      case 'slow': return '6s';
      case 'fast': return '3s';
      default: return '4s';
    }
  };

  const getMeteorSize = () => {
    switch (backgroundSettings.meteorSize) {
      case 'small': return { width: '1px', height: '8px' };
      case 'large': return { width: '3px', height: '18px' };
      default: return { width: '2px', height: '12px' };
    }
  };

  const meteorCount = backgroundSettings.meteorCount || 10;
  const meteorOpacity = backgroundSettings.meteorOpacity || 0.7;
  const starOpacity = backgroundSettings.starOpacity || 0.8;
  const meteorSize = getMeteorSize();
  const meteorDirection = backgroundSettings.meteorDirection || 'down';
  const meteorColors = backgroundSettings.meteorColors || ['#4ecdc4', '#45b7d1', '#ffeaa7', '#fd79a8', '#a8e6cf', '#81ecec'];

  const backgroundStyle: React.CSSProperties = {};
  if (backgroundSettings.type === 'image' && backgroundSettings.value && backgroundSettings.value.startsWith('data:')) {
    backgroundStyle.backgroundImage = `url(${backgroundSettings.value})`;
    backgroundStyle.backgroundSize = 'cover';
    backgroundStyle.backgroundPosition = 'center';
    backgroundStyle.backgroundRepeat = 'no-repeat';
  } else {
    backgroundStyle.background = `linear-gradient(180deg, ${backgroundSettings.value || '#0a0a0a'} 0%, #1a1a2e 50%, #16213e 100%)`;
  }

  const getMeteorAnimation = (index: number) => {
    if (meteorDirection === 'up') {
      return 'meteor-fall-up';
    } else if (meteorDirection === 'mixed') {
      return index % 2 === 0 ? 'meteor-fall-down' : 'meteor-fall-up';
    }
    return 'meteor-fall-down';
  };

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
      
      {/* Colored meteors */}
      {Array.from({ length: meteorCount }, (_, i) => {
        const colorIndex = i % meteorColors.length;
        const color = meteorColors[colorIndex];
        
        return (
          <div 
            key={`meteor-${i}`} 
            className={`meteor-colored ${getMeteorAnimation(i)}`}
            style={{
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: getAnimationDuration(),
              left: `${Math.random() * 100}%`,
              top: meteorDirection === 'up' ? `${90 + Math.random() * 10}%` : `-${Math.random() * 10}%`,
              opacity: meteorOpacity,
              width: meteorSize.width,
              height: meteorSize.height,
              background: `linear-gradient(180deg, transparent 0%, ${color} 50%, ${color}dd 100%)`,
              boxShadow: `0 0 8px ${color}80`,
              borderRadius: '50px',
            }}
          />
        );
      })}
    </div>
  );
};

export default StarryBackground;
