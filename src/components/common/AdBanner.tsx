import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ 
  slot, 
  format = 'auto', 
  responsive = true,
  className = ''
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      // Check if adsbygoogle is defined
      if (window.adsbygoogle && adRef.current) {
        // Clear any existing ad content
        if (adRef.current.innerHTML) {
          adRef.current.innerHTML = '';
        }
        
        // Create the ad
        const adElement = document.createElement('ins');
        adElement.className = 'adsbygoogle';
        adElement.style.display = 'block';
        adElement.setAttribute('data-ad-client', 'ca-pub-2832897689800151');
        adElement.setAttribute('data-ad-slot', slot);
        
        if (responsive) {
          adElement.setAttribute('data-ad-format', format);
          adElement.setAttribute('data-full-width-responsive', 'true');
        }
        
        adRef.current.appendChild(adElement);
        
        // Push the ad
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('Error loading AdSense ad:', error);
    }
  }, [slot, format, responsive]);

  return (
    <div ref={adRef} className={`ad-container ${className}`}>
      {/* AdSense will populate this div */}
    </div>
  );