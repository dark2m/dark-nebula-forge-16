
import React, { useEffect, useState } from 'react';
import SettingsService from '../utils/settingsService';
import type { SiteSettings } from '../types/admin';

const StarryBackground = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const loadedSettings = await SettingsService.getSiteSettings();
        console.log('StarryBackground: Loaded settings:', loadedSettings);
        setSettings(loadedSettings);
      } catch (error) {
        console.error('StarryBackground: Error loading settings:', error);
        // Use default settings if loading fails
        setSettings({
          backgroundSettings: {
            type: 'color',
            value: '#000000',
            starCount: 100,
            meteorCount: 5,
            animationSpeed: 'normal',
            starOpacity: 0.8,
            meteorOpacity: 0.9,
            starSize: 'medium',
            meteorSize: 'medium',
            meteorDirection: 'down',
            meteorColors: ['#ffffff', '#3b82f6', '#8b5cf6']
          }
        } as any);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();

    // Listen for settings updates
    const handleSettingsUpdate = (event: CustomEvent) => {
      console.log('StarryBackground: Settings updated via event');
      setSettings(event.detail.settings);
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    };
  }, []);

  // Don't render anything while loading or if no settings
  if (isLoading) {
    return null;
  }

  // Use default background settings if not available
  const backgroundSettings = settings?.backgroundSettings || {
    type: 'color',
    value: '#000000',
    starCount: 100,
    meteorCount: 5,
    animationSpeed: 'normal',
    starOpacity: 0.8,
    meteorOpacity: 0.9,
    starSize: 'medium',
    meteorSize: 'medium',
    meteorDirection: 'down',
    meteorColors: ['#ffffff', '#3b82f6', '#8b5cf6']
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Background Color or Image */}
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundColor: backgroundSettings.type === 'color' ? (backgroundSettings.value || '#000000') : 'transparent',
          backgroundImage: backgroundSettings.type === 'image' ? `url(${backgroundSettings.value})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Stars */}
      <div className="absolute inset-0">
        {Array.from({ length: backgroundSettings.starCount || 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: backgroundSettings.starSize === 'small' ? '1px' : 
                     backgroundSettings.starSize === 'large' ? '3px' : '2px',
              height: backgroundSettings.starSize === 'small' ? '1px' : 
                      backgroundSettings.starSize === 'large' ? '3px' : '2px',
              backgroundColor: '#ffffff',
              opacity: backgroundSettings.starOpacity || 0.8,
              borderRadius: '50%',
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: backgroundSettings.animationSpeed === 'slow' ? '4s' :
                                backgroundSettings.animationSpeed === 'fast' ? '1s' : '2s'
            }}
          />
        ))}
      </div>

      {/* Meteors */}
      <div className="absolute inset-0">
        {Array.from({ length: backgroundSettings.meteorCount || 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: backgroundSettings.meteorSize === 'small' ? '2px' : 
                     backgroundSettings.meteorSize === 'large' ? '6px' : '4px',
              height: backgroundSettings.meteorSize === 'small' ? '2px' : 
                      backgroundSettings.meteorSize === 'large' ? '6px' : '4px',
              backgroundColor: backgroundSettings.meteorColors?.[i % (backgroundSettings.meteorColors?.length || 1)] || '#ffffff',
              opacity: backgroundSettings.meteorOpacity || 0.9,
              borderRadius: '50%',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: backgroundSettings.animationSpeed === 'slow' ? '6s' :
                                backgroundSettings.animationSpeed === 'fast' ? '2s' : '3s'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default StarryBackground;
