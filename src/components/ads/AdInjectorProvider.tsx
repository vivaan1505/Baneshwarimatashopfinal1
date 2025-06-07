import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Ad } from '../../types/ad';

const AdContext = createContext<{ ads: Ad[] }>({ ads: [] });

export const useAds = () => useContext(AdContext);

export const AdInjectorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    const fetchAds = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await supabase
        .from('ads')
        .select('*')
        .eq('status', 'active')
        .or(`start_date.is.null,start_date.lte.${today}`)
        .or(`end_date.is.null,end_date.gte.${today}`);
      setAds((data as Ad[]) || []);
    };
    fetchAds();
  }, []);

  return <AdContext.Provider value={{ ads }}>{children}</AdContext.Provider>;
};