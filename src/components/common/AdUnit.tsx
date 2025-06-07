import React, { useEffect } from 'react';

interface AdUnitProps {
  slot: string; // The data-ad-slot ID from AdSense
  format?: string; // e.g., "auto", "rectangle", "vertical"
  responsive?: boolean; // Whether the ad unit is responsive
  style?: React.CSSProperties; // Custom inline styles
}

const AdUnit: React.FC<AdUnitProps> = ({ slot, format = 'auto', responsive = true, style }) => {
  useEffect(() => {
    try {
      // Push the ad unit to the adsbygoogle array
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, [slot]); // Re-run when slot changes

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', ...style }}
      data-ad-client="ca-pub-2832897689800151" // Your AdSense client ID
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    ></ins>
  );
};

export default AdUnit;
