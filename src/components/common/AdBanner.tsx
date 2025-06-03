import React from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ 
  className = ''
}) => {
  // This is a placeholder component that doesn't render any ads
  return (
    <div className={`ad-container ${className}`}>
      {/* AdSense content removed */}
    </div>
  );
}