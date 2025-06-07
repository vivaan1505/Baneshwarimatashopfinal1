import React from 'react';
import { useAds } from './AdInjectorProvider';

interface Props {
  placement: string;
  deviceType: 'desktop' | 'mobile';
}

const AdSlot: React.FC<Props> = ({ placement, deviceType }) => {
  const { ads } = useAds();
  const ad = ads.find(
    a => a.placement === placement && a.device_types.includes(deviceType)
  );
  if (!ad) return null;
  return (
    <span dangerouslySetInnerHTML={{ __html: ad.script_code }} />
  );
};

export default AdSlot;